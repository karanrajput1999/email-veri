const Joi = require("joi");

class RegisterValidator {
  async register(req, res, next) {
    try {
      const Schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      });

      const validate = Schema.validate(req.body);
      if (validate.error) {
        res.send({ error: validate.error.message });
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
}

module.exports = new RegisterValidator();
