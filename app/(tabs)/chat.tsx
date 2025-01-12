import { Image, StyleSheet, Text, View, Alert, TouchableOpacity, FlatList, Dimensions, ScrollView, TextInput, BackHandler } from 'react-native';
import React, { useState, useRef, useEffect, } from 'react';
// import { useNavigation } from '@react-navigation/native';
import { useRouter, usePathname, useRootNavigationState } from 'expo-router';
import { chat } from '../UserContext';

const Chat = () => {
  // const navigation = useNavigation();
  const router = useRouter(); // Initialize router
  const { chatData, setChatData } = chat();
  const flatListRef = useRef<FlatList>(null);
  const [chatMessages, setChatMessages] = useState<{}>({});
  const [chatMessagesIsLoading, setChatMessagesIsLoading] = useState(true);
  // console.log("chat page", chatData)


  const getFriendsList = async () => {
    try {
      let ipv4 = '192.168.1.8'
      const response = await fetch(`http://${ipv4}:8000/api/chat/OpenedChatMessages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatData?.chatId
        }),
      });

      // Check if the response was successful
      const data = await response.json();
      // console.log('chat page spi', data)
      if (response.ok) {
        // console.log('chat page spi test', Object.values(data.chat))
        setChatMessagesIsLoading(false)
        setChatMessages(Object.values(data.chat))
      } else {
        console.error('Error response:', data);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
  useEffect(() => {
    getFriendsList()
    // setChatMessages({})
  }, [chatData]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.left}>
          <Image
            source={require('../../assets/images/user.png')}
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
              <View style={[styles.message, item.sender === chatData?.Sender ? styles.myMessage : styles.friendMessage,]}>
                <View style={styles.messageContent}>
                  <Text style={item.sender === chatData?.Sender ? styles.MyMessageText : styles.friendMessageText}>
                    {item.msg}
                  </Text>
                  <Text style={item.sender === chatData?.Sender ? styles.MyMessageData : styles.friendMessageData}>
                    {item.date}
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
        />
        <TouchableOpacity onPress={() => router.push('/friends list')}>
          {/* <TouchableOpacity > */}
          <Image
            source={require('../../assets/images/send.png')}
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
    backgroundColor: '#192a56',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 55,
    backgroundColor: '#193479',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 157, 255, 0.3490196078)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: "white"
  },
  chat: {
    flex: 1,
    padding: 10,
  },
  message: {
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#005c4b',
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
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
    alignSelf: 'flex-start',
    backgroundColor: '#d8d8d8',
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  messageContent: {
    flexDirection: 'column',
  },
  sendMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: '#193479',
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 157, 255, 0.3490196078)',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    backgroundColor: "#2148ab",
    borderColor: '#ccc',
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


