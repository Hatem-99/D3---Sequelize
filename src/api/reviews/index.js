import createHttpError from "http-errors";
import express from 'express'
import reviewsModel from './model.js'






const reviewsRouter = express.Router();

reviewsRouter.post("/",async (req, res, next) => {
  try {
    const { id } = await reviewsModel.create(req.body)

    res.status(201).send({ id })
  } catch (error) {
    next(error);
  }
});


reviewsRouter.get("/", async (req, res, next) => {
  try {

    const review = await reviewsModel.findAll()
    res.status(200).send(review)
  } catch (error) {
    next(error);
  }
});




reviewsRouter.get("/:reviewId", async (req, res, next) => {
  try {
    const review = await reviewsModel.findByPk(req.params.reviewId)
    if (review) {
      res.send(review)
    } else {
      next(createHttpError(404, `review with id ${req.params.reviewId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});
reviewsRouter.put("/:reviewId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await reviewsModel.update(req.body, {
      where: { id: req.params.reviewId },
      returning: true, 
    })

    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `review with id ${req.params.reviewId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});
reviewsRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await reviewsModel.destroy({ where: { id: req.params.reviewId } })
    if (numberOfDeletedRows) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `review with id ${req.params.reviewId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});



export default reviewsRouter;