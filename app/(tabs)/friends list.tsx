import {
	Image,
	StyleSheet,
	Text,
	View,
	Alert,
	TouchableOpacity,
	FlatList,
	Dimensions,
	Platform,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { useChatContext } from "../UserContext";
import * as SecureStore from "expo-secure-store";

export default function FriendsList() {
	const router = useRouter(); // Initialize router
	const {
		user,
		setUser,
		chatData,
		setChatData,
		justLoggedIn,
		setJustLoggedIn,
		allChats,
		setAllChats,
	} = useChatContext();

	const logoutButtonRef = useRef(null);
	const socketRef = useRef<any>(null);
	const [serverErrorMessage, setServerErrorMessage] = useState<boolean>(true);
	// const [user, setUser] = useState<{ userId: number; userName: string }>();
	const [SocketIsConnected, setSocketIsConnected] = useState(false);
	const [chatsNewMessage, setChatsNewMessage] = useState<any>({});
	const [loggedOut, setLoggedOut] = useState(false);
	const [test, setTest] = useState("");
	// const [expoPushToken, setExpoPushToken] = useState('');

	const [allUsers, setAllUsers] = useState([]);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [remainingHeight, setRemainingHeight] = useState(
		Dimensions.get("window").height
	);

	const calculateRemainingHeight = () => {
		const screenHeight = Dimensions.get("window").height;
		setRemainingHeight(screenHeight - headerHeight - 10);
		// console.log(screenHeight - headerHeight)
	};
	useEffect(() => {
		if (headerHeight > 0) {
			calculateRemainingHeight();
		}
	}, [headerHeight]);

	async function logout() {
		let userData: { loggedIn: boolean } = { loggedIn: false };
		await SecureStore.setItemAsync("user", JSON.stringify(userData));
		setUser(userData);
		// await AsyncStorage.setItem("user", JSON.stringify(userData));
		// setLoggedOut(true);
		// setJustLoggedIn(true);
		setAllUsers([]);
		router.push("/login");
	}

	const getUsername = async () => {
		try {
			// console.log("getUsername works ######################")
			let value: any = await SecureStore.getItemAsync("user");
			// const justLoggedIn: any = await AsyncStorage.getItem('justLoggedIn');
			// Alert.alert("test hallo", `${value}`);
			if (value) {
				const user: {
					userId: number;
					userName: string;
					loggedIn: boolean;
					token: string;
				} = JSON.parse(value);
				// console.log("user changed");
				setUser({
					userId: user.userId,
					userName: user.userName,
					token: user.token,
					loggedIn: true,
				});
				// console.log("user loggedIn in friends list", user.loggedIn)
				if (user.loggedIn) {
					// console.log(
					// 	"justLoggedIn from getUsername() new one:",
					// 	Boolean(justLoggedIn)
					// );
					// if (Boolean(justLoggedIn)) {
					// setJustLoggedIn(false);
					getFriendsList(Number(user.userId), user.token);
					try {
						await AsyncStorage.setItem("justLoggedIn", "false");
						// console.log("justLoggedIn changed getUsername():", justLoggedIn)
					} catch (error) {
						console.error("Error saving data", error);
					}
					// } else {
					//   // get messages from sqlLite
					// }
				} else {
					router.push("/login");
				}
			}
		} catch (error) {
			console.error("Error loading data", error);
		}
	};
	useEffect(() => {
		getUsername();
	}, []);

	function openChat(id: Number, title: string) {
		// sender id + receiver id #
		let chatId: number =
			+String(user!.userId).slice(-2) + +String(id).slice(-2);
		// console.log(chatId)
		setChatData({ chatId: chatId, Sender: user?.userName!, receiver: title });
		router.push("/chat");
	}

	let ipv4 = "192.168.1.102";
	const getFriendsList = async (userId: number, token: string) => {
		try {
			// console.log("*********** get Friends List fetched ***********")
			const response = await fetch(
				`http://${ipv4}:8000/api/chat/getFriendsList/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: userId,
						token: token,
					}),
				}
			);

			// Check if the response was successful
			const data = await response.json();
			if (response.ok) {
				setServerErrorMessage(true);
				setAllUsers(data.users);
			} else {
				console.error("Error response:", data);
			}
		} catch (error) {
			setServerErrorMessage(false);
			console.error("Error during get friends list:", error);
			// setLoginLoading(false)
			// setMessage(`'Failed to connect to the server' ${error}`);
		}
	};

	// Initialize the socket connection
	useEffect(() => {
		if (user) {
			const io = require("socket.io-client").io;
			socketRef.current = io(`http://${ipv4}:3002`, {
				reconnectionAttempts: 10, // Retry 10 times if the connection fails
				timeout: 30000, // Wait 30 seconds for a connection
				transports: ["websocket", "polling"],
				auth: {
					token: user.token,
					userId: user.userId,
				},
			});
			console.log("Connecting to Socket.IO...");

			const socket = socketRef.current;
			// Listen for connection
			socket.on("connect", () => {
				console.log("Connected to server with ID:", socket.id);
				setSocketIsConnected(true);

				subscribeToChat(119);
				socket.on("newMessage", (data: any) => {
					console.log("New message:", data);
					// setMessages((prev) => [...prev, data]); // Or other state updates
					setAllChats((prevChats) => {
						// Copy previous state to avoid direct mutation
						const updatedChats = { ...prevChats };

						if (updatedChats[data.chatId]) {
							updatedChats[data.chatId].push(data.message);
						} else {
							updatedChats[data.chatId] = [data.message];
						}

						return updatedChats;
					});
					// Alert.alert("new message", `${data.chatId} ${data.message.msg}`);
					// setChatsNewMessage((prevChats: any) => {
					// 	// Create a copy of the previous state and increment the value of the specified chatId
					// 	const updatedChats: any = { ...prevChats };
					// 	updatedChats[data.chatId] = (updatedChats[data.chatId] || 0) + 1; // Increment, default to 0 if not defined
					// 	return updatedChats; // Return the updated state
					// });
				});
			});

			socket.on("connect_error", (error: any) => {
				console.log("server can`t connect", error);
				Alert.alert("alarm", error);
			});

			// Handle disconnection
			socket.on("disconnect", () => {
				console.log("Disconnected from server");
			});

			const subscribeToChat = (chatId: any) => {
				console.log(`Subscribing to chat: ${chatId}`);
				socket.emit("subscribeToChat", chatId.toString());
			};

			// Cleanup on unmount
			return () => {
				unsubscribeFromChat(119);
				socket.disconnect();
			};
		}
	}, [user]);

	useEffect(() => {
		if (user?.userId) {
			// console.log("Emitting getChats for user up:", user.userId);
			socketRef.current.emit("getChats", user?.userId, (response: any) => {
				if (response.success) {
					setAllChats(response.allChats);
					// setChatsNewMessage(() =>
					// 	Object.keys(response.allChats).reduce((acc: any, chatId) => {
					// 		acc[chatId] = 0;
					// 		return acc;
					// 	}, {})
					// );
					console.log("Chats received from server:", response);
				} else {
					console.error("Failed to get chats:", response.message);
				}
			});
		}
	}, [SocketIsConnected]);

	const unsubscribeFromChat = (chatId: any) => {
		// console.log(`Unsubscribing from chat: ${chatId}`);
		socketRef.current.emit("unsubscribeFromChat", chatId);
	};

	// useEffect(() => {
	// 	console.log("chatsNewMessage", chatsNewMessage);
	// }, [chatsNewMessage]);

	const Item = ({ title, id }: { title: string; id: number }) => (
		<TouchableOpacity onPress={() => openChat(id, title)} style={styles.friend}>
			<Image
				style={styles.userPhoto}
				source={require("../../assets/imgs/user.png")}
			/>
			<Text style={styles.friendText}>{title}</Text>
			{/* <Text style={{ fontSize: 15, color: "rgb(224 108 108);" }}>
				New messages:{" "}
				{
					chatsNewMessage[
						+String(user!.userId).slice(-2) + +String(id).slice(-2)
					]
				}
			</Text> */}
		</TouchableOpacity>
	);
	type Friend = {
		id: string;
		user_name: string;
	};

	return (
		<View style={{ flex: 1 }}>
			{/* Header */}
			<View
				style={styles.headerCont}
				onLayout={(event) => {
					const height = event.nativeEvent.layout.height;
					// console.log("Header height:", height);
					setHeaderHeight(height);
				}}
			>
				<Text style={styles.header}>Chat App</Text>
				<View style={styles.userNameCont}>
					{/* <Text style={styles.userName}>{user?.userName ? user?.userName : "null"}</Text> */}
					<Text style={styles.userName}>{user?.userName || "Error"}</Text>

					<TouchableOpacity
						ref={logoutButtonRef}
						onPress={() => logout()}
						style={styles.button}
					>
						<Text style={[{ color: "white", fontSize: 15 }]}>Logout</Text>
					</TouchableOpacity>
				</View>
			</View>
			{/* Header */}
			<View style={[styles.List, { height: remainingHeight }]}>
				{serverErrorMessage ? (
					<FlatList<Friend>
						data={allUsers}
						renderItem={({ item }) => (
							<Item title={item.user_name} id={Number(item.id)} />
						)}
						keyExtractor={(item) => item.id.toString()} // Ensure the keyExtractor returns a string
					/>
				) : (
					// <Text style={{ color: "white" }}>Done</Text>
					<Text style={styles.serverError}>Server Error</Text>
				)}

				{/* <TouchableOpacity onPress={() => openChat(1725483411380)} style={styles.friend}>
          <Text style={styles.friendText} >Abdelrahman</Text>
        </TouchableOpacity> */}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	headerCont: {
		padding: 20,
		paddingTop: 55,
		backgroundColor: "#192a56",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		textAlign: "center",
		borderBottomColor: "rgb(39, 108, 168)",
		borderBottomWidth: 1,
	},
	header: {
		fontSize: 20,
		color: "white",
	},
	userNameCont: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	userName: {
		color: "white",
		paddingVertical: 5,
		paddingHorizontal: 10,
		// borderWidth: '1px solid rgba(39,108,168,1.00)',
		borderWidth: 1,
		borderRightWidth: 0,
		borderColor: "rgba(39,108,168,1.00)",
		borderRadius: 10,
	},
	List: {
		height: 689,
		backgroundColor: "#193479",
	},
	button: {
		padding: 10,
		backgroundColor: "#193479",
		color: "white",
		borderRadius: 10,
	},
	friend: {
		backgroundColor: "#1f3369",
		borderBottomColor: "#7c869f",
		borderBottomWidth: 1,
		display: "flex",
		gap: 5,
		padding: 15,
		flexDirection: "row",
		alignItems: "center",
	},
	userPhoto: {
		height: 45,
		width: 45,
		marginRight: 10,
	},
	friendText: {
		color: "white",
		fontSize: 22,
	},
	serverError: {
		color: "white",
		backgroundColor: "rgba(255,102,102,1.00)",
		width: "50%",
		fontSize: 25,
		textAlign: "center",
		marginTop: 100,
		marginHorizontal: "auto",
		borderRadius: 5,
		padding: 20,
	},
});

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// useEffect(() => {

// if (test) {
//   if (Platform.OS === 'android') {
//     console.log("app")
//     Notifications.scheduleNotificationAsync({
//       content: {
//         title: `New message from ${test.Data.sender}`,
//         body: test.Data.msg,
//       },
//       trigger: null,
//     });
//   } else {
//     console.log("web")
//     Alert.alert("'New Message', `From: ${test.Data.sender}, Message: ${test.Data.msg}`");
//   }
// }

// }, [test]);
