import fitz  # PyMuPDF
import re
import unicodedata
import base64
from collections import Counter


class DocumentLoader:

    def __init__(self, pdf_path):
        self.pdf_path = pdf_path

    def clean_text(self, text):

        # Unicode normalization
        text = unicodedata.normalize("NFKC", text)

        # Remove icon-font characters
        text = "".join(
            ch for ch in text
            if not (0xE000 <= ord(ch) <= 0xF8FF)
        )

        # Normalize punctuation
        replacements = {
            "–": "-",
            "—": "-",
            "’": "'",
            "‘": "'",
            "“": '"',
            "”": '"',
            "•": "- ",
            "\u00A0": " ",
        }

        for old, new in replacements.items():
            text = text.replace(old, new)

        # Common PDF extraction fixes
        fixes = {
            "dierent": "different",
            "di4erent": "different",
            "di5erent": "different",

            "aect": "affect",
            "a4ect": "affect",
            "a5ect": "affect",

            "eect": "effect",
            "e4ect": "effect",
            "e5ect": "effect",

            "eective": "effective",

            "o-line": "off-line",
            "o4-line": "off-line",
            "o5-line": "off-line",

            "o4er": "offer",
            "o5er": "offer",

            "aliated": "affiliated",
            "a4liate": "affiliate",
            "a5liate": "affiliate",
            "a4liated": "affiliated",
            "a5liated": "affiliated",

            "Oce": "Office",
            "O4ice": "Office",
            "O5ice": "Office",

            "eort": "effort",
            "e4ort": "effort",
            "e5ort": "effort",

            "prole": "profile",
            "condentiality": "confidentiality",
        }

        for wrong, correct in fixes.items():
            text = text.replace(wrong, correct)

        # Fix words broken across lines
        text = re.sub(r'([A-Za-z])-\n([A-Za-z])', r'\1\2', text)

        # Preserve paragraphs while trimming whitespace
        lines = [line.strip() for line in text.split("\n")]
        text = "\n".join(lines)

        # Remove repeated spaces
        text = re.sub(r"[ \t]+", " ", text)

        # Remove too many blank lines
        text = re.sub(r"\n{3,}", "\n\n", text)

        return text.strip()

    def remove_headers_footers(self, pages):

        line_counter = Counter()

        for page in pages:

            lines = [line.strip() for line in page.split("\n") if line.strip()]

            # First 5 lines
            for line in lines[:5]:
                line_counter[line] += 1

            # Last 5 lines
            for line in lines[-5:]:
                line_counter[line] += 1

        repeated = {
            line
            for line, count in line_counter.items()
            if count > len(pages) // 2
        }

        cleaned_pages = []

        for page in pages:

            lines = [
                line
                for line in page.split("\n")
                if line.strip() not in repeated
            ]

            cleaned_pages.append("\n".join(lines))

        return cleaned_pages

    def _table_to_markdown(self, table_data):
        if not table_data:
            return ""

        rows = []
        for row in table_data:
            cells = [str(cell).strip() if cell is not None else "" for cell in row]
            if any(cells):
                rows.append(cells)

        if not rows:
            return ""

        max_cols = max(len(row) for row in rows)
        for row in rows:
            while len(row) < max_cols:
                row.append("")

        md_lines = []
        md_lines.append("| " + " | ".join(rows[0]) + " |")
        md_lines.append("| " + " | ".join(["---"] * max_cols) + " |")
        for row in rows[1:]:
            md_lines.append("| " + " | ".join(row) + " |")

        return "\n".join(md_lines)

    def _normalize_for_comparison(self, text):
        return re.sub(r'\s+', ' ', text).strip()

    def _encode_table_placeholder(self, table_md):
        encoded = base64.b64encode(table_md.encode("utf-8")).decode("ascii")
        return f"__TABLE_START__{encoded}__TABLE_END__"

    def _extract_tables_from_pdf(self, pages_text):
        try:
            import pdfplumber
        except ImportError:
            return pages_text

        try:
            with pdfplumber.open(self.pdf_path) as plumber_pdf:
                pdf = fitz.open(self.pdf_path)
                for i, plumber_page in enumerate(plumber_pdf.pages):
                    if i >= len(pages_text):
                        break

                    page_text = pages_text[i]
                    fitz_page = pdf[i]

                    try:
                        found_tables = plumber_page.find_tables({
                            "vertical_strategy": "lines",
                            "horizontal_strategy": "lines",
                        })

                        for table in found_tables:
                            try:
                                table_data = table.extract()
                                table_md = self._table_to_markdown(table_data)

                                if not table_md:
                                    continue

                                x0, y0, x1, y1 = table.bbox
                                rect = fitz.Rect(x0, y0, x1, y1)
                                table_text = fitz_page.get_text("text", clip=rect).strip()

                                if table_text:
                                    table_text_norm = self._normalize_for_comparison(table_text)
                                    page_text_norm = self._normalize_for_comparison(page_text)

                                    if table_text_norm and table_text_norm in page_text_norm:
                                        placeholder = self._encode_table_placeholder(table_md)
                                        if table_text in page_text:
                                            page_text = page_text.replace(table_text, placeholder, 1)
                                        else:
                                            page_text = page_text.rstrip() + "\n\n" + placeholder
                                    else:
                                        placeholder = "\n\n" + self._encode_table_placeholder(table_md)
                                        page_text = page_text.rstrip() + placeholder
                                else:
                                    placeholder = "\n\n" + self._encode_table_placeholder(table_md)
                                    page_text = page_text.rstrip() + placeholder
                            except Exception:
                                continue
                    except Exception:
                        continue

                    pages_text[i] = page_text

                pdf.close()
        except Exception:
            pass

        return pages_text

    def load(self):
        path_lower = self.pdf_path.lower()

        if path_lower.endswith(".pdf"):
            return self._load_pdf()
        elif path_lower.endswith(".txt"):
            return self._load_txt()
        elif path_lower.endswith(".csv"):
            return self._load_csv()
        elif path_lower.endswith(".docx"):
            return self._load_docx()
        elif path_lower.endswith(".doc"):
            raise ValueError(
                "Legacy .doc files are not supported. Please save as .docx and re-upload."
            )
        else:
            raise ValueError(
                f"Unsupported file type. Got: {self.pdf_path}"
            )

    def _load_pdf(self):
        pdf = fitz.open(self.pdf_path)
        pages = []
        for page in pdf:
            pages.append(page.get_text())
        pdf.close()

        pages = self._extract_tables_from_pdf(pages)

        pages = self.remove_headers_footers(pages)

        document = ""
        for page in pages:
            document += self.clean_text(page) + "\n\n"

        return document

    def _load_txt(self):
        with open(self.pdf_path, "r", encoding="utf-8", errors="replace") as f:
            text = f.read()
        return self.clean_text(text)

    def _load_csv(self):
        import csv
        rows = []
        with open(self.pdf_path, "r", encoding="utf-8", errors="replace", newline="") as f:
            reader = csv.reader(f)
            for row in reader:
                rows.append(", ".join(row))
        text = "\n".join(rows)
        return self.clean_text(text)

    def _load_docx(self):
        from docx import Document as DocxDocument
        doc = DocxDocument(self.pdf_path)
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        text = "\n".join(paragraphs)
        return self.clean_text(text)
