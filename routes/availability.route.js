/**
 * Availability routes
 * @module routes/availability
 */

const router = require("express").Router()
const controller = require("../controllers/availability.controller")
const validator = require("../validation/availability.validation")

router.get("/", validator.get, controller.get)

module.exports = router;