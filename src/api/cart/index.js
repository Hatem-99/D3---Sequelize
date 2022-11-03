import createHttpError from "http-errors";
import express from 'express'
import cartsModel from './model.js'
import { Op } from "sequelize";
import { checkCartsSchema, checkValidationResult } from "./validetor.js";




const cartsRouter = express.Router();

cartsRouter.post("/", checkCartsSchema, checkValidationResult, async (req, res, next) => {
  try {
    const { id } = await cartsModel.create(req.body)

    res.status(201).send({ id })
  } catch (error) {
    next(error);
  }
});


cartsRouter.get("/", async (req, res, next) => {
  try {
    const query = {}
    if (req.query.name) query.name = { [Op.iLike]: `${req.query.name}%` }
    if (req.query.priceRange) query.price = { [Op.between]: req.query.priceRange.split(",") }
    if (req.query.category) query.category = { [Op.iLike]: `${req.query.category}%` }

    const carts = await cartsModel.findAll({
      where: {
        ...query,
      },
      attributes: req.query.attributes ? req.query.attributes.split(",") : {},
    })
    res.status(200).send(carts)
  } catch (error) {
    next(error);
  }
});




cartsRouter.get("/:cartId", async (req, res, next) => {
  try {
    const cart = await cartsModel.findByPk(req.params.cartId)
    if (cart) {
      res.send(cart)
    } else {
      next(createHttpError(404, `Cart with id ${req.params.cartId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});
cartsRouter.put("/:cartId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await cartsModel.update(req.body, {
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
cartsRouter.delete("/:cartId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await cartsModel.destroy({ where: { id: req.params.cartId } })
    if (numberOfDeletedRows) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `Cart with id ${req.params.cartId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});



export default cartsRouter;