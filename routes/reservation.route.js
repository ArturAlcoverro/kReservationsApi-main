/**
 * Reservations routes
 * @module routes/reservation
 */

const router = require("express").Router();
const controller = require("../controllers/reservation.controller")
const validator = require("../validation/reservation.validation");


router.get("/", validator.get, controller.get)
router.get("/:ID", validator.id, controller.getByID)

router.post("/", validator.create, validator.validateHour, controller.create)

router.patch("/:ID", validator.id, validator.update, validator.validateHour, controller.update)

router.delete("/:ID", validator.id, controller.remove)


module.exports = router;