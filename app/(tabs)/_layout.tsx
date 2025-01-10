import { Tabs, useRouter } from 'expo-router';
import React, { createContext, useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Stack } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { GlobalProvider, useGlobalState } from './GlobalContext';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// import FriendsList from './friends list';
// import LoginPage from './login';


import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
// import { useRouter } from 'expo-router';

// const GlobalContext = createContext(undefined)

export default function TabLayout() {
  // console.log("layout is rendering now ++++++++++")
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  // const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false); // Track when layout is ready
  const router = useRouter(); // Initialize router

  const getUsername = async () => {
    // console.log("getUsername in layout run")
    try {
      const value: any = await AsyncStorage.getItem('user')
      if (value) {
        const user: { userId: number, userName: string, loggedIn: boolean } = JSON.parse(value);
        setLoggedIn(user.loggedIn)
        // console.log("from layout loggedIn", user.loggedIn)
        direct()
        // console.log("from layout", user)
      }
    } catch (error) {
      console.error('Error loading data', error);
    }
    // finally {
    //   setIsReady(true); // Mark as ready regardless of success or failure
    // }
  };
  useEffect(() => {
    getUsername();
    // console.log("from layout loggedIn inside useEffect", loggedIn)
    // setIsReady(true);
  }, []);
  // console.log("from layout loggedIn", loggedIn)

  // Redirect user based on the loggedIn state
  // useEffect(() => {
  function direct() {
    if (isReady) {
      if (loggedIn) {
        console.log("Redirecting to Friends List");
        router.push('/friends list');
      } else {
        console.log("Redirecting to Login");
        router.push('/login');
      }
    }
  }
  // }, [loggedIn]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: { display: 'none' },
          tabBarActiveTintColor: "red",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          // tabBarStyle: Platform.select({
          //   ios: {
          //     // Use a transparent background on iOS to show the blur effect
          //     position: 'absolute',
          //   },
          //   default: {},
          // }),
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
      </Tabs>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made by Eng/ Abdelrahman Elmarsafawy</Text>
      </View>
    </View>
  );
}

// export const useGlobalState = () => {
//   const context = useContext(GlobalContext);
//   if (!context) {
//     throw new Error('useGlobalState must be used within a GlobalProvider');
//   }
//   return context;
// };


const styles = StyleSheet.create({
  footer: {
    padding: 15,
    backgroundColor: 'rgba(18,150,209,1.00)',
  },
  footerText: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
  }
});




{/* <Tab.Screen
          name="index"
          component={HomeScreen} 
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        /> */}



// // <View style={{ flex: 1 }}>
// <NavigationContainer>
//   <Tab.Navigator
//     screenOptions={{
//       // tabBarStyle: { display: 'none' },
//       tabBarActiveTintColor: "red",
//       headerShown: false,
//       tabBarButton: HapticTab,
//       tabBarBackground: TabBarBackground,
//       tabBarStyle: Platform.select({
//         ios: {
//           // Use a transparent background on iOS to show the blur effect
//           position: 'absolute',
//         },
//         default: {},
//       }),
//     }}>
//     <Tab.Screen
//       name="login"
//       component={LoginPage}
//     // initialParams={{ loggedIn: false }}
//     />
//     <Tab.Screen
//       name="friends list"
//       component={FriendsList}
//     // initialParams={{ loggedIn: true }} // Pass data
//     />
//   </Tab.Navigator>
//   <View style={styles.footer}>
//     <Text style={styles.footerText}>Made by Eng/ Abdelrahman Elmarsafawy</Text>
//   </View>
// </NavigationContainer>
// // </View>