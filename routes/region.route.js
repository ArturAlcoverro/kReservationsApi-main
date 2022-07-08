const router = require("express").Router();
const controller = require("../controllers/region.controller")

router.get("/", controller.get)
router.get("/:ID", controller.getByID)

router.patch("/:ID", controller.update)

module.exports = router;