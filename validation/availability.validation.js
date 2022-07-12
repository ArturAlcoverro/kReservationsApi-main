const Joi = require('joi');
const validate = require('./validate');

/**
 * Function that validates the data of the GET / for availability
 */
 const get = async function (req, res, next) {
    const schema = Joi.object({
        after: Joi.date().timestamp('unix').optional(),
        before: Joi.date().timestamp('unix').optional(),
        num_slots: Joi.number().optional()
    })
    
    return validate(schema, req.query, next)
}

module.exports = get