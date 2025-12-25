"""
Модуль для генерации документов и коммерческих предложений
"""

from .docx_generator import generate_docx, generate_docx_from_template
from .pdf_generator import generate_pdf

__all__ = [
    'generate_docx',
    'generate_docx_from_template',
    'generate_pdf',
]

