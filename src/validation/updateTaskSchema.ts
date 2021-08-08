import Joi from 'joi';

const updateTaskSchema = Joi.object({
  name: Joi.string()
    .max(255),
  tracked: Joi.boolean()
    .valid(true, false)
});

export { updateTaskSchema };
