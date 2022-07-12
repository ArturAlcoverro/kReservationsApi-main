/**
 * Regions routes
 * @module routes/region
 */

const router = require("express").Router();
const controller = require("../controllers/region.controller")
const validator = require("../validation/region.validation");

router.get("/", controller.get)
router.get("/:ID", validator.id, controller.getByID)

router.patch("/:ID", validator.id, validator.update, controller.update)

module.exports = router;