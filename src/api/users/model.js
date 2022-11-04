import { DataTypes } from "sequelize"
import sequelize from "../../db.js"
import reviewsModel from "../reviews/model.js"

const usersModel = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }

) 
usersModel.hasMany(reviewsModel)
reviewsModel.belongsTo(usersModel)

export default usersModel