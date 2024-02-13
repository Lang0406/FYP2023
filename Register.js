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
  const [role, setRole] = useState('user')
  const [showDatePicker, setShowDatePicker] = useState(false);


  const handleRegister = async () => {
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
