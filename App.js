
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { firebase, db } from './firebase'; 
import UserInfo from './UserInfo';

const Stack = createStackNavigator();

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (navigation) => { 
    try {
     
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Retrieve user data from database
      const querySnapshot = await db.collection('users').where('email', '==', email).get();

      if (!querySnapshot.empty) {
        //one email per account
        const userData = querySnapshot.docs[0].data();
        console.log('User data from Firestore:', userData);

        
        navigation.navigate('UserInfo', { user: userData });
      } else {
        console.log('User data not found in Firestore');
      }

      
      Alert.alert('Login Successful', 'Welcome back!');
    } catch (error) {
      console.error('Error logging in:', error.message);
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

//front end
const LoginScreen = ({ navigation, email, setEmail, password, setPassword, handleLogin }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TripAid</Text>
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

//css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
});