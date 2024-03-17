import { useState } from "react";

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
	const [passwordVisible, setPasswordVisible] = useState(false);

	return (
		<div className="relative w-[100%] mb-4">
			<input
				type={
					// if the given type is password, check if the password is visible or not
					type === "password"
						? passwordVisible
							? "text" // if password is visible then turn the type to text
							: "password"
						: type
				}
				name={name}
				id={id}
				placeholder={placeholder}
				value={value}
				className="input-box"
			/>
			<i className={`fi ${icon} input-icon`}></i>

			{type === "password" ? (
				<i
					className={`fi ${
						passwordVisible ? "fi-rr-eye" : "fi-rr-eye-crossed"
					} input-icon left-[auto] right-4 cursor-pointer`}
					onClick={() => setPasswordVisible((currVal) => !currVal)}
				/>
			) : (
				""
			)}
		</div>
	);
};

export default InputBox;
