import os
import json
import faiss
import numpy as np

from Backend.app.rag.embedder import Embedder

embedder = Embedder()

chunks = [
    "Simon Electric India collects personal information such as your name, email address, phone number and postal address.",

    "Device information such as IP address, MAC address, IMEI number and operating system may also be collected.",

    "Cookies are used to improve user experience, analytics and advertising.",

    "Personal information may be shared with service providers who help deliver Simon Electric India's services."
]

print("\nGenerating embeddings...")

embeddings = embedder.encode_batch(chunks)

print(f"Embeddings Shape : {embeddings.shape}")
print()
print("-------------------------------------------------")
dimension = embeddings.shape[1]

base_index = faiss.IndexFlatIP(dimension)

index = faiss.IndexIDMap2(base_index)

print("-------------------------------------------------")
ids = np.arange(len(chunks)).astype("int64")

index.add_with_ids(
    embeddings,
    ids
)

print(f"\nIndexed {index.ntotal} chunks.")

os.makedirs("indexes", exist_ok=True)

faiss.write_index(
    index,
    "indexes/faiss.index"
)

print("FAISS index saved.")
print("-------------------------------------------------")
metadata = {}

for idx, chunk in enumerate(chunks):

    metadata[str(idx)] = {
        "chunk_id": idx,
        "doc_id": "sample_document",
        "text": chunk
    }

with open(
    "indexes/chunks_metadata.json",
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        metadata,
        f,
        indent=4,
        ensure_ascii=False
    )

print("Metadata saved.")

print("\nDone!")
