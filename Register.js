import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase, db } from './firebase';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('user');
  const [disabled, setDisabled] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [genderValid, setGenderValid] = useState(null);
  const [locationValid, setLocationValid] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateGenderAndLocation = (value) => {
    return typeof value === 'string' && value.trim() !== '';
  };

  const handleRegister = async () => {
    if (!emailValid || !passwordValid || !genderValid || !locationValid) {
      Alert.alert('Validation Error', 'Please fill in all fields correctly.');
      return;
    }
  
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      if (!user) {
        Alert.alert('Registration Error!');
        return;
      }
  
      await db.collection('users').doc(user.uid).set({
        email,
        age,
        gender,
        location,
        role,
        disabled,
      });
  
      Alert.alert('Registration Successful', 'Welcome to the app!');
  
      navigation.goBack();
    } catch (error) {
      console.error('Error registering user:', error.message);
      Alert.alert('Registration Error', error.message);
    }
  };
  
  
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);

    // Format the date as dd/mm/yyyy
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    setAge(formattedDate);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailValid(null);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordValid(null);
  };

  const handleGenderChange = (text) => {
    setGender(text);
    setGenderValid(null);
  };

  const handleLocationChange = (text) => {
    setLocation(text);
    setLocationValid(null);
  };

  const validateFields = () => {
    setEmailValid(validateEmail(email));
    setPasswordValid(validatePassword(password));
    setGenderValid(validateGenderAndLocation(gender));
    setLocationValid(validateGenderAndLocation(location));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={[styles.input, emailValid === false && styles.invalidInput]}
        placeholder="Email"
        onChangeText={handleEmailChange}
        onBlur={validateFields}
        value={email}
      />
      {emailValid === false && <Text style={styles.validationText}>{'\u2718'} Please enter a valid email address</Text>}
      <TextInput
        style={[styles.input, passwordValid === false && styles.invalidInput]}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={handlePasswordChange}
        onBlur={validateFields}
        value={password}
      />
      {passwordValid === false && <Text style={styles.validationText}>{'\u2718'} Password must be at least 6 characters long</Text>}
      <View style={styles.datePickerContainer}>
        <Text style={styles.datePickerLabel}>Birthday:</Text>
        <Text style={styles.datePickerValue} onPress={() => setShowDatePicker(true)}>
          {age}
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
        )}
      </View>
      <TextInput
        style={[styles.input, genderValid === false && styles.invalidInput]}
        placeholder="Gender"
        onChangeText={handleGenderChange}
        onBlur={validateFields}
        value={gender}
      />
      {genderValid === false && <Text style={styles.validationText}>{'\u2718'} Please enter a valid gender</Text>}
      <TextInput
        style={[styles.input, locationValid === false && styles.invalidInput]}
        placeholder="Location"
        onChangeText={handleLocationChange}
        onBlur={validateFields}
        value={location}
      />
      {locationValid === false && <Text style={styles.validationText}>{'\u2718'} Please enter a valid location</Text>}
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
  invalidInput: {
    borderColor: 'red',
  },
  validationText: {
    color: 'red',
    marginBottom: 8,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  datePickerLabel: {
    marginRight: 10,
  },
  datePickerValue: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});

export default Register;
