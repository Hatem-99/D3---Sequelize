import createHttpError from "http-errors";
import express from 'express'
import usersModel from './model.js'






const usersRouter = express.Router();

usersRouter.post("/",async (req, res, next) => {
  try {
    const { id } = await usersModel.create(req.body)

    res.status(201).send({ id })
  } catch (error) {
    next(error);
  }
});


usersRouter.get("/", async (req, res, next) => {
  try {

    const user = await usersModel.findAll()
    res.status(200).send(user)
  } catch (error) {
    next(error);
  }
});




usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await usersModel.findByPk(req.params.userId)
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `user with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await usersModel.update(req.body, {
      where: { id: req.params.userId },
      returning: true, 
    })

    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `user with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await usersModel.destroy({ where: { id: req.params.userId } })
    if (numberOfDeletedRows) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `user with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error);
  }
});



export default usersRouter;