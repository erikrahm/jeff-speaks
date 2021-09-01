import express from "express";
import fs from "fs-extra";
import cors from "cors";
import bodyParser from "body-parser";
import { writeJsonFile } from "write-json-file";

const app = express();
const port = 8080;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/save", (req, res) => {
  const fullDialogue = req.body;

  console.log("GOT IT: ", fullDialogue);

  (async () => {
    await writeJsonFile(
      "../output/categories.json",
      fullDialogue.categories.sort()
    );
    await writeJsonFile(
      "../output/characters.json",
      Object.values(fullDialogue.characters)
    );
    await writeJsonFile(
      "../output/conditions.json",
      Object.values(fullDialogue.conditions)
    );
    await writeJsonFile(
      "../output/dialogue.json",
      Object.values(fullDialogue.dialogue)
    );
    await writeJsonFile(
      "../output/responses.json",
      Object.values(fullDialogue.responses)
    );

    try {
      await fs.copy("../output/", "../client/src/output/");
      console.log("success!");
    } catch (err) {
      console.error(err);
    }
  })();

  // Output the book to the console for debugging
  console.log(fullDialogue);

  res.send("Saved that shit");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
