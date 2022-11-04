import createHttpError from "http-errors";
import express from "express";
import categoriesModel from "./model.js";
import { Op } from "sequelize";

const categoriesRouter = express.Router();

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { categoriesId } = await categoriesModel.create(req.body);
    res.status(201).send({ id: categoriesId });
  } catch (error) {
    next(error);
  }
});

categoriesRouter.post("/bulk", async (req, res, next) => {
  try {
    const categories = await categoriesModel.bulkCreate([
      { name: "apple" },
      { name: "samsung" },
      { name: "hp" },
      { name: "dell" },
    ]);
    res.send(categories.map((category) => category.id));
  } catch (error) {
    console.log(error)
    next(error);
  }
});

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await categoriesModel.findAll();
    res.send(categories);
  } catch (error) {
    next(error);
  }
});

export default categoriesRouter;
