/**
 * Reservations controller
 * @module controllers/reservation
 */

const sql = require("../database/connection");
const tablesAlgorithm = require("../utils/tablesBacktraking")

/**
 * /reservation GET Endpoint. Sends a list of reservations, optionally filtered.
 */
async function get(req, res, next) {
    try {
        let after
        let before

        if ("after" in req.query) after = new Date(parseInt(req.query.after) * 1000).toISOString()
        if ("before" in req.query) before = new Date(parseInt(req.query.before) * 1000).toISOString()

        const rows = await sql`
            SELECT * FROM reservations WHERE ( TRUE
            ${req.query.phone ?
                sql`AND phone_number = ${req.query.phone}` : sql``}
            ${req.query.email ?
                sql`AND email = ${req.query.email}` : sql``}
            ${after ?
                sql`AND reservation_date > ${after}` : sql``} 
            ${before ?
                sql`AND reservation_date < ${before}` : sql``}
            )
        `
        if (rows.length === 0)
            return next({
                status: 404,
                error: `Reservations not found`,
            })

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
 * /reservation/{id} GET Endpoint. Sends a specific reservation.
 */
async function getByID(req, res, next) {
    try {
        const rows = await sql`SELECT * FROM reservations WHERE reservation_id = ${req.params.ID}`

        if (rows.length === 0) {
            return next({
                status: 404,
                error: `Reservations not found`,
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
 * /reservation POST Endpoint. Create a new reservation.
 */
async function create(req, res, next) {
    try {
        const isChildren = req.body.numChildren > 0
        const isSmoker = req.body.isSmoker == "true" || req.body.isSmoker == 1
        const reservationDate = new Date(
            parseInt(req.body.reservationDate) * 1000
        ).toISOString()

        // Check that the specified region exists and allows the mentioned clients
        let error = await checkRegion(req.body.regionId, isChildren, isSmoker)

        if (error)
            return next({
                status: 400,
                error: error,
            })

        // Select available tables at the specified time
        const availableTables = await getAvailableTables(req.body.regionId, reservationDate)

        // Check that the available tables have enough capacity
        const capacity = availableTables.reduce((p, c) => p + c.capacity, 0)
        if (capacity < req.body.numPeople)
            return next({
                status: 400,
                error: `The specified region does not have enough space for this hour (space avaialble: '${capacity}').`,
            })

        // Create reservation
        let reservation = await sql`
            INSERT INTO reservations 
                ("reservation_date", "region_id", "first_name", "last_name", "phone_number", 
                "email", "num_people", "num_children", "is_smoker", "is_birthday")
            VALUES
                (
                    ${reservationDate},
                    ${req.body.regionId},
                    ${req.body.firstName},
                    ${req.body.lastName},
                    ${req.body.phoneNumber},
                    ${req.body.email},
                    ${req.body.numPeople},
                    ${req.body.numChildren},
                    ${req.body.isSmoker},
                    ${req.body.isBirthday}
                )
            returning *
        `

        reservationId = reservation[0]["reservation_id"]

        // Get the combination of tables necessary for the reservation
        const selectedTables = tablesAlgorithm(parseInt(req.body.numPeople), availableTables)
        const reservationTables = selectedTables.map(e => ({
            reservation_id: reservationId,
            table_id: e["table_id"],
            reservation_date: reservationDate,
        }))

        await sql` INSERT INTO reservation_tables ${sql(reservationTables)}`

        res.json(reservation[0])

    } catch (err) {
        return next({
            status: 500,
            error: `Server error`,
            trace: err
        })
    }
}

/**
 * /reservation/{id} PATCH Endpoint. Modify an existing reservation.
 */
async function update(req, res, next) {
    try {
        const rows = await sql`SELECT * FROM reservations WHERE reservation_id = ${req.params.ID}`

        if (rows.length === 0) {
            return next({
                status: 404,
                error: `Reservation not found`,
            })
        }

        let reservation = rows[0]

        const updateTables =
            "reservationDate" in req.body ||
            "regionId" in req.body ||
            "numPeople" in req.body ||
            "numChildren" in req.body ||
            "isSmoker" in req.body

        if ("reservationDate" in req.body) 
            reservation["reservation_date"] = new Date(parseInt(req.body.reservationDate) * 1000).toISOString()
        if ("regionId" in req.body) reservation["region_id"] = req.body.regionId
        if ("firstName" in req.body) reservation["first_name"] = req.body.firstName
        if ("lastName" in req.body) reservation["last_name"] = req.body.lastName
        if ("phoneNumber" in req.body) reservation["phone_number"] = req.body.phoneNumber
        if ("email" in req.body) reservation["email"] = req.body.email
        if ("numPeople" in req.body) reservation["num_people"] = req.body.numPeople
        if ("numChildren" in req.body) reservation["num_children"] = req.body.numChildren
        if ("isSmoker" in req.body) reservation["is_smoker"] = req.body.isSmoker
        if ("isBirthday" in req.body) reservation["is_birthday"] = req.body.isBirthday

        const isChildren = reservation["num_children"] > 0
        const isSmoker = reservation["is_smoker"] == "true" || reservation["is_smoker"] == 1

        if (updateTables) {
            // Check that the specified region exists and allows the mentioned clients
            let error = await checkRegion(req.body.regionId, isChildren, isSmoker)

            if (error)
                return next({
                    status: 400,
                    error: error,
                })

            // Delete the previous reserverd tables
            await sql`
                DELETE FROM reservation_tables 
                    WHERE reservation_id = ${req.params.ID}
            `

            // Select available tables at the specified time
            const availableTables = await getAvailableTables(req.body.regionId, reservation["reservation_date"])


            // Check that the available tables have enough capacity
            const capacity = availableTables.reduce((p, c) => p + c.capacity, 0)
            if (capacity < req.body.numPeople)
                return next({
                    status: 400,
                    error: `The specified region does not have enough space for this hour (space avaialble: '${capacity}').`,
                })

            // Get the combination of tables necessary for the reservation
            const selectedTables = tablesAlgorithm(parseInt(req.body.numPeople), availableTables)
            const reservationTables = selectedTables.map(e => ({
                reservation_id: req.params.ID,
                table_id: e["table_id"],
                reservation_date: reservation["reservation_date"],
            }))

            await sql` INSERT INTO reservation_tables ${sql(reservationTables)}`
        }

        await sql`
            UPDATE reservations SET
            reservation_date = ${reservation["reservation_date"]},
            region_id = ${reservation["region_id"]},
                first_name = ${reservation["first_name"]},
                last_name = ${reservation["last_name"]},
                phone_number = ${reservation["phone_number"]},
                email = ${reservation["email"]},
                num_people = ${reservation["num_people"]},
                num_children = ${reservation["num_children"]},
                is_smoker = ${reservation["is_smoker"]},
                is_birthday = ${reservation["is_birthday"]}
            WHERE reservation_id = ${req.params.ID}
        `

        res.status(201).json(reservation)

    } catch (err) {
        return next({
            status: 500,
            error: `Server error`,
            trace: err
        })
    }
}

/**
 * /reservation/{id} DELETE Endpoint. Delete an existing reservation.
 */
async function remove(req, res, next) {
    try {
        const rows = await sql`SELECT * FROM reservations WHERE reservation_id = ${req.params.ID}`
        if (rows.length === 0) {
            return next({
                status: 404,
                error: `Reservations not found`,
            })
        }

        await sql`DELETE FROM reservations WHERE reservation_id = ${req.params.ID}`
        res.status(204).json("Reservation deleted successfully.")

    } catch (err) {
        return next({
            status: 500,
            error: `Server error`,
            trace: err
        })
    }
}

/**************** AUX FUNCTIONS ****************/

/**
 * Function that returns the available tables of a region at a specific hour
 * @param {*} regionId 
 * @param {*} reservationDate 
 * @returns 
 */
 async function getAvailableTables(regionId, reservationDate) {
    return await sql`            
        SELECT * FROM tables as t
        WHERE t.region_id = ${regionId}
            AND t.table_id NOT IN (
                SELECT rt.table_id FROM reservation_tables as rt
                    WHERE rt.reservation_date = ${reservationDate}
            )
    `
}

/**
 * Check if region allows the clients.
 * @param {*} regionId 
 * @param {*} isChildren 
 * @param {*} isSmoker 
 * @returns Error description
 */
async function checkRegion(regionId, isChildren, isSmoker) {
    const rows = await sql`
        SELECT * FROM regions
        WHERE region_id = ${regionId}
    `
    if (rows.length === 0)
        return "The specified region does not exist."

    const region = rows[0]

    console.log(region, isChildren, isSmoker)
    if (isChildren && !region["for_children"])
        return "The specified region does not allow children."

    if (isSmoker && !region["for_smokers"])
        return "The specified region does not allow smokers."

    return false
}

module.exports = {
    get,
    getByID,
    create,
    update,
    remove,
}