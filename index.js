require("dotenv").config();

const express = require('express')
const app = express()
const host = process.env.HOST_NAME
const port = process.env.PORT

const reservationRoute = require("./routes/reservation.route");
const regionRoute = require("./routes/region.route");
const availabilityRoute = require("./routes/availability.route");

app.use("/reservation", reservationRoute);
app.use("/region", regionRoute);
app.use("/availability", availabilityRoute);

app.all("/*", (req, res, next) => {
	console.log(req.url);
	next({
		error: "Not found",
	});
});

app.use((err, req, res, next) => {
	console.log("ERROR:", err);
	if (err.status) res.status(err.status)
	res.json(err);
});

app.listen(port, () => {
	console.log(`http://${host}:${port}`);
})