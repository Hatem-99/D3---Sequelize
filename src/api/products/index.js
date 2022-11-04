import createHttpError from "http-errors";
import express from 'express'
import productModel from './model.js'
import { Op } from "sequelize";
import { checkProductSchema, checkValidationResult } from "./validetor.js";
import usersModel from "../users/model.js";
import reviewsModel from "../reviews/model.js";
import categoriesModel from "../categories/model.js";
import products_categoriesModel from './pro_cat_model.js'



const productsRouter = express.Router();

productsRouter.post("/", checkProductSchema, checkValidationResult, async (req, res, next) => {
  try {
    const { id } = await productModel.create(req.body)
    await products_categoriesModel.create({
      productId: id,
      categoryId: req.body.categoryId,
    })

    res.status(201).send({ id })
  } catch (error) {
    next(error);
  }
});


productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {}
    if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` }
    if (req.query.priceRange) query.price = { [Op.between]: req.query.priceRange.split(",") }
    if (req.query.category) query.category = { [Op.iLike]: `%${req.query.category}%` }

    const product = await productModel.findAll({
      where: {
        ...query,
      },
      attributes: req.query.attributes ? req.query.attributes.split(",") : {},
      include: [
        { model: categoriesModel, attributes: ["name"],  through: { attributes: [] }  },
        { model: reviewsModel, attributes: ["review", "userId"]},
      ]
    })
  
    res.status(200).send(product)
  } catch (error) {
    next(error);
  }
});




productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await productModel.findByPk(req.params.productId)
    if (product) {
      res.send(product)
    } else {
      next(createHttpError(404, `product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await productModel.update(req.body, {
      where: { id: req.params.productId },
      returning: true, 
    })

    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await productModel.destroy({ where: { id: req.params.productId } })
    if (numberOfDeletedRows) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});




export default productsRouter;