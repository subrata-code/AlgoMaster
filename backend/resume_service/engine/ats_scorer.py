"""
ATS Scorer: Evaluates resume content across 6 ATS metrics with strict, deterministic scoring.
Zero external APIs.
"""
import re
import os
import json
from typing import Dict, Any, List, Tuple

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

def _load_action_verbs():
    path = os.path.join(DATA_DIR, "action_verbs.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return set(v.lower() for v in json.load(f))
    return set()

ACTION_VERBS = _load_action_verbs()

class ATSScorer:
    @staticmethod
    def score(resume_data: Dict[str, Any], target_keywords: List[str]) -> Dict[str, Any]:
        """
        Calculates ATS compatibility score out of 100 points:
        - Keyword Match: 30 pts
        - Skills Coverage: 20 pts
        - Section Completeness: 20 pts
        - Action Verbs in Bullets: 10 pts
        - Metrics & Quantification: 10 pts
        - Formatting & Structure: 10 pts
        """
        # Collect full textual representation of resume for keyword matching
        full_text_parts = []
        full_text_parts.append(resume_data.get("summary", ""))
        skills = resume_data.get("skills", [])
        full_text_parts.extend(skills)

        all_bullets = []
        for exp in resume_data.get("experience", []):
            full_text_parts.append(exp.get("role", ""))
            full_text_parts.append(exp.get("company", ""))
            for b in exp.get("bullets", []):
                all_bullets.append(b)
                full_text_parts.append(b)

        for proj in resume_data.get("projects", []):
            full_text_parts.append(proj.get("name", ""))
            full_text_parts.append(proj.get("techStack", ""))
            full_text_parts.append(proj.get("description", ""))
            for b in proj.get("bullets", []):
                all_bullets.append(b)
                full_text_parts.append(b)

        full_resume_text = " ".join(full_text_parts).lower()

        # 1. Keyword match rate (30 pts)
        matched_keywords = []
        missed_keywords = []
        for kw in target_keywords:
            if re.search(r'\b' + re.escape(kw.lower()) + r'\b', full_resume_text):
                matched_keywords.append(kw)
            else:
                missed_keywords.append(kw)

        if target_keywords:
            match_ratio = len(matched_keywords) / len(target_keywords)
            keyword_score = round(match_ratio * 30)
        else:
            keyword_score = 25  # default baseline if no specific keywords provided

        # 2. Skills coverage (20 pts)
        # Check if user has strong skills list (minimum 6 relevant technical skills)
        skills_count = len(skills)
        if skills_count >= 8:
            skills_score = 20
        elif skills_count >= 5:
            skills_score = 15
        elif skills_count >= 3:
            skills_score = 10
        else:
            skills_score = 5

        # 3. Section Completeness (20 pts)
        # Summary (4), Experience or Projects (8), Education (4), Contact info (4)
        section_score = 0
        if resume_data.get("summary", "").strip():
            section_score += 4
        if resume_data.get("education") and len(resume_data.get("education")) > 0:
            section_score += 4
        if resume_data.get("experience") and len(resume_data.get("experience")) > 0:
            section_score += 4
        if resume_data.get("projects") and len(resume_data.get("projects")) > 0:
            section_score += 4
        if resume_data.get("email") and (resume_data.get("phone") or resume_data.get("linkedin")):
            section_score += 4

        # 4. Action Verbs (10 pts)
        action_verb_count = 0
        for bullet in all_bullets:
            words = bullet.strip().split()
            if words and words[0].lower().rstrip('ed').rstrip('d') in [v.rstrip('ed').rstrip('d') for v in ACTION_VERBS]:
                action_verb_count += 1
            elif words and words[0].lower() in ACTION_VERBS:
                action_verb_count += 1

        total_bullets = len(all_bullets)
        if total_bullets > 0:
            verb_ratio = action_verb_count / total_bullets
            verb_score = round(min(1.0, verb_ratio * 1.2) * 10)
        else:
            verb_score = 6

        # 5. Quantification & Numbers (10 pts)
        quant_count = 0
        number_pattern = re.compile(r'\b\d+(?:[\.,]\d+)?%?|\b(?:\d+x|\d+k|\d+m)\b', re.IGNORECASE)
        for bullet in all_bullets:
            if number_pattern.search(bullet):
                quant_count += 1

        if total_bullets > 0:
            quant_ratio = quant_count / total_bullets
            quant_score = round(min(1.0, quant_ratio * 1.5) * 10)
        else:
            quant_score = 5

        # 6. Formatting Safety (10 pts)
        # Single column text parsed without invalid tables or binary images
        format_score = 10

        total_score = min(100, max(0, keyword_score + skills_score + section_score + verb_score + quant_score + format_score))

        # Dynamic ATS Suggestions
        suggestions = []
        if missed_keywords:
            top_missed = missed_keywords[:4]
            suggestions.append(f"Incorporate targeted keywords such as: {', '.join(top_missed)} into your skills or project descriptions.")
        if quant_count < 2:
            suggestions.append("Add measurable outcomes and numbers (e.g., 'improved latency by 35%', 'handled 10k+ requests') to bullet points.")
        if verb_score < 7:
            suggestions.append("Begin every bullet point with a vigorous action verb (e.g., Engineered, Spearheaded, Accelerated).")
        if not resume_data.get("summary", "").strip():
            suggestions.append("Include a concise 2-3 sentence Professional Summary tailored to your target job role.")
        if len(skills) < 7:
            suggestions.append("Expand technical skills section to include modern frameworks, languages, and tools relevant to the role.")

        return {
            "score": total_score,
            "breakdown": {
                "keywordMatch": keyword_score,
                "skillsCoverage": skills_score,
                "sectionCompleteness": section_score,
                "actionVerbs": verb_score,
                "quantification": quant_score,
                "formattingSafety": format_score,
            },
            "matched_keywords": matched_keywords[:20],
            "missed_keywords": missed_keywords[:20],
            "suggestions": suggestions[:4],
        }
