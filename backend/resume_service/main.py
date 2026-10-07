import os
import sys
import uuid
import base64
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure engine path is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from engine.jd_parser import JDParser
from engine.ats_scorer import ATSScorer
from engine.optimizer import Optimizer
from engine.pdf_generator import PDFGenerator

app = FastAPI(
    title="AlgoMaster ATS Resume Engine",
    description="Offline Python microservice for deterministic ATS scoring and resume generation. Zero external APIs.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EducationItem(BaseModel):
    college: Optional[str] = ""
    degree: Optional[str] = ""
    graduationYear: Optional[str] = ""
    cgpa: Optional[str] = ""

class ExperienceItem(BaseModel):
    company: Optional[str] = ""
    role: Optional[str] = ""
    location: Optional[str] = ""
    startDate: Optional[str] = ""
    endDate: Optional[str] = ""
    isCurrent: Optional[bool] = False
    bullets: Optional[List[str]] = []

class ProjectItem(BaseModel):
    name: Optional[str] = ""
    techStack: Optional[str] = ""
    description: Optional[str] = ""
    link: Optional[str] = ""
    bullets: Optional[List[str]] = []

class CertificationItem(BaseModel):
    name: Optional[str] = ""
    issuer: Optional[str] = ""
    year: Optional[str] = ""

class GenerateResumeRequest(BaseModel):
    fullName: str
    email: str
    phone: Optional[str] = ""
    location: Optional[str] = ""
    github: Optional[str] = ""
    linkedin: Optional[str] = ""
    portfolio: Optional[str] = ""
    targetRole: Optional[str] = ""
    targetCompany: Optional[str] = ""
    jobDescription: Optional[str] = ""
    experienceLevel: Optional[str] = "Fresher"
    summary: Optional[str] = ""
    skills: Optional[List[str]] = []
    education: Optional[List[EducationItem]] = []
    experience: Optional[List[ExperienceItem]] = []
    projects: Optional[List[ProjectItem]] = []
    certifications: Optional[List[CertificationItem]] = []
    achievements: Optional[List[str]] = []

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AlgoMaster Python Resume Service",
        "external_api_dependencies": False
    }

@app.post("/parse-jd")
def parse_job_description(payload: Dict[str, Any]):
    jd = payload.get("jobDescription", "")
    role = payload.get("targetRole", "")
    keywords = JDParser.extract_keywords(jd, role)
    return {"keywords": keywords}

@app.post("/generate")
def generate_resume(req: GenerateResumeRequest):
    try:
        raw_data = req.model_dump()

        # 1. Parse JD and extract target keywords
        target_keywords = JDParser.extract_keywords(
            raw_data.get("jobDescription", ""),
            raw_data.get("targetRole", "")
        )

        # 2. Optimize content (strengthen verbs, integrate matched keywords, format bullets)
        optimized_data = Optimizer.optimize_resume(raw_data, target_keywords)

        # 3. Calculate deterministic ATS Score and suggestions
        ats_result = ATSScorer.score(optimized_data, target_keywords)

        # 4. Generate ATS-compliant single-column PDF binary
        pdf_bytes = PDFGenerator.generate(optimized_data)
        pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")

        return {
            "success": True,
            "atsScore": ats_result["score"],
            "atsBreakdown": ats_result["breakdown"],
            "keywordsMatched": ats_result["matched_keywords"],
            "keywordsMissed": ats_result["missed_keywords"],
            "suggestions": ats_result["suggestions"],
            "optimizedData": optimized_data,
            "pdfBase64": pdf_base64,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=False)
