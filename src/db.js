import { Sequelize } from "sequelize"

const { PG_DB, PG_HOST, PG_PORT, PG_PW, PG_USER } = process.env

const sequelize = new Sequelize(PG_DB, PG_USER, PG_PW, {
  host: PG_HOST,
  port: PG_PORT,
  dialect: "postgres",
  typeValidation: true,
})

export const pgConnect = async () => {
  try {
    await sequelize.authenticate({ logging: true })
    console.log("Successfully connnected to Postgres!")
  } catch (error) {
    console.log(error)
    process.exit(1) 
  }
}

export const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true, logging: true })
    console.log("All tables successfully synchronized!")
  } catch (error) {
    console.log(error)
  }
}



export default sequelize