import {
	Image,
	StyleSheet,
	Text,
	View,
	Alert,
	TouchableOpacity,
	FlatList,
	Dimensions,
	ScrollView,
	TextInput,
	BackHandler,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
// import { useNavigation } from '@react-navigation/native';
import { useRouter, usePathname, useRootNavigationState } from "expo-router";
import { useChatContext } from "../UserContext";

const Chat = () => {
	// const router = useRouter(); // Initialize router
	const { user, setUser, chatData, setChatData, allChats, setAllChats, ipv4 } =
		useChatContext();
	const flatListRef = useRef<FlatList>(null);
	const [chatMessages, setChatMessages] = useState<any[]>([]);
	const [chatMessagesIsLoading, setChatMessagesIsLoading] = useState(true);
	const [messageContent, setMessageContent] = useState("");

	// let ipv4 = "192.168.1.102";
	async function sendMessage() {
		// console.log(user?.userId, user?.token);
		// Alert.alert("hallo", `${user?.userId} l ${user?.token}`);
		var BigDate = new Date();
		var date = BigDate.toLocaleString();
		var timestamp = new Date().getTime();
		try {
			const response = await fetch(
				`http://${ipv4}:8000/api/chat/save-message/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						message: {
							sender: chatData?.Sender,
							msg: messageContent,
							receiver: chatData?.receiver,
							date: date,
							messageId: timestamp,
							chatId: chatData?.chatId,
						},
						user: {
							userId: user?.userId,
							token: user?.token,
						},
					}),
				}
			);

			// Check if the response was successful
			const data = await response.json();
			setMessageContent("");
			if (response.ok) {
				// setChatMessages((prevMessages) => [...prevMessages, messageData]);
			} else {
				console.error("Error response:", data);
			}
		} catch (error) {
			console.error("Error during login:", error);
		}
	}

	useEffect(() => {
		// console.log("allChats", allChats);
		if (allChats && chatData) {
			// Iterate over the entries (key-value pairs) of the object
			for (const [chatId, messages] of Object.entries(allChats)) {
				if (chatId === String(chatData.chatId)) {
					// console.log("Found chat with ID chatData?.chatId:", chatId, messages);
					setChatMessages(messages); // Set the messages for the found chat
					setChatMessagesIsLoading(false);
					break; // Exit the loop as the chat is found
				}
			}
		} else {
			console.log("allChats is either null or not an array");
		}
		// flatListRef.current?.scrollToEnd({ animated: true });
		flatListRef.current?.scrollToEnd();
	}, [chatData, allChats]);

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.left}>
					<Image
						source={require("../../assets/images/user.png")}
						style={styles.userImage}
						alt="user-photo"
					/>
					<View style={styles.userInfo}>
						<Text style={styles.userName}>{chatData?.receiver}</Text>
					</View>
				</View>
			</View>

			{/* Chat Messages */}
			<View style={styles.chat}>
				{chatMessagesIsLoading ? (
					<Text style={{ color: "white" }}>Loading...</Text>
				) : (
					<FlatList
						ref={flatListRef}
						data={chatMessages}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<View
								style={[
									styles.message,
									item.sender === chatData?.Sender
										? styles.myMessage
										: styles.friendMessage,
								]}
							>
								<View style={styles.messageContent}>
									<Text
										style={
											item.sender === chatData?.Sender
												? styles.MyMessageText
												: styles.friendMessageText
										}
									>
										{item.msg}
									</Text>
									<Text
										style={
											item.sender === chatData?.Sender
												? styles.MyMessageData
												: styles.friendMessageData
										}
									>
										{/* {item.date} */}
										{`${item.date.split(",")[0]}, ${item.date
											.split(",")[1]
											.split(":")
											.splice(0, 2)} ${
											item.date.split(",")[1].split(":")[2].split(" ")[1]
										}`}
									</Text>
								</View>
							</View>
						)}
					/>
				)}
			</View>

			{/* Send Message Input */}
			<View style={styles.sendMessage}>
				<TextInput
					style={styles.input}
					placeholder="Send message"
					placeholderTextColor="#cfc2c2"
					value={messageContent}
					onChangeText={setMessageContent}
				/>
				<TouchableOpacity
					onPress={() => sendMessage()}
					disabled={messageContent.trim().length != 0 ? false : true}
				>
					<Image
						source={require("../../assets/images/send.png")}
						style={styles.sendIcon}
						alt="Submit"
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};
export default Chat;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#192a56",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		paddingTop: 55,
		backgroundColor: "#193479",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(43, 157, 255, 0.3490196078)",
	},
	left: {
		flexDirection: "row",
		alignItems: "center",
	},
	userImage: {
		width: 35,
		height: 35,
		borderRadius: 20,
	},
	userInfo: {
		marginLeft: 20,
	},
	userName: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
	},
	chat: {
		flex: 1,
		padding: 10,
	},
	message: {
		marginBottom: 10,
	},
	myMessage: {
		alignSelf: "flex-end",
		backgroundColor: "#005c4b",
		padding: 10,
		borderRadius: 8,
		maxWidth: "80%",
	},
	MyMessageText: {
		color: "white",
	},
	MyMessageData: {
		color: "rgb(187 174 174)",
	},
	friendMessageText: {
		color: "black",
	},
	friendMessageData: {
		color: "#5c4f4f",
	},
	friendMessage: {
		alignSelf: "flex-start",
		backgroundColor: "#d8d8d8",
		padding: 10,
		borderRadius: 8,
		maxWidth: "80%",
	},
	messageContent: {
		flexDirection: "column",
	},
	sendMessage: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		// backgroundColor: '#193479',
		borderTopWidth: 1,
		borderTopColor: "rgba(43, 157, 255, 0.3490196078)",
	},
	input: {
		flex: 1,
		height: 40,
		borderWidth: 1,
		backgroundColor: "#2148ab",
		borderColor: "#ccc",
		borderRadius: 20,
		paddingHorizontal: 10,
		marginRight: 10,
		color: "white",
		// placeholder="something",
		// placeholderTextColor="white"
	},
	sendIcon: {
		width: 35,
		height: 30,
	},
});

// const getFriendsList = async () => {
// 	try {
// 		const response = await fetch(
// 			`http://${ipv4}:8000/api/chat/OpenedChatMessages/`,
// 			{
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({
// 					chat_id: chatData?.chatId,
// 				}),
// 			}
// 		);

// 		// Check if the response was successful
// 		const data = await response.json();
// 		// console.log('chat page spi', data)
// 		if (response.ok) {
// 			// console.log('chat page spi test', Object.values(data.chat))
// 			setChatMessagesIsLoading(false);
// 			setChatMessages(Object.values(data.chat));
// 		} else {
// 			console.error("Error response:", data);
// 		}
// 	} catch (error) {
// 		console.error("Error during login:", error);
// 	}
// };
// useEffect(() => {
// 	getFriendsList();
// }, [chatData]);

// useEffect(() => {
// 	// console.log("flatListRef", flatListRef.current)
// 	if (flatListRef.current) {
// 		flatListRef.current.scrollToEnd({ animated: true });
// 		// console.log('chat page spi', chatMessages)
// 	}
// }, [chatMessages]);
