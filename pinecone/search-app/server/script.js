import { pipeline } from "@xenova/transformers";
import { Pinecone } from "@pinecone-database/pinecone";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const port = 3000;
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index("electronics-ecomm");

app.use(cors());
app.use(bodyParser());

app.listen(port, () => {
  console.log("app listening on", port);
});

app.get("/get-results", async (req, res) => {
  const query = req.query.q;
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  const output = await extractor(query, {
    pooling: "mean",
    normalize: true,
  });
  const vecArr = Array.from(output.data);
  const queryResponse = await index.query({
    vector: vecArr,
    topK: 100,
    includeMetadata: true,
  });
  const productsArr = queryResponse.matches.map((el) => {
    return {
      score: el.score,
      id: el.id,
      name: el.metadata.name,
      image: el.metadata.image,
    };
  });
  res.status(200).send(productsArr);
});
