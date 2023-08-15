import Joi from 'joi';
import basicValidator from '../../utils/validationWrapper'

let userValidator: any = {}

userValidator.createUser = {
  body: Joi.object({
    email: basicValidator.email,
    password: basicValidator.password
  })
}

userValidator.loginUser = {
  body: Joi.object({
    email: basicValidator.email,
    password: basicValidator.password
  })
}

export default userValidator