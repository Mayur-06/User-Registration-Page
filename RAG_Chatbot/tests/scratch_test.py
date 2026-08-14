import time
import torch

from sentence_transformers import SentenceTransformer
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM
)

# ============================================================
# STEP 1 : Load Embedding Model
# ============================================================

print("=" * 60)
print("Loading embedding model...")

start = time.time()

embedder = SentenceTransformer(
    "BAAI/bge-small-en-v1.5"
)

print(f"Loaded in {time.time()-start:.2f} sec")

sentence = "What information is collected?"

embedding = embedder.encode(sentence)

print("Embedding Shape:", embedding.shape)
print()

# ============================================================
# STEP 2 : Load TinyLlama
# ============================================================

print("=" * 60)
print("Loading TinyLlama...")

MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

start = time.time()

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    device_map="auto",
    torch_dtype=torch.float16 if torch.cuda.is_available()
    else torch.float32,
)

print(f"Loaded in {time.time()-start:.2f} sec")
print()

# ============================================================
# STEP 3 : Chat
# ============================================================

messages = [
    {
        "role": "system",
        "content": "You are a helpful AI assistant."
    },
    {
        "role": "user",
        "content": "Explain Retrieval Augmented Generation in 3 sentences."
    }
]

prompt = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True
)

inputs = tokenizer(
    prompt,
    return_tensors="pt"
).to(model.device)

print("=" * 60)
print("Generating...")

start = time.time()

with torch.no_grad():

    output = model.generate(
        **inputs,
        max_new_tokens=100,
        temperature=0.7,
        do_sample=True,
        top_p=0.9,
        pad_token_id=tokenizer.eos_token_id
    )

generation_time = time.time() - start

response = tokenizer.decode(
    output[0],
    skip_special_tokens=True
)

print(f"Generation Time : {generation_time:.2f} sec")
print()

print("=" * 60)
print("MODEL RESPONSE")
print("=" * 60)
print(response)