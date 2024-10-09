import json
from sentence_transformers import SentenceTransformer, util

output_arr = []
model = SentenceTransformer("all-MiniLM-L6-v2")

with open('../data/bestbuy.json', 'r') as f:
    json_data = json.load(f)
    names = [item["name"] for item in json_data]
    embeddings = model.encode(names, batch_size=32, show_progress_bar=True)
    for i, embedding in enumerate(embeddings):
        new_obj = {}
        new_obj["values"] = embedding.tolist()
        new_obj["id"] = json_data[i]["objectID"]
        new_obj["metadata"] = {**json_data[i]}
        output_arr.append(new_obj)


with open('embeddings_to_upload.json', 'w') as f:
    f.write(json.dumps(output_arr))

