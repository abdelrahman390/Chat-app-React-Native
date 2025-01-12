import { Tabs, useRouter, usePathname } from 'expo-router';
import React, { createContext, useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet, BackHandler, Alert, ToastAndroid } from 'react-native';
import { useNavigation, useRoute, } from '@react-navigation/native';
// import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Stack } from 'expo-router';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { GlobalProvider, useGlobalState } from './GlobalContext';
import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { UserProvider } from '../UserContext';


export default function TabLayout() {
  // console.log("layout is rendering now ++++++++++")

  const router = useRouter(); // Initialize router
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [backPressCount, setBackPressCount] = useState(0);
  const pathname = usePathname();
  const navigation = useNavigation();

  useEffect(() => {
    console.log('Current screen:', pathname); // Log the current screen
    const backAction = () => {
      if (pathname == '/chat') { // Replace 'Chat' with your target screen's name
        router.push('/friends list')
        return true; // Prevent default back navigation
      } else if (pathname == '/friends%20list') {
        if (backPressCount == 0) {
          setBackPressCount(1)
          // Alert.alert('Alert first', `${backPressCount}`)
        } else {
          setBackPressCount(0)
          // Alert.alert('Alert seconde', 'My Alert Msg')
          // Alert.alert('Are you sure you want to exit ?', '', [
          //   {
          //     text: 'Cancel',
          //     onPress: () => null,
          //     style: 'cancel',
          //   },
          //   { text: 'OK', onPress: () => BackHandler.exitApp() },
          // ]);
          BackHandler.exitApp()
        }
        return true; // Prevent default back navigation
      }
      return false; // Allow default back navigation for other screens

    };

    // Add the back event listener
    BackHandler.addEventListener('hardwareBackPress', backAction);

    // Cleanup the event listener on unmount
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [pathname, navigation, backPressCount]); // Add dependencies to re-run when route or navigation changes




  const getUsername = async () => {
    // console.log("getUsername in layout run")
    try {
      const value: any = await AsyncStorage.getItem('user')
      if (value) {
        const user: { userId: number, userName: string, loggedIn: boolean } = JSON.parse(value);
        setLoggedIn(user.loggedIn)
        console.log("from layout loggedIn", user.loggedIn)
        direct(user.loggedIn)
      }
    } catch (error) {
      console.error('Error loading data', error);
    }
  };
  useEffect(() => {
    getUsername();
  }, []);
  // console.log("from layout loggedIn", loggedIn)

  // Redirect user based on the loggedIn state

  function direct(isLogin: boolean) {
    // if (isReady) {
    if (isLogin) {
      console.log("Redirecting to Friends List");
      router.push('/friends list');
    } else {
      console.log("Redirecting to Login");
      router.push('/login');
    }
    // }
  }

  return (
    <UserProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarStyle: { display: 'none' },
            tabBarActiveTintColor: "red",
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
          }}>
          <Tabs.Screen
            name="login"
            options={{
              title: 'login'
            }}
          />,
          <Tabs.Screen
            name="friends list"
            options={{
              title: 'friends list'
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
          <Text style={styles.footerText}>Made by Eng/ Abdelrahman Elmarsafawy</Text>
        </View>
      </View>
    </UserProvider>

  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 10,
    backgroundColor: 'rgb(6 58 81)',
  },
  footerText: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
  }
});

