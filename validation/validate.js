function validate(schema, data, next) {
    const result = schema.validate(data)

    if (result.error)
        return next({
            status: 400,
            error: result.error.details[0].message,
        })

    return next()
}

module.exports = validate
