from app.rag.providers.gemini import Gemini




class Generator:

    def __init__(self):
        self.client = Gemini()

    def count_tokens(self, text: str) -> int:
        return self.client.count_tokens(text)

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
    ) -> str:

        return self.client.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=temperature,
        )