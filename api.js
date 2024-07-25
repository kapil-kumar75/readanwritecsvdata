import express from "express";
import axios from "axios";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import Comment from "./Comments.js";

const router = express.Router();

router.get("/populate", async (req, res) => {
  try {
    const commentUrl = "https://jsonplaceholder.typicode.com/comments";
    const csvDataUrl = "http://cfte.mbwebportal.com/deepak/csvdata.csv";

    const CommentRes = await axios.get(commentUrl);
    const csvRes = await axios.get(csvDataUrl, { responseType: "stream" });
    await Comment.insertMany(CommentRes?.data);

    const csvPath = path.join(path.resolve(), "csvdata.csv");
    const wrt = fs.createWriteStream(csvPath);
    csvRes.data.pipe(wrt);

    wrt.on("finish", () => {
      const result = [];
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (data) => {
          try {
            result.push(data);
          } catch (error) {
            console.log(error);
          }
        })
        .on("end", async () => {
          try {
            await Comment.insertMany(result);
            res.status(200).send("done");
          } catch (error) {
            console.log(error);
          }
        });
    });

    wrt.on("error", (err) => {
      console.log(err);
      res.status(500).send({
        message: err.message,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
});

router.post("/search", async (req, res) => {
  const { name, email, body, limit, sort } = req.body;
  const query = {};

  if (name) query.name = name;
  if (email) query.email = email;
  if (body) query.body = body;

  const opt = {};

  if (limit) opt.limit = parseInt(limit);
  if (sort) opt.sort = sort;

  try {
    const result = await Comment.find(query, null, opt);
    res.status(200).send({
      message: "Successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
});

export default router;
