import { DataTypes } from "sequelize"
import sequelize from "../../db.js"

const products_categoriesModel = sequelize.define(
    "products_categories",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
         
    }
)

export default products_categoriesModel