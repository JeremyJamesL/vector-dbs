from pinecone.grpc import PineconeGRPC as Pinecone
import json
import config

pc = Pinecone(config.PINECONE_API_KEY)
index = pc.Index("electronics-ecomm")

with open("embeddings_to_upload.json", "r") as f:
    embeddings = json.load(f)

print(f"Type of embeddings: {type(embeddings)}, Length: {len(embeddings)}") 

count = 0
chunk_size = 1000

while count < len(embeddings):
    index.upsert(vectors = embeddings[count:count + chunk_size])
    count += chunk_size
