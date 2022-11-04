import { DataTypes } from "sequelize"
import sequelize from "../../db.js"
import categoriesModel from "../categories/model.js"
import products_categories from './pro_cat_model.js'
import reviewsModel from "../reviews/model.js"

const productsModel = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  }

) 

productsModel.belongsToMany(categoriesModel, {
  through: products_categories,
  foreignKey: {
    name: "productId",
    allowNull: false,
  },
})
categoriesModel.belongsToMany(productsModel, {
  through: products_categories,
  foreignKey: {
    name: "categoryId",
    allowNull: false,
  },
})
productsModel.hasMany(reviewsModel)

reviewsModel.belongsTo(productsModel)


export default productsModel