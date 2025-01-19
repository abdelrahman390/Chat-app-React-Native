import { Tabs, useRouter, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, BackHandler, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatProvider } from "../UserContext";
import * as SecureStore from "expo-secure-store";

export default function TabLayout() {
	// console.log("layout is rendering now ++++++++++")

	const router = useRouter(); // Initialize router
	const [backPressCount, setBackPressCount] = useState(0);
	const pathname = usePathname();
	const navigation = useNavigation();
	// const [loggedIn, setLoggedIn] = useState<boolean>(false);
	// const { justLoggedIn, setJustLoggedIn } = useChatContext();

	useEffect(() => {
		// console.log('Current screen:', pathname); // Log the current screen
		const backAction = () => {
			if (pathname == "/chat") {
				// Replace 'Chat' with your target screen's name
				router.push("/friends list");
				return true; // Prevent default back navigation
			} else if (pathname == "/friends%20list") {
				if (backPressCount == 0) {
					setBackPressCount(1);
				} else {
					setBackPressCount(0);
					BackHandler.exitApp();
				}
				return true; // Prevent default back navigation
			}
			return false; // Allow default back navigation for other screens
		};
		// Add the back event listener
		BackHandler.addEventListener("hardwareBackPress", backAction);

		// Cleanup the event listener on unmount
		return () => {
			BackHandler.removeEventListener("hardwareBackPress", backAction);
		};
	}, [pathname, navigation, backPressCount]); // Add dependencies to re-run when route or navigation changes

	const getUsername = async () => {
		// console.log("getUsername in layout run")
		try {
			// const value: any = await AsyncStorage.getItem("user");
			// let result: any = user;
			let result: any = await SecureStore.getItemAsync("user");
			// Alert.alert("test", result);

			if (result) {
				const user: {
					userId: number;
					userName: string;
					loggedIn: boolean;
					token: String;
				} = JSON.parse(result);
				// setLoggedIn(user.loggedIn);
				// console.log("from layout loggedIn", user.loggedIn)
				direct(user.loggedIn);
			}
		} catch (error) {
			console.error("Error loading data", error);
		}
	};
	useEffect(() => {
		getUsername();
	}, []);

	// Redirect user based on the loggedIn state

	function direct(isLoggedIn: boolean) {
		// console.log("user state from lay", isLoggedIn);
		if (isLoggedIn) {
			// Alert.alert("test", `${isLoggedIn}`);
			// console.log("Redirecting to Friends List");
			// setJustLoggedIn(false)
			router.push("/friends list");
		} else {
			// console.log("Redirecting to Login");keytool -help
			// setJustLoggedIn(true)
			router.push("/login");
		}
	}

	return (
		<ChatProvider>
			<View style={{ flex: 1 }}>
				<Tabs
					screenOptions={{
						tabBarStyle: { display: "none" },
						headerShown: false,
					}}
				>
					<Tabs.Screen
						name="login"
						options={{
							title: "login",
						}}
					/>
					,
					<Tabs.Screen
						name="friends list"
						options={{
							title: "friends list",
						}}
					/>
					{/* <Tabs.Screen
            name="Chat"
            options={{
              title: 'Chat'
            }}
          /> */}
				</Tabs>
				<View style={styles.footer}>
					<Text style={styles.footerText}>
						Made by Eng/ Abdelrahman Elmarsafawy
					</Text>
				</View>
			</View>
		</ChatProvider>
	);
}

const styles = StyleSheet.create({
	footer: {
		padding: 10,
		backgroundColor: "rgb(6 58 81)",
	},
	footerText: {
		fontSize: 15,
		color: "white",
		textAlign: "center",
	},
});
