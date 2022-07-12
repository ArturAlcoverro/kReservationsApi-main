const Joi = require('joi');
const validate = require('./validate');

// Regex expresion to validate phone numbers format
const PHONE_REGEX = /^[0-9+-]+$/

// Working hours
const OPENING_HOUR = 12
const CLOSING_HOUR = 23

/**
 * Function that validates the data of the GET / for reservations
 */
const get = async function (req, res, next) {
    const schema = Joi.object({
        after: Joi.date().timestamp('unix').optional(),
        before: Joi.date().timestamp('unix').optional(),
        email: Joi.string().trim().email().optional(),
        phone: Joi.string().pattern(PHONE_REGEX).optional()
    })

    return validate(schema, req.query, next)
}

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
 * Function that validates the data of the POST / for reservations
 */
const create = async function (req, res, next) {
    const schema = Joi.object({
        reservationDate: Joi.date().timestamp('unix').required(),
        regionId: Joi.string().guid().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phoneNumber: Joi.string().pattern(PHONE_REGEX).required(),
        email: Joi.string().email().required(),
        numPeople: Joi.number().required(),
        numChildren: Joi.number().required(),
        isSmoker: Joi.boolean().required(),
        isBirthday: Joi.boolean().required(),
    })

    // Check if there are children and smokers in the same reservation
    if ("isSmoker" in req.body && "numChildren" in req.body) {
        if (req.body.numChildren > 0 && (req.body.isSmoker == "true" || req.body.isSmoker == 1))
            return next({
                status: 400,
                error: "Children are not allowed in a smoking region",
            })
    }

    return validate(schema, req.body, next)
}

/**
 * Function that validates the data of the PATH /{id} for reservations
 */
const update = async function (req, res, next) {
    const schema = Joi.object({
        reservationDate: Joi.date().timestamp('unix').optional(),
        regionId: Joi.string().guid().optional(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        phoneNumber: Joi.string().pattern(PHONE_REGEX).optional(),
        email: Joi.string().email().optional(),
        numPeople: Joi.number().optional(),
        numChildren: Joi.number().optional(),
        isSmoker: Joi.boolean().optional(),
        isBirthday: Joi.boolean().optional(),
    })

    // Check if there are children and smokers in the same reservation
    if ("isSmoker" in req.body && "numChildren" in req.body) {
        if (req.body.numChildren > 0 && (req.body.isSmoker == "true" || req.body.isSmoker == 1))
            return next({
                status: 400,
                error: "Children are not allowed in a smoking region",
            })
    }

    return validate(schema, req.body, next)
}

/**
 * Function that validates the data of the GET / for reservations
 */
const validateHour = async function (req, res, next) {
    //The timestamp without seconds
    const ts = req.body.reservationDate - (req.body.reservationDate % 60)
    const isHalfHour = ts % 1800 === 0

    const date = new Date(ts * 1000)
    const hour = date.getHours()
    const minutes = date.getMinutes()

    const formattedHour = hour < 10 ? `0${hour}` : hour
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

    // Check if is a half-hour
    if (!isHalfHour) {
        return next({
            status: 400,
            error: `'${formattedHour}:${formattedMinutes}' is not a valid hour, we only take reservations on the half-hours (e.g. '${formattedHour}:00', '${formattedHour}:30')`,
        })
    }

    // Check if the time is part of the restaurant schedule
    if (hour < OPENING_HOUR ||
        hour > CLOSING_HOUR ||
        (hour === CLOSING_HOUR && minutes === 30)) {
        return next({
            status: 400,
            error: `'${formattedHour}:${formattedMinutes}' is not a valid hour, we only take reservations between ${OPENING_HOUR}:00 and ${CLOSING_HOUR}:00.`,
        })
    }

    return next()
}

module.exports = { get, id, create, update, validateHour }
