"""
JD Parser Module: Pure Python NLP extraction of skills and requirements from raw Job Descriptions.
Zero external API calls.
"""
import re
import os
import json
from collections import Counter
from typing import List, Dict, Set

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

def _load_json(filename: str):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

STOP_WORDS = set(_load_json("stop_words.json"))
ROLE_KEYWORDS = _load_json("role_keywords.json")

# Common tech terms dictionary for robust extraction
COMMON_TECH_TERMS = {
    "python", "javascript", "typescript", "java", "c++", "c#", "golang", "go", "rust", "ruby", "php",
    "react", "react.js", "next.js", "vue", "angular", "node.js", "express", "express.js", "django",
    "fastapi", "flask", "spring", "spring boot", "html", "html5", "css", "css3", "tailwind", "bootstrap",
    "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "dynamodb", "sqlite", "nosql",
    "graphql", "rest", "rest api", "restful", "microservices", "system design", "data structures", "algorithms",
    "git", "github", "docker", "kubernetes", "k8s", "aws", "azure", "gcp", "linux", "ci/cd",
    "unit testing", "jest", "pytest", "mocha", "selenium", "cypress", "kafka", "rabbitmq", "celery",
    "machine learning", "deep learning", "nlp", "computer vision", "pandas", "numpy", "scikit-learn",
    "tensorflow", "pytorch", "agile", "scrum", "jira", "oop", "object-oriented"
}

class JDParser:
    @staticmethod
    def extract_keywords(jd_text: str, target_role: str = "") -> List[str]:
        """
        Extract primary technical and domain keywords from JD text + role defaults.
        """
        extracted_keywords: Set[str] = set()

        # If role provided, add fallback core keywords
        if target_role and isinstance(ROLE_KEYWORDS, dict):
            matched_role = None
            for key in ROLE_KEYWORDS.keys():
                if key.lower() in target_role.lower() or target_role.lower() in key.lower():
                    matched_role = key
                    break
            if matched_role:
                for kw in ROLE_KEYWORDS[matched_role]:
                    extracted_keywords.add(kw)

        if not jd_text or not jd_text.strip():
            return sorted(list(extracted_keywords))

        clean_text = jd_text.lower()

        # 1. Direct tech term matching (handles multi-word like "system design", "data structures")
        for term in COMMON_TECH_TERMS:
            pattern = r'\b' + re.escape(term) + r'\b'
            if re.search(pattern, clean_text):
                extracted_keywords.add(term.title())

        # 2. Tokenize words for additional frequency extraction
        words = re.findall(r'[a-zA-Z0-9\+#\.]+', clean_text)
        filtered = [
            w for w in words
            if len(w) > 2 and w not in STOP_WORDS and not w.isdigit()
        ]
        
        freq = Counter(filtered)
        # Top frequent meaningful keywords
        for word, count in freq.most_common(20):
            if count >= 2:
                extracted_keywords.add(word.title())

        # Format and de-duplicate
        results = []
        for kw in extracted_keywords:
            clean_kw = kw.strip()
            if clean_kw and clean_kw not in results:
                results.append(clean_kw)

        return results[:35]
