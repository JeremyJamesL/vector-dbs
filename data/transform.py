import json
new_arr = []

with open("bestbuy.json") as w:
    json_data = json.load(w)
    for l in json_data:
        new_obj = {}
        new_obj["name"] = l["name"]
        new_obj["objectID"] = l["objectID"]
        new_arr.append(new_obj)


outfile = open("output.json", 'w', encoding="utf-8")

outfile.write(json.dumps(new_arr, ensure_ascii=False))


