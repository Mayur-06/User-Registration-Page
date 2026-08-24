import os
from google import genai
from google.genai import types
from dotenv import load_dotenv


class Gemini:
    """
    Wrapper around Gemini for text generation.
    """

    def __init__(self, model_name="gemini-3.6-flash"):

        load_dotenv()

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY not found in .env"
            )

        self.client = genai.Client(api_key=api_key)
        print(f"Loading Gemini model: {model_name}")

        self.model_name = model_name

        print(f"Gemini model loaded successfully! {model_name}")

    def count_tokens(self, text: str) -> int:
        try:
            response = self.client.models.count_tokens(
                model=self.model_name,
                contents=text,
            )
            return getattr(response, "total_tokens", 0)
        except Exception:
            return max(1, len(text) // 4)

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
    ) -> str:

        prompt = f"""
{system_prompt}

Context and Question:

{user_prompt}
"""

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=temperature,
            ),
        )

        text = response.text.strip()
        if isinstance(text, bytes):
            text = text.decode("utf-8", errors="replace")
        return text