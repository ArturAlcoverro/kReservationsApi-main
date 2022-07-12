const Joi = require('joi');
const validate = require('./validate');

/**
 * Function that validates the UUID format of the ID's
 */
const id = async function (req, res, next) {
    const schema = Joi.object({
        ID: Joi.string().guid().required()
    })

    return validate(schema, req.params, next)
}

/**
 * Function that validates the data of the PATH /{id} for regions
 */
const update = async function (req, res, next) {
    const schema = Joi.object({
        name: Joi.string().optional(),
        forChildren: Joi.boolean().optional(),
        forSmokers: Joi.boolean().optional(),
    })

    return validate(schema, req.body, next)
}



module.exports = { id, update }