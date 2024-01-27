import React, { useState } from 'react';
import { View, Text,Image, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { firebase, db } from './firebase'; 
import UserInfo from './UserInfo';
import Register from './Register';
import Map from './map';
import Post from "./Post";
import Comment from './Comment';
import Admin from './Admin';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = async (navigation) => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const querySnapshot = await db.collection('users').where('email', '==', email).get();

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log('User data from Firestore:', userData);

        setUserEmail(email); 
        navigation.navigate('HomePage', {
          screen: 'UserInfo',
          params: { user: userData, userEmail: email },
         }); 
      } else {
        console.log('User data not found in Firestore');
      }

      Alert.alert('Login Successful', 'Welcome back!');
    } catch (error) {
      console.error('Error logging in:', error.message);
      Alert.alert('Login Error', error.message);
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} email={email} setEmail={setEmail} password={password} setPassword={setPassword} 
          handleLogin={() => handleLogin(props.navigation)}
           />}
        </Stack.Screen>
        <Stack.Screen name="Register" component={Register} /> 
        <Stack.Screen options={{headerShown: false}} name="HomePage" component={HomePage} />

      </Stack.Navigator>      
    </NavigationContainer>

  );
}

const LoginScreen = ({ navigation, email, setEmail, password, setPassword, handleLogin }) => {
  const handleRegisterNavigation = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/icon.png')} style={styles.logo} />
      <Text style={styles.title}>TREKMATE</Text>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRegisterNavigation}>
          <Text>Register</Text>
        </TouchableOpacity>
        <View style={styles.buttonGap} />
        <TouchableOpacity style={styles.button} onPress={() => handleLogin(navigation)}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomePage = ({ navigation, route }) => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="UserInfo" component={UserInfo} options={{title: 'My Profile'}}></Drawer.Screen>
      <Drawer.Screen name="Forum" component={Forum}></Drawer.Screen>
      <Drawer.Screen name="Map" component={Map}></Drawer.Screen>
      <Drawer.Screen name="Admin" component={Admin}></Drawer.Screen>
    </Drawer.Navigator>
  );
}

const Forum = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Post" component={Post} options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name="Comment" component={Comment} options={{headerShown: false}}></Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
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
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  buttonGap: {
    width: 15,
  },
  forgotPasswordText: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});