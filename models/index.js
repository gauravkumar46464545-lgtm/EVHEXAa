import mongoose from "mongoose";
const { Schema, models, model } = mongoose;
if (process.env.NODE_ENV !== "production")
  for (const n of ["Feature", "Article", "Review", "News", "Faq"]) delete models[n];

export const Feature = models.Feature || model("Feature", new Schema(
  { title: String, badge: String, description: String, media: String, mediaType: String, mediaW: Number, mediaH: Number }, { timestamps: true }));

export const Article = models.Article || model("Article", new Schema({
  title: String, slug: { type: String, unique: true, index: true }, author: String, image: String, content: String, metaDescription: String,
  likes: { type: Number, default: 0 }, dislikes: { type: Number, default: 0 },
  comments: [{ name: String, text: String, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true }));

export const Review = models.Review || model("Review", new Schema(
  { name: String, rating: { type: Number, min: 1, max: 5 }, text: String }, { timestamps: true }));

export const News = models.News || model("News", new Schema(
  { title: String, summary: String, image: String, link: String }, { timestamps: true }));

export const Faq = models.Faq || model("Faq", new Schema(
  { question: String, answer: String }, { timestamps: true }));