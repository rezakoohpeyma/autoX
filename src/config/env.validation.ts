import Joi from "joi";

export const envValidation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().required(),
  HOST: Joi.string().required(),
  DATABASE_URL: Joi.string().required() 
});