import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import csv from "csv-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//  Environment variables (fallbacks for local dev)
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey";
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://prehome_website_user:1ywa7PfsUW3pPWvt@lead-tracking.jysawuj.mongodb.net/?retryWrites=true&w=majority";

//  Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

//  Connect MongoDB
mongoose
  .connect(MONGO_URI, {
    dbName: "dynamic-website-blogs",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err.message));

//  Define schema
const CsvDataSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  date: { type: String, default: () => new Date().toLocaleDateString("en-GB") },
  likes: { type: Number, default: 0 },
  readTime: { type: Number, default: 5 },
  imageKey: String,
  blogTags: [String],
  points: [String],
  heading: String,
  subheading: String,
  subheading1: String,
  introduction: String,
  introduction1: String,
  detailImageKey: String,
  subtitle: String,
  subtitleContent: String,
  subttileHead: [
    {
      beforeContent: String,
      name: [String],
      benefits: [String],
      afterContent: String,
    },
  ],
  subtitle1: String,
  subttileHead1: [
    {
      beforeContent: String,
      name: [String],
      benefits: [String],
      afterContent: String,
    },
  ],
  subtitle2: String,
  subttileHead2: [
    {
      beforeContent: String,
      name: [String],
      benefits: [String],
      afterContent: String,
    },
  ],
  imagePositions: [
    {
      section: String,
      schemeIndex: Number,
      benefitIndex: Number,
      imageKey: String,
    },
  ],
  subtitle3: String,
  subttileHead3: [
    {
      beforeContent: String,
      name: [String],
      benefits: [String],
      afterContent: String,
    },
  ],
  subtitle4: String,
  subttileHead4: [
    {
      beforeContent: String,
      name: [String],
      benefits: [String],
      afterContent: String,
    },
  ],
  subtitle5: String,
  subttileHead5: [
    {
      beforeContent: String,
      name: [String],
      benefits: [String],
      afterContent: String,
    },
  ],
  subtitle6: String,
  subttileHead6: [
    {
      beforeContent: String,
      name: [String],
      benefits: [String],
      afterContent: String,
    },
  ],
  paragraph1: String,
  outcome: String,
  lesson: String,
  paragraph2: String,
  outcome1: String,
  lesson1: String,
  paragraph3: String,
  outcome2: String,
  lesson2: String,
  conclusion: String,
  conclusion1: String,
  conclusion2: String,
  finalword: String,
  finalword1: String,
  finalword2: String,
  finalword3: String,
  nextSeries: String,
});

const CsvData = mongoose.model("dynamic_blogs", CsvDataSchema);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({ storage });

// Utility to reconstruct nested objects
function reconstructNestedObject(flatObj) {
  const result = {};
  for (const key in flatObj) {
    if (!Object.prototype.hasOwnProperty.call(flatObj, key)) continue;
    const value = flatObj[key];
    const match = key.match(/([\w]+)\[(\d+)\](?:\.([\w]+))?(?:\[(\d+)\])?/);
    if (match) {
      const [_, arrName, arrIdxStr, prop, subIdxStr] = match;
      const arrIdx = parseInt(arrIdxStr, 10);
      const subIdx = subIdxStr ? parseInt(subIdxStr, 10) : null;
      result[arrName] = result[arrName] || [];
      while (result[arrName].length <= arrIdx) result[arrName].push({});
      if (prop && subIdx !== null) {
        result[arrName][arrIdx][prop] = result[arrName][arrIdx][prop] || [];
        while (result[arrName][arrIdx][prop].length <= subIdx)
          result[arrName][arrIdx][prop].push(null);
        result[arrName][arrIdx][prop][subIdx] = value;
      } else if (prop) {
        result[arrName][arrIdx][prop] = value;
      } else {
        result[arrName][arrIdx] = value;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}

// Clean _id fields recursively
function cleanIds(obj) {
  if (Array.isArray(obj)) obj.forEach(cleanIds);
  else if (obj && typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (key === "_id" && (!obj[key] || obj[key] === "")) delete obj[key];
      else cleanIds(obj[key]);
    }
  }
}

// CSV Upload API
app.post("/upload", upload.single("csv"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No file uploaded" });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      const reconstructed = reconstructNestedObject(data);
      cleanIds(reconstructed);
      results.push(reconstructed);
    })
    .on("end", async () => {
      try {
        await CsvData.insertMany(results);
        res.json({ message: "✅ CSV data saved to MongoDB successfully" });
      } catch (err) {
        console.error("Error saving CSV:", err);
        res.status(500).json({ message: "Error saving to MongoDB", error: err.message });
      }
    });
});

//  Manual Blog Creation API
app.post("/api/blogs/manual", async (req, res) => {
  try {
    const blogData = req.body;
    cleanIds(blogData);
    const newBlog = new CsvData(blogData);
    await newBlog.save();
    res.status(201).json({ message: "✅ Blog saved successfully", blog: newBlog });
  } catch (err) {
    console.error("Error saving blog:", err);
    res.status(500).json({ message: "Error saving blog", error: err.message });
  }
});

// Login API (simple)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// JWT Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Example Protected Route
app.get("/api/secure-blogs", authenticateToken, (req, res) => {
  res.json({ message: "🔒 Protected route access granted", user: req.user });
});

// Health check route for Render
app.get("/", (req, res) => {
  res.send(" Dynamic Blog Server is Running on Render");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
