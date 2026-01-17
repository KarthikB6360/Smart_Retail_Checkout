import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/* ================= KNOWLEDGE BASE ================= */
/* 🔒 UNCHANGED – ALL QnA PRESERVED */

const KNOWLEDGE = [
  { q: ["hello", "hi", "hey"], a: "👋 Hello! I’m your Smart Retail Assistant. How can I help you today?" },
  { q: ["founder", "who created", "who made", "owner"], a: "👨‍💻 The main founder of this project is **Karthik B**." },
  { q: ["login", "sign in"], a: "🔐 Login using your registered email and password to access the app." },
  { q: ["signup", "register", "create account"], a: "📝 You can create a new account by signing up with your email and password." },
  { q: ["forgot password", "reset password"], a: "🔑 Use the Forgot Password option to reset your password securely." },
  { q: ["logout", "exit", "sign out"], a: "🚪 You can logout anytime from the Profile section." },
  { q: ["scan"], a: "📸 Scan products using AI. The app can detect items even without a barcode." },
  { q: ["cart"], a: "🛍 My Cart shows all added items, quantity controls and total price." },
  { q: ["nutrition"], a: "🥗 Nutrition Score analyzes calories, sugar, fat, protein, fiber and sodium." },
  { q: ["eco"], a: "🌱 Eco Score shows how eco-friendly a product is based on packaging." },
  { q: ["rewards"], a: "🎁 Earn reward points by shopping smart and playing reward games." },
  { q: ["invoice"], a: "📄 Invoice History stores all previous scanned and purchased items." },
  { q: ["chatbot"], a: "🤖 I can guide you through the entire app—from login to checkout." },
  { q: ["app"], a: "📱 MySmartApp is a smart retail application built using React Native." },
];

const DEFAULT_REPLY =
  "🤖 I can help with scanning, nutrition score, eco score, rewards and more.";

const getBotReply = (text) => {
  const msg = text.toLowerCase();
  for (let item of KNOWLEDGE) {
    if (item.q.some((k) => msg.includes(k))) return item.a;
  }
  return DEFAULT_REPLY;
};

/* ================= CHATBOT SCREEN ================= */

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "👋 Hi! I’m your Smart Retail Assistant. How can I help you today?", type: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const flatListRef = useRef(null);

  /* 🔥 KEYBOARD HEIGHT TRACKING (CRITICAL FIX) */
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: userText, type: "user" },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: getBotReply(userText), type: "bot" },
      ]);
    }, 300);
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages, keyboardHeight]);

  const renderMessage = ({ item }) => (
    <View style={[styles.bubble, item.type === "user" ? styles.userBubble : styles.botBubble]}>
      {item.type === "bot" && (
        <MaterialCommunityIcons name="robot-outline" size={18} color="#4f46e5" style={{ marginRight: 6 }} />
      )}
      <Text style={styles.msgText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#4f46e5" barStyle="light-content" />

      {/* HEADER – NEVER MOVES */}
      <LinearGradient colors={["#4f46e5", "#3730a3"]} style={styles.header}>
        <MaterialCommunityIcons name="robot-happy-outline" size={26} color="#fff" />
        <Text style={styles.headerTitle}>Smart Retail Chatbot</Text>
      </LinearGradient>

      {/* CHAT */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 14,
          paddingBottom: 80 + keyboardHeight,
        }}
      />

      {/* INPUT – MANUALLY MOVED ABOVE KEYBOARD */}
      <View
        style={[
          styles.inputBar,
          { bottom: keyboardHeight },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="Ask something about the app..."
          placeholderTextColor="#777"
          value={input}
          onChangeText={setInput}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <MaterialCommunityIcons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#eef2ff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginLeft: 10,
  },

  bubble: {
    maxWidth: "80%",
    padding: 12,
    marginVertical: 6,
    borderRadius: 14,
    flexDirection: "row",
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },

  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e7ff",
  },

  msgText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    flexShrink: 1,
  },

  inputBar: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  sendBtn: {
    backgroundColor: "#4f46e5",
    padding: 12,
    marginLeft: 10,
    borderRadius: 12,
  },
});
