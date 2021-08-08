import Joi from 'joi';

const createTaskSchema = Joi.object({
  name: Joi.string()
    .max(255)
    .required(),
  tracked: Joi.boolean()
    .valid(true, false)
});

export { createTaskSchema };
