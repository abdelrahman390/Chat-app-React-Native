import {
	Image,
	StyleSheet,
	Text,
	View,
	TextInput,
	Alert,
	TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router"; // Import useRouter hook for navigation
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useChatContext } from "../UserContext";

export default function LoginPage() {
	// console.log("login page *************")
	const router = useRouter(); // Initialize router

	const {
		user,
		setUser,
		chatData,
		setChatData,
		justLoggedIn,
		setJustLoggedIn,
	} = useChatContext();

	const [login, setLogin] = useState("register");
	const [message, setMessage] = useState("");
	// login
	const [loginUsername, setLoginUsername] = useState(""); // State to hold the username
	const [loginPassword, setLoginPassword] = useState(""); // State to hold the password
	const [loginPassShow, setLoginPassShow] = useState(true); // State to hold the password
	const [loginAlarm, setLoginAlarm] = useState(false); // State to hold the password
	const [loginLoading, setLoginLoading] = useState(false);
	const [loginServerAlarm, setLoginServerAlarm] = useState(false); // State to hold the password
	// register
	const [registerUsername, setRegisterUsername] = useState(""); // State to hold the username
	const [registerPassword, setRegisterPassword] = useState(""); // State to hold the password
	const [registerPassShow, setRegisterPassShow] = useState(true); // State to hold the password
	const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState(""); // State to hold the password
	const [registerPassConfirmShow, setRegisterPassConfirmShow] = useState(true); // State to hold the password
	const [registerAlarm, setRegisterAlarm] = useState(false); // State to hold the password
	const [registerPassAlarm, setRegisterPassAlarm] = useState(false); // State to hold the password
	const [registerLoading, setRegisterLoading] = useState(false);

	let ipv4 = "192.168.1.102";

	// const saveData = async (data: any) => {
	// 	try {
	// 		let userData = data;
	// 		userData["loggedIn"] = true;
	// 		// console.log("save data", userData)
	// 		await AsyncStorage.setItem("user", JSON.stringify(data));
	// 		await AsyncStorage.setItem("justLoggedIn", "true");
	// 		// alert(`Data saved! ${JSON.stringify(data)}`);
	// 	} catch (error) {
	// 		console.error("Error saving data", error);
	// 	}
	// };
	// const loadData = async () => {
	// 	try {
	// 		const value = await AsyncStorage.getItem("user");
	// 		// console.log("login page, get user data", value)
	// 	} catch (error) {
	// 		console.error("Error loading data", error);
	// 	}
	// };
	// loadData();

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		let value: any = await SecureStore.getItemAsync("user");
	// 		Alert.alert("test", `${value} %%%% ${JSON.stringify(user)}`);
	// 	};
	// 	fetchData();
	// }, [user]);

	const handleLogin = async () => {
		if (loginUsername.length !== 0 && loginPassword.length !== 0) {
			setLoginLoading(true);
			try {
				// Making the API request
				const response = await fetch(`http://${ipv4}:8000/api/chat/login/`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						user_name: loginUsername.trim(),
						password: loginPassword.trim(),
					}),
				});

				// Check if the response was successful
				const data = await response.json();
				// console.log(data, response);

				console.log("response", data);
				if (response.ok) {
					setLoginServerAlarm(false);
					setLoginLoading(false);
					// setMessage(`'Login Successful' ${JSON.stringify(data)}`);
					if (data.Found == "false") {
						setLoginAlarm(true);
					} else {
						let userData: any = {
							userId: data.userId,
							userName: loginUsername,
							token: data.token,
							loggedIn: true,
						};
						await SecureStore.setItemAsync("user", JSON.stringify(userData));
						setUser(userData);
						// let result: any = await SecureStore.getItemAsync("user");
						// Alert.alert("test", result);
						// await saveData({ userId: data.user_id, userName: loginUsername });
						setLoginAlarm(false);
						setLoginUsername("");
						setLoginPassword("");
						router.push("/friends list");
					}
				} else {
					setLoginAlarm(false);
					setLoginServerAlarm(false);
					console.error("Error response:", data);
					// setMessage(data || 'Login Failed');
				}
			} catch (error) {
				setLoginAlarm(false);
				setLoginServerAlarm(true);
				console.error("Error during login:", error);
				setLoginLoading(false);
				// setMessage(`'Failed to connect to the server' ${error}`);
			}
		}
	};

	const handleRegister = async () => {
		if (registerPassword !== registerPasswordConfirm) {
			setRegisterPassAlarm(true);
		}
		if (
			registerUsername.length !== 0 &&
			registerPassword.length !== 0 &&
			registerPassword === registerPasswordConfirm
		) {
			setRegisterPassAlarm(false);
			setRegisterLoading(true);
			try {
				// Making the API request
				const response = await fetch(`http://${ipv4}:8000/api/chat/Signup/`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						user_name: registerUsername.trim(),
						password: registerPassword.trim(),
					}),
				});

				// Check if the response was successful
				const data = await response.json();

				if (response.ok) {
					setRegisterLoading(false);
					setMessage(`'Login Successful' ${JSON.stringify(data)}`);
					if (data["response"] !== "done") {
						setRegisterAlarm(true);
					} else {
						let userData: any = {
							userId: data.userId,
							userName: registerUsername.trim(),
							token: data.token,
							loggedIn: true,
						};
						// Alert.alert("userData", `${JSON.stringify(userData)}`);
						await SecureStore.setItemAsync("user", JSON.stringify(userData));
						setRegisterAlarm(false);
						// await saveData({ userId: data.key, userName: registerUsername });
						setRegisterUsername("");
						setRegisterPassword("");
						setRegisterPasswordConfirm("");
						router.push("/friends list");
					}
				} else {
					setMessage(data || "Login Failed");
				}
			} catch (error) {
				// console.error('Error during login:', error);
				setRegisterLoading(false);
				setMessage(`'Failed to connect to the server' ${error}`);
			}
		}
	};

	return (
		<View style={styles.page}>
			<Text style={styles.header}>Chat App</Text>
			<View style={styles.container}>
				{login == "register" ? (
					<View style={styles.box}>
						{/* for test */}
						{/* {message ? <Text style={styles.message}>{message}</Text> : null} */}
						<Text style={styles.mainText}>Login</Text>
						<TextInput
							style={styles.inputs}
							placeholder="User name"
							value={loginUsername}
							onChangeText={setLoginUsername}
						/>
						<View style={styles.inputsParent}>
							<TextInput
								style={styles.inputs}
								placeholder="Password"
								secureTextEntry={loginPassShow}
								value={loginPassword}
								onChangeText={setLoginPassword} // Update password state
							/>
							<TouchableOpacity
								style={styles.iconContainer}
								onPress={() => setLoginPassShow((prevValue) => !prevValue)}
							>
								<Image
									source={require("../../assets/imgs/hide.png")}
									style={styles.hideIcon}
								/>
							</TouchableOpacity>
						</View>
						<Text
							style={[
								styles.message,
								{ display: loginAlarm ? "flex" : "none" },
							]}
						>
							{loginAlarm ? "User name or Password are incorrect" : null}
						</Text>
						<Text
							style={[
								styles.message,
								{ display: loginServerAlarm ? "flex" : "none" },
							]}
						>
							Server Error
						</Text>
						<TouchableOpacity style={styles.button} onPress={handleLogin}>
							<Text style={styles.buttonText}>
								{loginLoading ? "Loading..." : "Login"}
							</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.box}>
						{/* for test */}
						{/* {message ? <Text style={styles.message}>{message}</Text> : null} */}
						<Text style={styles.mainText}>Register</Text>
						<TextInput
							style={styles.inputs}
							placeholder="User name or phone number"
							value={registerUsername}
							onChangeText={setRegisterUsername}
						/>
						<Text
							style={[
								styles.message,
								{ display: registerAlarm ? "flex" : "none" },
							]}
						>
							User Name Already Taken
						</Text>
						<View style={styles.inputsParent}>
							<TextInput
								style={styles.inputs}
								placeholder="Password"
								secureTextEntry={registerPassShow}
								value={registerPassword}
								onChangeText={setRegisterPassword}
							/>
							<TouchableOpacity
								style={styles.iconContainer}
								onPress={() => setRegisterPassShow((prevValue) => !prevValue)}
							>
								<Image
									source={require("../../assets/imgs/hide.png")}
									style={styles.hideIcon}
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.inputsParent}>
							<TextInput
								style={styles.inputs}
								placeholder="confirm Password"
								secureTextEntry={registerPassConfirmShow}
								value={registerPasswordConfirm}
								onChangeText={setRegisterPasswordConfirm}
							/>
							<TouchableOpacity
								style={styles.iconContainer}
								onPress={() =>
									setRegisterPassConfirmShow((prevValue) => !prevValue)
								}
							>
								<Image
									source={require("../../assets/imgs/hide.png")}
									style={styles.hideIcon}
								/>
							</TouchableOpacity>
						</View>
						<Text
							style={[
								styles.passMessage,
								{ display: registerPassAlarm ? "flex" : "none" },
							]}
						>
							The two passwords are not match
						</Text>
						<TouchableOpacity style={styles.button} onPress={handleRegister}>
							<Text style={styles.buttonText}>
								{registerLoading ? "Loading..." : "Sign Up"}
							</Text>
						</TouchableOpacity>
					</View>
				)}
				<TouchableOpacity
					style={styles.buttonChangeLogin}
					onPress={() =>
						setLogin((prevState) =>
							prevState === "register" ? "login" : "register"
						)
					}
				>
					<Text style={styles.buttonText}>{login}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		padding: 20,
		paddingTop: 45,
		backgroundColor: "#192a56",
		height: "auto",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "white",
		fontSize: 20,
		textAlign: "center",
	},
	page: {
		backgroundColor: "#193479",
	},
	container: {
		display: "flex",
		flexDirection: "column",
		height: "100%",
		gap: 25,
		padding: 30,
		justifyContent: "flex-start",
		marginTop: 120,
	},
	box: {
		display: "flex",
		gap: 25,
		flexDirection: "column",
	},
	mainText: {
		fontSize: 15,
		color: "white",
	},
	button: {
		padding: 10,
		borderRadius: 5,
		alignSelf: "flex-start",
		backgroundColor: "#17d308",
		width: "100%",
	},
	buttonChangeLogin: {
		paddingVertical: 10,
		borderRadius: 5,
		alignSelf: "flex-start",
		backgroundColor: "rgba(240, 248, 255, 0.8196078431)",
		width: "40%",
	},
	buttonText: {
		color: "white",
		fontSize: 20,
		textAlign: "center",
	},
	inputsParent: {
		position: "relative", // To contain the absolute positioning of the icon
		borderWidth: 1,
		borderColor: "transparent",
		borderRadius: 8,
		justifyContent: "center", // Ensures TextInput content is vertically centered
	},
	inputs: {
		paddingRight: 40, // Adds space to the right for the icon
		paddingHorizontal: 10,
		fontSize: 15,
		borderRadius: 8,
		padding: 15,
		paddingLeft: 5,
		backgroundColor: "#1296d1",
		color: "white",
	},
	iconContainer: {
		position: "absolute",
		right: 10, // Position near the right edge
		top: "50%", // Center vertically relative to the input
		transform: [{ translateY: -12 }], // Adjust based on icon size to center it
	},
	hideIcon: {
		width: 24,
		height: 24,
	},
	message: {
		textAlign: "center",
		fontSize: 15,
		padding: 10,
		marginTop: -20,
		borderRadius: 5,
		color: "white",
		backgroundColor: "rgb(255 102 102)",
	},
	passMessage: {
		textAlign: "center",
		fontSize: 13,
		padding: 5,
		marginTop: -22,
		borderRadius: 5,
		color: "white",
		backgroundColor: "rgb(255 102 102)",
	},
});
