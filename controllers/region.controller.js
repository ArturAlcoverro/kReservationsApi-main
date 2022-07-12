/**
 * Regions controller
 * @module controllers/region
 */

const sql = require("../database/connection");

/**
 * /region GET Endpoint. Send a list with all the dining regions of the restaurant.
 */
async function get(req, res, next) {
    try {
        const rows = await sql`SELECT * FROM regions`

        if (rows.length === 0) {
            return next({
                status: 404,
                error: `Regions not found`,
            })
        }
        res.status(200).json(rows)

    } catch (err) {
        return next({
            status: 500,
            error: `Server error`,
            trace: err
        })
    }
}

/**
 * /region/{id} GET Endpoint. Send specific dining region of the restaurant.
 */
async function getByID(req, res, next) {
    try {
        const rows = await sql`SELECT * FROM regions WHERE region_id = ${req.params.ID}`

        if (rows.length === 0) {
            return next({
                status: 404,
                error: `Regions not found`,
            })
        }
        res.status(200).json(rows[0])

    } catch (err) {
        return next({
            status: 500,
            error: `Server error`,
            trace: err
        })
    }
}

/**
 * /region/{id} PATCH Endpoint. Modify a dining region
 */
async function update(req, res, next) {
    try {
        const rows = await sql`SELECT * FROM regions WHERE region_id = ${req.params.ID}`

        if (rows.length === 0) {
            return next({
                status: 404,
                error: `Reservations not found`,
            })
        }

        let region = rows[0]

        if ("name" in req.body) region["name"] = req.body.name
        if ("forChildren" in req.body) region["for_children"] = req.body.forChildren
        if ("forSmokers" in req.body) region["for_smokers"] = req.body.forSmokers

        await sql`
            UPDATE regions SET
                name = ${region["name"]},
                for_children = ${region["for_children"]},
                for_smokers = ${region["for_smokers"]}
            WHERE region_id = ${req.params.ID}
        `
        res.status(201).json(region)

    } catch (err) {
        return next({
            status: 500,
            error: `Server error`,
            trace: err
        })
    }
}

module.exports = {
    get,
    getByID,
    update
}