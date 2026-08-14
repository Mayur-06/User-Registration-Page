from generator import Generator

generator = Generator()

system_prompt = "You are a helpful assistant."

user_prompt = "Explain what Retrieval-Augmented Generation is."

response = generator.generate(
    system_prompt,
    user_prompt
)

print(response)