"""
Optimizer Module: Automatically refines bullet points, strengthens action verbs,
and seamlessly integrates missing keywords into skills and bullet descriptions without any external API.
"""
import re
import os
import json
import random
from typing import Dict, Any, List

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

def _load_verbs():
    path = os.path.join(DATA_DIR, "action_verbs.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return ["Engineered", "Developed", "Architected", "Implemented", "Optimized", "Designed", "Built"]

ACTION_VERBS = _load_verbs()
WEAK_START_WORDS = {"worked on", "helped to", "responsible for", "made", "did", "assisted with", "involved in", "handled"}

class Optimizer:
    @staticmethod
    def optimize_bullet(bullet: str) -> str:
        """
        Cleans and strengthens a resume bullet point:
        - Replaces weak starting phrases with strong action verbs.
        - Ensures standard capitalization and clean punctuation.
        """
        text = bullet.strip()
        if not text:
            return ""

        # Remove leading bullets, asterisks or dashes
        text = re.sub(r'^[\-\*\•\d\.\)]+\s*', '', text)

        # Check weak starts
        lower_text = text.lower()
        for weak in WEAK_START_WORDS:
            if lower_text.startswith(weak):
                replacement_verb = random.choice(["Spearheaded", "Engineered", "Executed", "Developed", "Facilitated"])
                text = replacement_verb + " " + text[len(weak):].lstrip()
                break

        # If first word is lowercase, capitalize it
        parts = text.split(" ", 1)
        if parts:
            first_word = parts[0].capitalize()
            rest = parts[1] if len(parts) > 1 else ""
            text = f"{first_word} {rest}".strip()

        # Ensure bullet ends with period
        if not text.endswith("."):
            text += "."

        return text

    @staticmethod
    def optimize_resume(resume_data: Dict[str, Any], target_keywords: List[str]) -> Dict[str, Any]:
        """
        Full pass optimization:
        1. Formats and enhances all experience bullets.
        2. Formats and enhances project bullets.
        3. Integrates high-relevance matched keywords into the skills list if absent.
        4. Cleans up formatting and guarantees clean typography.
        """
        optimized = dict(resume_data)

        # 1. Optimize skills
        current_skills = [s.strip() for s in optimized.get("skills", []) if s.strip()]
        existing_skills_lower = set(s.lower() for s in current_skills)

        # Merge relevant target keywords directly into skills
        for kw in target_keywords[:15]:
            if kw.lower() not in existing_skills_lower:
                current_skills.append(kw)
                existing_skills_lower.add(kw.lower())

        optimized["skills"] = current_skills

        # 2. Optimize Experience bullets
        optimized_exp = []
        for exp in optimized.get("experience", []):
            item = dict(exp)
            bullets = item.get("bullets", [])
            new_bullets = [Optimizer.optimize_bullet(b) for b in bullets if b.strip()]
            
            # If no bullets were provided, construct a sensible default bullet based on role and company
            if not new_bullets and item.get("role"):
                new_bullets.append(
                    f"Engineered and delivered core features for {item.get('role')} at {item.get('company', 'the organization')}, optimizing workflow performance."
                )
            item["bullets"] = new_bullets
            optimized_exp.append(item)
        optimized["experience"] = optimized_exp

        # 3. Optimize Project bullets
        optimized_projects = []
        for proj in optimized.get("projects", []):
            item = dict(proj)
            bullets = item.get("bullets", [])
            new_bullets = [Optimizer.optimize_bullet(b) for b in bullets if b.strip()]

            # If only description was given and no bullets, split or convert description to bullet
            if not new_bullets and item.get("description"):
                desc = item.get("description", "")
                parts = [p.strip() for p in desc.split(".") if p.strip()]
                for p in parts[:3]:
                    new_bullets.append(Optimizer.optimize_bullet(p))
            
            if not new_bullets and item.get("name"):
                tech = item.get("techStack", "modern technologies")
                new_bullets.append(f"Architected and deployed {item.get('name')} leveraging {tech} with robust architecture and automated testing.")

            item["bullets"] = new_bullets
            optimized_projects.append(item)
        optimized["projects"] = optimized_projects

        # 4. Summary auto-tune if blank
        summary = optimized.get("summary", "").strip()
        target_role = optimized.get("targetRole", "Software Engineer")
        if not summary:
            top_skills = ", ".join(current_skills[:5]) if current_skills else "Data Structures, Algorithms and Full-Stack Development"
            optimized["summary"] = (
                f"Results-driven {target_role} with proven proficiency in {top_skills}. "
                f"Dedicated to building scalable, high-performance systems and applying clean code methodologies to solve complex engineering challenges."
            )

        return optimized
