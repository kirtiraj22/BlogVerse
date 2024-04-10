import React, { useContext } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
const Editor = () => {
	let {
		userAuth: { access_token },
	} = useContext(UserContext);

	return access_token === null ? (
		<Navigate to="/signin" />
	) : (
		<h1>you can access the editor page</h1>
	);
};

export default Editor;
