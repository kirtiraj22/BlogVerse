import express from "express";
import mongoose from "mongoose";
import { z } from "zod";
import "dotenv/config";
import bcrypt from "bcrypt";

const app = express();
let PORT = 3000;

app.use(express.json());

mongoose.connect(process.env.DB_LOCATION, {
	autoIndex: true,
});

const signUpSchema = z.object({
	fullname: z
		.string()
		.min(3, { message: "Username must be at least 3 characters" }),
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email("Invalid email address"),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" }),
});

app.post("/signup", (req, res) => {
	const { fullname, email, password } = req.body;

	try {
		signUpSchema.parse({ fullname, email, password });

		bcrypt.hash(password, 10, (err, hashed_password) => {
			console.log(hashed_password);
		});

		return res.status(200).json({
			"status": "OK",
		});
	} catch (error) {
		return res.status(403).json({
			"error": error,
		});
	}
});

app.listen(PORT, () => {
	console.log(`App running on PORT : ${PORT}`);
});
