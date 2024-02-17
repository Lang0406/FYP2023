import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { firebase, db } from './firebase';
import UserInfo from './UserInfo';
import Register from './Register';
import Map from './map';
import Post from "./Post";
import Comment from './Comment';
import Admin from './Admin';
import AdminUserAccount from './AdminUserAccount';
import Markers from './Markers';
import Guides from './Guides';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const CustomDrawerContent = (props) => {
  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }).catch((error) => {
      console.error('Error logging out:', error.message);
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text>Log Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};


const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleLogin = async (navigation) => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const querySnapshot = await db.collection('users').where('email', '==', email).get();

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log('User data from Firestore:', userData);

        setRole(userData.role);

        if (userData.disabled) {
          throw new Error("Login error: Your account has been suspended!")
        }
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
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login">
          {props => (
            <LoginScreen
              {...props}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLogin={() => handleLogin(props.navigation)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="HomePage" options={{ headerShown: false }}>
          {props => <HomePage email={email} role={role} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const LoginScreen = ({ navigation, email, setEmail, password, setPassword, handleLogin }) => {
  const handleRegisterNavigation = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Image source={require('./assets/icon.png')} style={styles.logo} />
          <Text style={styles.title}>
            <Text style={styles.trek}>Trek</Text>
            <Text style={styles.mate}>Mate</Text>
          </Text>

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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const HomePage = ({ email, role }) => {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="UserInfo" component={UserInfo} options={{ title: 'My Profile' }} />
      {role === 'admin' ? (
        <>
          <Drawer.Screen name="Forum">
            {props => <Forum {...props} email={email} role={role} />}
          </Drawer.Screen>
          <Drawer.Screen name="Map" component={Map} />
          <Drawer.Screen name="Marker" component={Markers} />
          <Drawer.Screen name="Guides">
            {props => <Guides {...props} email={email} role={role} />}
          </Drawer.Screen>
          <Drawer.Screen name="Admin">
            {props => <SysAdmin role={role} />}
          </Drawer.Screen>
        </>
      ) : (
        role === 'accountmanager' ? (
          <Drawer.Screen name="Admin">
            {props => <SysAdmin role={role} />}
          </Drawer.Screen>
        ) : (
          <>
            <Drawer.Screen name="Forum">
              {props => <Forum {...props} email={email} role={role} />}
            </Drawer.Screen>
            <Drawer.Screen name="Map" component={Map} />
            <Drawer.Screen name="Guides">
              {props => <Guides {...props} email={email} role={role} />}
            </Drawer.Screen>
          </>
        )
      )}
    </Drawer.Navigator>
  );
};

const Forum = ({ email, role }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Post" options={{ headerShown: false }}>
        {props => <Post {...props} email={email} role={role} />}
      </Stack.Screen>
      <Stack.Screen name="Comment" component={Comment} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const SysAdmin = ({ role }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SysAdminMain" options={{ headerShown: false }}>
        {props => <Admin {...props} role={role} />}
      </Stack.Screen>
      <Stack.Screen name="AdminUserAccount" component={AdminUserAccount} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingTop: 100,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    marginBottom: 25,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 25,
    paddingLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6E6FA',
    padding: 10,
  },
  trek: {
    color: '#89CFF0',
  },
  mate: {
    color: '#FFB6C1',
  },
  buttonGap: {
    width: 25,
  },
  forgotPasswordText: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  logoutButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default App;
