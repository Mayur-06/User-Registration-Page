import faiss

dimension = 384   # BAAI/bge-small-en-v1.5 embedding size

base_index = faiss.IndexFlatL2(dimension)

index = faiss.IndexIDMap(base_index)

faiss.write_index(index, "indexes/faiss.index")

print("Empty FAISS index created.")