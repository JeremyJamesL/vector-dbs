from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer("all-MiniLM-L6-v2")

sentence = ["Internet security for my computer"]

embedding = model.encode(sentence)
print(embedding[0].tolist())