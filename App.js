// App.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { firebase, db } from './firebase'; // Import both firebase and db
import UserInfo from './UserInfo';

const Stack = createStackNavigator();

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (navigation) => { // Pass navigation as a parameter
    try {
      // Sign in user
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Retrieve user data from Firestore based on email
      const querySnapshot = await db.collection('users').where('email', '==', email).get();

      if (!querySnapshot.empty) {
        // Assuming there's only one document for each user (based on email)
        const userData = querySnapshot.docs[0].data();
        console.log('User data from Firestore:', userData);

        // Navigate to UserInfoScreen and pass user data as params
        navigation.navigate('UserInfo', { user: userData });
      } else {
        console.log('User data not found in Firestore');
      }

      // Display a pop-up or alert
      Alert.alert('Login Successful', 'Welcome back!');
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Display an error pop-up or alert
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleLogin={() => handleLogin(props.navigation)} />}
        </Stack.Screen>
        <Stack.Screen name="UserInfo" component={UserInfo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const LoginScreen = ({ navigation, email, setEmail, password, setPassword, handleLogin }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button title="Login" onPress={() => handleLogin(navigation)} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Your styles here
});
