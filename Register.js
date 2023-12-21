import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { firebase, db } from './firebase';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');

  const handleRegister = async () => {
    try {
    
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      if (!user) {
    
        Alert.alert('Registration Error !');
        return;
      }
  

      await db.collection('users').doc(user.uid).set({
        email,
        age: parseInt(age, 10), 
        gender,
        location,
      });
  
      
      Alert.alert('Registration Successful', 'Welcome to the app!');
  
    
      navigation.goBack();
    } catch (error) {
      console.error('Error registering user:', error.message);
    
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Age"
        onChangeText={(text) => setAge(text)}
        value={age}
        keyboardType="numeric" 
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        onChangeText={(text) => setGender(text)}
        value={gender}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        onChangeText={(text) => setLocation(text)}
        value={location}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

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

export default Register;
