import camelot

def extract_tables_from_pdf(pdf_path: str):
    tables = camelot.read_pdf(pdf_path, pages="all")
    return [table.df.to_dict() for table in tables]
