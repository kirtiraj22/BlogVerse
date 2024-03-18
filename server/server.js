import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
let PORT = 3000;

app.use(express.json());

mongoose.connect(process.env.DB_LOCATION, {
	autoIndex: true,
});

// testing
app.post("/signup", (req, res) => {
	res.json(req.body);
});

app.listen(PORT, () => {
	console.log(`App running on PORT : ${PORT}`);
});
