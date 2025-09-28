import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import Replicate from "replicate";
import dotenv from "dotenv";
import sharp from "sharp";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(bodyParser.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to generate themed image using Minimax image-01
const generateThemedImage = async (
  archetype,
  subjectImageBuffer = null,
  retries = 3
) => {
  try {
    const prompts = {
      viking:
        "A fierce Viking warrior with detailed horned helmet, authentic chainmail armor, leather bracers, braided beard, holding a battle axe, standing in a misty Nordic fjord with dramatic cinematic lighting, photorealistic, highly detailed",
      royal:
        "A majestic medieval monarch with ornate golden crown adorned with precious gems, rich royal robes with ermine trim, jeweled scepter, standing in an opulent throne room with tapestries and stained glass, regal pose, royal portrait style, highly detailed",
      norse:
        "A powerful Norse deity with divine armor crackling with lightning, mystical hammer glowing with runic symbols, ethereal godlike aura, standing in Asgard with rainbow bridge and epic storm clouds, fantasy art style, highly detailed",
    };

    const input = {
      prompt: prompts[archetype] || prompts.viking,
      aspect_ratio: "1:1",
      number_of_images: 1,
      prompt_optimizer: true,
    };

    // If user uploaded an image, use it as subject reference
    if (subjectImageBuffer) {
      // Process the image to ensure it meets requirements
      const processedImage = await sharp(subjectImageBuffer)
        .resize(1024, 1024, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      // Convert buffer to data URL for Replicate
      const base64Image = processedImage.toString("base64");
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;

      input.subject_reference = dataUrl;
    }

    const output = await replicate.run("minimax/image-01", { input });

    // The output is an array of file objects, we need to get the actual URL
    if (output && output[0]) {
      // If it's a File object, get the URL
      if (typeof output[0].url === "function") {
        return output[0].url();
      }
      // If it's already a URL string
      if (typeof output[0] === "string") {
        return output[0];
      }
      // If it's an object with a url property
      if (output[0].url) {
        return output[0].url;
      }
    }

    throw new Error("Invalid output format from Minimax model");
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      // Wait 3 seconds and try again for rate limiting
      await sleep(3000);
      return generateThemedImage(archetype, subjectImageBuffer, retries - 1);
    }
    console.error("Error generating themed image:", error);
    throw error;
  }
};

app.post("/api/forge-saga", upload.single("image"), async (req, res) => {
  try {
    const archetype = req.body.archetype;
    const imageBuffer = req.file ? req.file.buffer : null;

    console.log(
      `🔥 Forging ${archetype} saga${
        imageBuffer ? " with subject reference" : ""
      }...`
    );

    const imageUrl = await generateThemedImage(archetype, imageBuffer);

    console.log("Generated image URL:", imageUrl);

    res.json({
      success: true,
      output: imageUrl,
      service: "Minimax Image-01",
      note: imageBuffer
        ? "Generated themed image using your photo as character reference!"
        : "Generated themed image based on your archetype selection. Upload a photo for personalized results!",
    });
  } catch (err) {
    console.error("Full error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
      details: "Make sure REPLICATE_API_TOKEN is set in your .env file",
    });
  }
});

// Alternative endpoint for basic image generation without reference
app.post("/api/generate-archetype", async (req, res) => {
  try {
    const { archetype } = req.body;
    const imageUrl = await generateThemedImage(archetype);

    res.json({
      success: true,
      output: imageUrl,
      service: "Minimax Image-01",
    });
  } catch (err) {
    console.error("Full error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(4000, () =>
  console.log(
    "🚀 Server running on port 4000 with Minimax Image-01 integration"
  )
);
