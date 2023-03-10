import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const { OPENAI_API_KEY, PORT } = process.env;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from Codex",
  });
});

app.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const prompt = req.body.prompt || "What is react ?";
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(PORT || 4001, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log(`server is up and listening on http://localhost:${PORT}`);
});
