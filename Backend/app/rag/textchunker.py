from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.rag.preprocessor import normalize_text


def _word_count(text: str) -> int:
    return len(text.split())


class TextChunker:
    def __init__(self, chunk_size: int = 175, chunk_overlap: int = 35):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                "? ",
                "! ",
                "; ",
                ", ",
                " ",
                "",
            ],
            length_function=_word_count,
            is_separator_regex=False,
        )

    def chunk_text(self, text: str) -> list[str]:
        return [normalize_text(chunk) for chunk in self.text_splitter.split_text(text)]
