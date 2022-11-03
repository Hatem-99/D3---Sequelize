import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const cartSchema = {
    name: {
      in: ["body"],
      isString: {
        errorMessage: "name is a mandatory field and needs to be a string",
      },
    },
    category: {
      in: ["body"],
      isString: {
        errorMessage: "Category is a mandatory field and needs to be a string",
      },
    },
    image: {
        in: ["body"],
        isString: {
            errorMessage: "Image is a mandatory field and needs to be a url as string "
        }
    },
    description: {
        in: ["body"],
        isString: {
            errorMessage: "Description is a mandatory field and needs to be a url as string "
        }
    },
    price: {
        in: ["body"],
        isNumber: {
            errorMessage: "Price is a mandatory field and needs to be a url as string "
        }
    }
 
  }
  

  
  export const checkCartsSchema = checkSchema(cartSchema) 
  
  export const checkValidationResult = (req, res, next) => {
   
    const errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      
      next(
        createHttpError(400, "Validation errors in request body", {
          errorsList: errors.array(),
        })
      )
    } else {
   
      next()
    }
  }