import { useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  // Controls whether the profile photo is visible
  const [showPhoto, setShowPhoto] = useState(true);

  // Stores the nickname entered by the user
  const [nickname, setNickname] = useState("");

  // Controls dark mode
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView style={darkMode ? styles.darkPage : styles.page}>
      <View style={styles.container}>

        {/* Profile Photo */}
        {showPhoto && (
          <Image
            source={require("../../assets/images/nayanpp.jpeg")}
            style={styles.photo}
          />
        )}

        {/* Profile Information */}
        <Text style={styles.name}>
          Nayan R Burlakoti
        </Text>

        <Text style={styles.role}>
          BSc IT Student | AI Enthusiast
        </Text>

        <Text style={styles.bio}>
          I am learning programming, AI, and mobile
          application development.
        </Text>

        {/* Hide / Show Photo */}
        <Pressable
          style={styles.button}
          onPress={() => setShowPhoto(!showPhoto)}
        >
          <Text style={styles.buttonText}>
            {showPhoto ? "Hide Photo" : "Show Photo"}
          </Text>
        </Pressable>


        {/* Text Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Enter Your Nickname
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your nickname"
            value={nickname}
            onChangeText={setNickname}
          />

          {nickname !== "" && (
            <Text style={styles.greeting}>
              Hello, {nickname}!
            </Text>
          )}
        </View>


        {/* Dark Mode Switch */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.switchText}>
              Dark Mode
            </Text>

            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </View>
        </View>


        {/* Activity Indicator */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Loading Indicator
          </Text>

          <ActivityIndicator size="large" />

          <Text style={styles.smallText}>
            This shows a loading animation.
          </Text>
        </View>


        {/* TouchableOpacity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            TouchableOpacity
          </Text>

          <TouchableOpacity
            style={styles.touchButton}
            onPress={() => alert("Profile button pressed!")}
          >
            <Text style={styles.buttonText}>
              View Profile
            </Text>
          </TouchableOpacity>
        </View>


        {/* Bottom Message */}
        <Text style={styles.footer}>
          Built with React Native 🚀
        </Text>

      </View>
    </ScrollView>
  );
}


// ================================
// STYLES
// ================================

const styles = StyleSheet.create({

  page: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  darkPage: {
    flex: 1,
    backgroundColor: "#222",
  },

  container: {
    alignItems: "center",
    padding: 30,
    paddingTop: 60,
    paddingBottom: 50,
  },

  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },

  role: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },

  bio: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 25,
  },

  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  section: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },

  greeting: {
    fontSize: 18,
    marginTop: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  switchText: {
    fontSize: 17,
  },

  smallText: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },

  touchButton: {
    backgroundColor: "#6c5ce7",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  footer: {
    marginTop: 30,
    fontSize: 15,
    color: "#777",
  },

});