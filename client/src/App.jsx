import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAuthForm from "./pages/UserAuthForm";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/Session";
import Editor from "./pages/Editor";

export const UserContext = createContext({});

function App() {
	const [userAuth, setUserAuth] = useState({});

	useEffect(() => {
		let userInSession = lookInSession("user");
		userInSession
			? setUserAuth(JSON.parse(userInSession))
			: setUserAuth({
					access_token: null,
			  });
	}, []);

	return (
		<UserContext.Provider value={{ userAuth, setUserAuth }}>
			<Routes>
				<Route path="/editor" element={<Editor />}/>
				<Route path="/" element={<Navbar />}>
					<Route
						path="signin"
						element={<UserAuthForm type="sign-in" />}
					/>
					<Route
						path="signup"
						element={<UserAuthForm type="sign-up" />}
					/>
				</Route>
			</Routes>
		</UserContext.Provider>
	);
}

export default App;
