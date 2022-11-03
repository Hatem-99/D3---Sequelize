import createHttpError from "http-errors";
import express from 'express'
import productModel from './model.js'
import { Op } from "sequelize";
import { checkProductSchema, checkValidationResult } from "./validetor.js";




const productsRouter = express.Router();

productsRouter.post("/", checkProductSchema, checkValidationResult, async (req, res, next) => {
  try {
    const { id } = await productModel.create(req.body)

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
    })
    res.status(200).send(product)
  } catch (error) {
    next(error);
  }
});




productsRouter.get("/:cartId", async (req, res, next) => {
  try {
    const cart = await productModel.findByPk(req.params.cartId)
    if (cart) {
      res.send(cart)
    } else {
      next(createHttpError(404, `Cart with id ${req.params.cartId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.put("/:cartId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await productModel.update(req.body, {
      where: { id: req.params.cartId },
      returning: true, 
    })

    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `Cart with id ${req.params.cartId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.delete("/:cartId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await productModel.destroy({ where: { id: req.params.cartId } })
    if (numberOfDeletedRows) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `Cart with id ${req.params.cartId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});



export default productsRouter;