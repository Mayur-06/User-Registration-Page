import fitz  # PyMuPDF
import re
import unicodedata
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

    def load(self):

        pdf = fitz.open(self.pdf_path)

        pages = []

        for page in pdf:
            pages.append(page.get_text())

        pdf.close()

        pages = self.remove_headers_footers(pages)

        document = ""

        for page in pages:
            document += self.clean_text(page) + "\n\n"

        return document