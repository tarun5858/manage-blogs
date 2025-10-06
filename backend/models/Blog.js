import mongoose from "mongoose";

// 🧩 Reusable sub-schema for repeated structure
const subttileHeadSchema = new mongoose.Schema(
  {
    beforeContent: { type: String, default: "" },
    name: [{ type: String }],
    benefits: [{ type: String }],
    afterContent: { type: String, default: "" },
  },
  { _id: false } // prevent extra _id fields in nested arrays
);

// 📰 Main Blog Schema
const blogSchema = new mongoose.Schema(
  {
    // Basic metadata
    id: { type: Number },
    title: { type: String, required: true },
    description: { type: String },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString("en-GB"),
    },
    likes: { type: Number, default: 0 },
    readTime: { type: Number, default: 5 },
    blogTags: [{ type: String }],
    imageKey: { type: String },

    // Headings and content
    heading: { type: String },
    subheading: { type: String },
    subheading1: { type: String },
    introduction: { type: String },
    introduction1: { type: String },

    // Sections
    subtitle: { type: String },
    subtitleContent: { type: String },
    subttileHead: [subttileHeadSchema],
    subtitle1: { type: String },
    subttileHead1: [subttileHeadSchema],
    subtitle2: { type: String },
    subttileHead2: [subttileHeadSchema],
    subtitle3: { type: String },
    subttileHead3: [subttileHeadSchema],
    subtitle4: { type: String },
    subttileHead4: [subttileHeadSchema],
    subtitle5: { type: String },
    subttileHead5: [subttileHeadSchema],
    subtitle6: { type: String },
    subttileHead6: [subttileHeadSchema],

    // Images positioning
    imagePositions: [
      {
        section: String,
        schemeIndex: Number,
        benefitIndex: Number,
        imageKey: String,
      },
    ],

    // Paragraphs and outcomes
    paragraph1: { type: String },
    outcome: { type: String },
    lesson: { type: String },
    paragraph2: { type: String },
    outcome1: { type: String },
    lesson1: { type: String },
    paragraph3: { type: String },
    outcome2: { type: String },
    lesson2: { type: String },

    // Conclusions and final words
    conclusion: { type: String },
    conclusion1: { type: String },
    conclusion2: { type: String },
    finalword: { type: String },
    finalword1: { type: String },
    finalword2: { type: String },
    finalword3: { type: String },

    // Navigation / Series
    nextSeries: { type: String },
  },
  { timestamps: true }
);

// ✅ Model
const Blog = mongoose.model("Blog", blogSchema, "dynamic_blogs");

export default Blog;


