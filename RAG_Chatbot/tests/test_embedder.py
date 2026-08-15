from Backend.app.rag.embedder import Embedder

embedder = Embedder()

sentence= "What is the document about"

embedding = embedder.encode(sentence)

print("\nSentence:")
print(sentence)

print("\nEmbedding shape:")
print(embedding.shape)

print("\nFirst 10 values:")
print(embedding[:10])
