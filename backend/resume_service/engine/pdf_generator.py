"""
PDF Generator: Uses ReportLab (pure Python, 100% offline, zero external APIs)
Generates single-column ATS-friendly resumes guaranteed to parse accurately in all ATS scanners.
"""
import io
import os
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
    Table,
    TableStyle
)

# ATS standard font family: Helvetica (native PDF safe)
PRIMARY_COLOR = HexColor("#1A202C")
SECONDARY_COLOR = HexColor("#2D3748")
ACCENT_COLOR = HexColor("#2563EB")
MUTED_COLOR = HexColor("#4A5568")
LINE_COLOR = HexColor("#CBD5E1")

class PDFGenerator:
    @staticmethod
    def generate(resume_data: Dict[str, Any], output_path: str = None) -> bytes:
        """
        Creates ATS-compliant single-column resume PDF using ReportLab Flowables.
        Returns bytes buffer or writes to output_path.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            output_path if output_path else buffer,
            pagesize=letter,
            leftMargin=36,
            rightMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()

        # Custom Typography
        name_style = ParagraphStyle(
            'ATSName',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=18,
            leading=22,
            textColor=PRIMARY_COLOR,
            alignment=1  # Centered
        )

        contact_style = ParagraphStyle(
            'ATSContact',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=MUTED_COLOR,
            alignment=1  # Centered
        )

        section_heading_style = ParagraphStyle(
            'ATSSectionHeading',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=14,
            textColor=PRIMARY_COLOR,
            spaceBefore=8,
            spaceAfter=2,
            keepWithNext=True
        )

        item_title_style = ParagraphStyle(
            'ATSItemTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9.5,
            leading=12,
            textColor=PRIMARY_COLOR
        )

        item_subtitle_style = ParagraphStyle(
            'ATSItemSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=9,
            leading=12,
            textColor=MUTED_COLOR
        )

        date_style = ParagraphStyle(
            'ATSDate',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=MUTED_COLOR,
            alignment=2  # Right aligned
        )

        body_style = ParagraphStyle(
            'ATSBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=SECONDARY_COLOR
        )

        bullet_style = ParagraphStyle(
            'ATSBullet',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=SECONDARY_COLOR,
            leftIndent=12,
            firstLineIndent=-8,
            spaceAfter=2
        )

        story = []

        # 1. HEADER (Full Name + Contact)
        full_name = resume_data.get("fullName") or resume_data.get("name") or "Your Name"
        story.append(Paragraph(f"<b>{full_name.upper()}</b>", name_style))
        story.append(Spacer(1, 4))

        contact_items = []
        if resume_data.get("email"):
            contact_items.append(resume_data["email"])
        if resume_data.get("phone"):
            contact_items.append(resume_data["phone"])
        if resume_data.get("location"):
            contact_items.append(resume_data["location"])
        if resume_data.get("linkedin"):
            contact_items.append(f"LinkedIn: {resume_data['linkedin']}")
        if resume_data.get("github"):
            contact_items.append(f"GitHub: {resume_data['github']}")
        if resume_data.get("portfolio"):
            contact_items.append(f"Portfolio: {resume_data['portfolio']}")

        contact_line = "  |  ".join(contact_items)
        story.append(Paragraph(contact_line, contact_style))
        story.append(Spacer(1, 8))
        story.append(HRFlowable(width="100%", thickness=1, color=LINE_COLOR, spaceBefore=2, spaceAfter=8))

        # Helper to add section headers
        def add_section_header(title: str):
            story.append(Paragraph(title.upper(), section_heading_style))
            story.append(HRFlowable(width="100%", thickness=0.75, color=LINE_COLOR, spaceBefore=1, spaceAfter=5))

        # 2. PROFESSIONAL SUMMARY
        summary = resume_data.get("summary", "").strip()
        if summary:
            add_section_header("Professional Summary")
            story.append(Paragraph(summary, body_style))
            story.append(Spacer(1, 4))

        # 3. TECHNICAL SKILLS
        skills = resume_data.get("skills", [])
        if skills:
            add_section_header("Technical Skills")
            skills_str = ", ".join(skills)
            story.append(Paragraph(f"<b>Core Competencies:</b> {skills_str}", body_style))
            story.append(Spacer(1, 4))

        # 4. WORK EXPERIENCE
        experience = resume_data.get("experience", [])
        if experience:
            add_section_header("Work Experience")
            for exp in experience:
                role = exp.get("role", "")
                company = exp.get("company", "")
                date_str = f"{exp.get('startDate', '')} – {exp.get('endDate', 'Present')}".strip(" –")
                loc = exp.get("location", "")

                left_heading = f"<b>{role}</b>"
                if company:
                    left_heading += f" | {company}"
                if loc:
                    left_heading += f" ({loc})"

                table_data = [
                    [
                        Paragraph(left_heading, item_title_style),
                        Paragraph(date_str, date_style)
                    ]
                ]
                t = Table(table_data, colWidths=[380, 160])
                t.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
                    ('TOPPADDING', (0, 0), (-1, -1), 1),
                ]))
                story.append(t)

                for b in exp.get("bullets", []):
                    if b.strip():
                        story.append(Paragraph(f"&bull; {b.strip()}", bullet_style))
                story.append(Spacer(1, 4))

        # 5. PROJECTS
        projects = resume_data.get("projects", [])
        if projects:
            add_section_header("Projects")
            for proj in projects:
                name = proj.get("name", "")
                tech = proj.get("techStack", "")
                link = proj.get("link", "")

                left_title = f"<b>{name}</b>"
                if tech:
                    left_title += f" | <i>{tech}</i>"

                table_data = [
                    [
                        Paragraph(left_title, item_title_style),
                        Paragraph(link, date_style) if link else Paragraph("", date_style)
                    ]
                ]
                t = Table(table_data, colWidths=[380, 160])
                t.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
                    ('TOPPADDING', (0, 0), (-1, -1), 1),
                ]))
                story.append(t)

                for b in proj.get("bullets", []):
                    if b.strip():
                        story.append(Paragraph(f"&bull; {b.strip()}", bullet_style))
                story.append(Spacer(1, 4))

        # 6. EDUCATION
        education = resume_data.get("education", [])
        if education:
            add_section_header("Education")
            for edu in education:
                deg = edu.get("degree", "")
                col = edu.get("college", "")
                yr = edu.get("graduationYear", "")
                cgpa = edu.get("cgpa", "")

                left_str = f"<b>{deg}</b>"
                if col:
                    left_str += f" – {col}"
                if cgpa:
                    left_str += f" (CGPA: {cgpa})"

                table_data = [
                    [
                        Paragraph(left_str, item_title_style),
                        Paragraph(yr, date_style)
                    ]
                ]
                t = Table(table_data, colWidths=[400, 140])
                t.setStyle(TableStyle([
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
                    ('TOPPADDING', (0, 0), (-1, -1), 1),
                ]))
                story.append(t)
                story.append(Spacer(1, 2))

        # 7. CERTIFICATIONS & ACHIEVEMENTS (Optional)
        certs = resume_data.get("certifications", [])
        achievements = resume_data.get("achievements", [])
        if certs or achievements:
            add_section_header("Honors & Certifications")
            for c in certs:
                c_name = c.get("name", "")
                c_iss = c.get("issuer", "")
                c_yr = c.get("year", "")
                line = f"&bull; <b>{c_name}</b>"
                if c_iss:
                    line += f" – {c_iss}"
                if c_yr:
                    line += f" ({c_yr})"
                story.append(Paragraph(line, bullet_style))

            for a in achievements:
                if a.strip():
                    story.append(Paragraph(f"&bull; {a.strip()}", bullet_style))

        # Build PDF
        doc.build(story)

        if output_path:
            with open(output_path, "rb") as f:
                return f.read()
        else:
            buffer.seek(0)
            return buffer.getvalue()
