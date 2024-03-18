import mongoose from "mongoose";
import profile_imgs_collections_list from "../data/ProfileCollections";
import profile_imgs_name_list from "../data/ProfileName";

const userSchema = mongoose.Schema({
	personal_info: {
		fullname: {
			type: String,
			lowercase: true,
			required: true,
			minlength: [3, "Fullname must be 3 letters long"],
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
		},
		password: String,
		username: {
			type: String,
			minlength: [3, "Username must be 3 letters long"],
			unique: true,
		},
		bio: {
			type: String,
			maxlength: [200, "Bio should not be more than 200"],
			default: "",
		},
		profile_img: {
			type: String,
			default: () => {
				return `https://api.dicebear.com/6.x/${
					profile_imgs_collections_list[
						Math.floor(
							Math.random() * profile_imgs_collections_list.length
						)
					]
				}/svg?seed=${
					profile_imgs_name_list[
						Math.floor(
							Math.random() * profile_imgs_name_list.length
						)
					]
				}`;
			},
		},
	},
});

const User = mongoose.model("users", userSchema);

export default User;
