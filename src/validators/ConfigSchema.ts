import Joi from "joi";

export const ConfigSchema = Joi.object({
     token: Joi.string().required(),
     client_id: Joi.string().required(),
     type: Joi.string().required(),
     postgres: Joi.object({
          password: Joi.string().required(),
          user: Joi.string().required(),
          host: Joi.string().required(),
          port: Joi.number().required()
     }).required()
});
