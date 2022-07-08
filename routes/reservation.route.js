const router = require("express").Router();
const controller = require("../controllers/reservation.controller")

router.get("/", controller.get)
router.get("/:ID", controller.getByID)

router.post("/", controller.create)

router.patch("/:ID", controller.update)

router.delete("/:ID", controller.remove)

module.exports = router;