/**
 * Availability controller
 * @module controllers/availability
 */

const sql = require("../database/connection");

/**
 * /availability GET Endpoint. Send a list of open reservation slots, optionally filtered.
 */
async function get(req, res, next) {
    let now = Date.now()
    now = now + 1800000 - (now % 1800000)
    let numSlots = 10
    let before = now
    let after

    if ("num_slots" in req.query) numSlots = parseInt(req.query.num_slots)
    if ("before" in req.query) before = (parseInt(req.query.before) * 1000) + 1800000 - ((parseInt(req.query.before) * 1000) % 1800000)
    if ("after" in req.query) after = (parseInt(req.query.after) * 1000) + 1800000 - ((parseInt(req.query.after) * 1000) % 1800000)

    before = before < now ? now : before

    if (after === undefined) {
        after = before + (1800000 * numSlots)
    }

    if (after <= before)
        return next({
            status: 400,
            error: `Invalid hour range`,
        })

    // Calculate hours between before and after timestamps
    const hours = calculcateHours(before, after)

    const num_hours = numSlots < hours.length ? numSlots : hours.length

    // Get the availabily for each slot
    const slots = []
    for (let i = 0; i < num_hours; i++) {
        const fomattedHour = new Date(hours[i]).toISOString()
        const rows = await sql`
            SELECT r.region_id, r.name, SUM(t.capacity) AS capacity_available FROM tables AS t
                JOIN regions as r ON r.region_id = t.region_id
                WHERE t.table_id NOT IN (
                    SELECT rt.table_id FROM reservation_tables as rt
                    WHERE rt.reservation_date = ${fomattedHour}
                )
                GROUP BY r.region_id 
        `
        slots.push({
            timestamp: hours[i] / 1000,
            date: fomattedHour,
            regions: rows
        })
    }

    res.json(slots)
}

/**
 * Function that calculates the half-hours between two timestamps
 * @param {*} before 
 * @param {*} after 
 * @returns the list of hours
 */
function calculcateHours(before, after) {
    const hours = []
    let currentHour = before

    while (currentHour < after) {
        hours.push(currentHour)
        currentHour += 1800000
    }

    return hours
}


module.exports = { get }