const router = require("express").Router()
const controller = require("../controllers/availability.controller")

router.get("/", controller.get)

module.exports = router;