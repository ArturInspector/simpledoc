"""
Генератор PDF документов
"""

from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from typing import Dict, Any
import os
from jinja2 import Template


def generate_pdf(
    output_path: str,
    data: Dict[str, Any],
    template_content: str = None
) -> str:
    """
    Генерирует PDF документ
    
    Args:
        output_path: Путь для сохранения PDF
        data: Данные для вставки в документ
        template_content: Опциональный шаблон в формате Jinja2
        
    Returns:
        Путь к сгенерированному файлу
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Создаем PDF документ
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    # Стили
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='#1a1a1a',
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    # Содержимое документа
    story = []
    
    if template_content:
        # Используем Jinja2 шаблон
        template = Template(template_content)
        rendered = template.render(**data)
        
        # Парсим и добавляем параграфы
        for line in rendered.split('\n'):
            if line.strip():
                if line.startswith('# '):
                    # Заголовок первого уровня
                    story.append(Paragraph(line[2:], title_style))
                elif line.startswith('## '):
                    story.append(Paragraph(line[3:], styles['Heading2']))
                else:
                    story.append(Paragraph(line, styles['Normal']))
                story.append(Spacer(1, 12))
    else:
        # Простая генерация из данных
        if 'title' in data:
            story.append(Paragraph(data['title'], title_style))
            story.append(Spacer(1, 12))
        
        if 'content' in data:
            story.append(Paragraph(data['content'], styles['Normal']))
            story.append(Spacer(1, 12))
    
    # Строим PDF
    doc.build(story)
    return output_path

