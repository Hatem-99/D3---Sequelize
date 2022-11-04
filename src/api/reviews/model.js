import { DataTypes } from "sequelize"
import sequelize from "../../db.js"

const reviewsModel = sequelize.define(
  "review",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  }

) 

export default reviewsModel