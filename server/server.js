import express from "express";
import mongoose from "mongoose";
import { z } from "zod";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { nanoid } from "nanoid";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

import serviceAccountKey from "./blogverse-687ca-firebase-adminsdk-wjusr-acc2dabb39.json" assert { type: "json" };
import User from "./schema/User.js";

const app = express();
let PORT = 3000;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccountKey),
});

app.use(express.json());
app.use(cors());

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

const formatDatatoSend = (user) => {
	const access_token = jwt.sign(
		{
			id: user._id,
		},
		process.env.SECRET_KEY
	);

	return {
		access_token,
		profile_img: user.personal_info.profile_img,
		username: user.personal_info.username,
		fullname: user.personal_info.fullname,
	};
};

const generateUsername = async (email) => {
	let username = email.split("@")[0];
	let usernameExists = await User.exists({
		"personal_info.username": username,
	}).then((result) => result);
	usernameExists ? (username += nanoid().substring(0, 5)) : "";

	return username;
};

app.post("/signup", async (req, res) => {
	const { fullname, email, password } = req.body;

	try {
		signUpSchema.parse({ fullname, email, password });

		const emailExists = await User.exists({
			"personal_info.email": email,
		}).then((result) => result);

		if (emailExists) {
			return res.status(411).json({
				error: "Email already exists!",
			});
		}

		const hashed_password = await bcrypt.hash(password, 10);

		const username = await generateUsername(email);
		const user = new User({
			personal_info: {
				fullname,
				email,
				password: hashed_password,
				username,
			},
		});

		const savedUser = await user.save();

		return res.status(200).json({
			user: formatDatatoSend(savedUser),
			message: "Account created successfully!",
		});
	} catch (error) {
		return res.status(403).json({
			"error": error,
		});
	}
});

app.post("/signin", async (req, res) => {
	const { email, password } = req.body;

	try {
		const userExists = await User.findOne({
			"personal_info.email": email,
		});
		if (!userExists) {
			return res.status(403).json({
				"error": "Email not found!",
			});
		}

		if (!userExists.google_auth) {
			bcrypt.compare(
				password,
				userExists.personal_info.password,
				(err, result) => {
					if (err) {
						console.log(err);
						return res.status(403).json({
							error: "Error occured while logging in",
						});
					}
					if (!result) {
						return res.status(403).json({
							"error": "Incorrect password!",
						});
					} else {
						return res.status(200).json({
							data: formatDatatoSend(userExists),
							message: "Signed in Successfully",
						});
					}
				}
			);
		}else{
			return res.status(403).json({
				"error" : "Account was created using google. Try logging with google."
			})
		}
	} catch (err) {
		return res.status(500).json({
			message: "Internal server error",
		});
	}
});

app.post("/google-auth", async (req, res) => {
	let { access_token } = req.body;
	try {
		const decodedUser = await getAuth().verifyIdToken(access_token);
		let { email, name, picture } = decodedUser;

		// improve resolution of the profile image
		picture = picture.replace("s96-c", "s384-c");

		let user = await User.findOne({ "personal_info.email": email }).select(
			"personal_info.fullname personal_info.username personal_info.profile_img google_auth"
		);

		if (user) {
			if (!user.google_auth) {
				return res.status(403).json({
					"error":
						"This email was signed up without google. Please log in with password to access the account",
				});
			}
		} else {
			let username = await generateUsername(email);
			user = new User({
				google_auth: true,
				personal_info: {
					fullname: name,
					email,
					username,
				},
			});
			await user.save();
		}
		return res.status(200).json(formatDatatoSend(user));
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			"error":
				"Failed to authenticate with google. Try with some other google account",
		});
	}
});

app.listen(PORT, () => {
	console.log(`App running on PORT : ${PORT}`);
});
