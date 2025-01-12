import { Image, StyleSheet, Text, View, Alert, TouchableOpacity, FlatList, Dimensions, } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect, useRoute, useNavigationState, useNavigation } from '@react-navigation/native';
import { chat } from '../UserContext';


export default function FriendsList() {
  const router = useRouter(); // Initialize router
  const { chatData, setChatData } = chat();

  const logoutButtonRef = useRef(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<{ userId: number; userName: string }>();
  const [loggedOut, setLoggedOut] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [remainingHeight, setRemainingHeight] = useState(Dimensions.get('window').height);

  const calculateRemainingHeight = () => {
    const screenHeight = Dimensions.get('window').height;
    setRemainingHeight(screenHeight - headerHeight - 10);
    // console.log(screenHeight - headerHeight)
  };
  useEffect(() => {
    if (headerHeight > 0) {
      calculateRemainingHeight();
    }
  }, [headerHeight]);

  async function logout() {
    let userData: { loggedIn: boolean } = { loggedIn: false }
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setAllUsers([])
    setLoggedOut(true)
    router.push('/login');
  }

  const getUsername = async () => {
    try {
      // console.log("getUsername works ######################")
      const value: any = await AsyncStorage.getItem('user')
      const justLoggedIn: any = await AsyncStorage.getItem('justLoggedIn')
      if (value) {
        const user: { userId: number, userName: string, loggedIn: boolean } = JSON.parse(value);
        setUser({ userId: user.userId, userName: user.userName })
        // console.log("user loggedIn in friends list", user.loggedIn)
        if (user.loggedIn) {
          console.log("justLoggedIn from getUsername():", justLoggedIn)
          if (Boolean(justLoggedIn)) {
            getFriendsList(user.userName)
            try {
              await AsyncStorage.setItem('justLoggedIn', 'false');
              // console.log("justLoggedIn changed getUsername():", justLoggedIn)
            } catch (error) {
              console.error('Error saving data', error);
            }
          }
        } else {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error loading data', error);
    }
  };
  useEffect(() => {
    getUsername();
  }, [loggedOut]);

  function openChat(id: Number, title: string) {
    // sender id + receiver id #
    let chatId: number = +String(user!.userId).slice(-2) + +String(id).slice(-2)
    console.log(chatId)
    setChatData({ chatId: chatId, Sender: user?.userName!, receiver: title });
    router.push('/chat');
    // router.push('/(tabs)/chat');
  }


  let ipv4 = '192.168.1.8'
  const getFriendsList = async (userName: string) => {
    try {
      console.log("*********** get Friends List fetched ***********")
      // Making the API request
      const response = await fetch(`http://${ipv4}:8000/api/chat/getFriendsList/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: userName
        }),
      });

      // Check if the response was successful
      const data = await response.json();
      // console.log(data)
      // setMessage(`'done' ${data}`);
      if (response.ok) {
        // console.log(data.users)
        // Alert.alert(`${JSON.stringify(data.users)}`)
        setAllUsers(data.users)
      } else {
        console.error('Error response:', data);
      }
    } catch (error) {
      // setLoginServerAlarm(true)
      console.error('Error during login:', error);
      // setLoginLoading(false)
      // setMessage(`'Failed to connect to the server' ${error}`);
    }
  }

  const Item = ({ title, id }: { title: string, id: number }) => (
    <TouchableOpacity onPress={() => openChat(id, title)} style={styles.friend} >
      <Text style={styles.friendText} >{title}</Text>
    </TouchableOpacity>
  );

  type Friend = {
    id: string;
    user_name: string;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerCont} onLayout={(event) => {
        const height = event.nativeEvent.layout.height;
        // console.log("Header height:", height);
        setHeaderHeight(height);
      }}>
        <Text style={styles.header}>Chat App</Text>
        <View style={styles.userNameCont}>
          {/* <Text style={styles.userName}>{user?.userName ? user?.userName : "null"}</Text> */}
          <Text style={styles.userName}>{user?.userName || 'Error'}</Text>

          <TouchableOpacity ref={logoutButtonRef} onPress={() => logout()} style={styles.button} >
            <Text style={[{ color: 'white', fontSize: 15 }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.List, { height: remainingHeight }]}>
        {/* <Text style={{ color: "white" }}>{message}</Text> */}
        <FlatList<Friend>
          data={allUsers}
          renderItem={({ item }) => <Item title={item.user_name} id={Number(item.id)} />}
          keyExtractor={item => item.id}
        />
        {/* <TouchableOpacity onPress={() => openChat(1725483411380)} style={styles.friend}>
          <Text style={styles.friendText} >Abdelrahman</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  headerCont: {
    padding: 20,
    paddingTop: 55,
    backgroundColor: '#192a56',
    display: 'flex',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-around',
    textAlign: "center",
    borderBottomColor: "rgb(39, 108, 168)",
    borderBottomWidth: 1
  },
  header: {
    fontSize: 20,
    color: "white",
  },
  userNameCont: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  userName: {
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    // borderWidth: '1px solid rgba(39,108,168,1.00)',
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: "rgba(39,108,168,1.00)",
    borderRadius: 10
  },
  List: {
    height: 689,
    backgroundColor: '#193479',
  },
  button: {
    padding: 10,
    backgroundColor: '#193479',
    color: 'white',
    borderRadius: 10,
  },
  friend: {
    backgroundColor: "#1f3369",
    borderBottomColor: "#7c869f",
    borderBottomWidth: 1
  },
  friendText: {
    color: "white",
    padding: 20,
    fontSize: 22
  }
});

