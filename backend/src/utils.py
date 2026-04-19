from fpdf import FPDF

def create_pdf(report_text, filename="Advisory_Report.pdf"):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Title
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(0, 10, "Intelligent Crop Yield Advisory Report", ln=True, align='C')
    pdf.ln(10)
    
    # Content
    pdf.set_font("Arial", '', 11)
    
    # Encode to handle special characters if necessary
    # FPDF standard fonts only support latin-1
    # Replace common unicode characters with ascii equivalents
    report_text = report_text.replace('“', '"').replace('”', '"').replace("'", "'").replace("'", "'")
    
    for line in report_text.split('\n'):
        # Just simple text printing
        # Handle markdown bold by removing or just printing raw
        line = line.replace('**', '')
        line = line.replace('### ', '')
        # Encode latin-1 safely
        try:
            safe_line = line.encode('latin-1', 'replace').decode('latin-1')
        except:
            safe_line = line
        pdf.multi_cell(0, 8, safe_line)
        
    return pdf.output(dest="S").encode("latin-1")
