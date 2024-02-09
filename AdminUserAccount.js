import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, FlatList } from 'react-native';
import { firebase, db } from './firebase';
import { useNavigation } from '@react-navigation/native';

const AdminUserAccount = ({route}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [location, setLocation] = useState('');
    const [role, setRole] = useState('');
    const [id, setID] = useState('');

    const navigation = useNavigation();

    const item = route.params.item;
    const headerText = route.params.item.id ? "Edit" : "Create";

    useEffect(() => {
        setEmail(item.email)
        setAge(item.age ? item.age.toString() : "")
        setGender(item.gender)
        setLocation(item.location)
        setID(item.id)
        setRole(item.role ? item.role : "")
    }, [item]);

    const handleUserAccount = async () => {
        //Handle create
        if(headerText == "Create"){
            try {
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
    
                if(!user){
                    console.log('Error firebase')
                    Alert.alert('Error in creating account');
                    return;
                }
    
                await db.collection('users').doc(user.uid).set({
                    email,
                    age: parseInt(age, 10),
                    gender,
                    location,
                    role,
                });
    
                Alert.alert('Account successfully created!')
                navigation.goBack();
            } catch (error){
                console.log(error)
            }

        }
        //Handle edit
        else {
            try{
                db.collection('users').doc(id).update({
                    gender,
                    age,
                    location,
                    role,
                })
                Alert.alert('Changes saved successfully!')
            }catch(error){
                console.log(error)
            }
            navigation.goBack();
        }

    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{headerText} User</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
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
            <TextInput
                style={styles.input}
                placeholder="Role"
                onChangeText={(text) => setRole(text)}
                value={role}
            />
            <TouchableOpacity style={styles.button} onPress={() => handleUserAccount()}>
                <Text>{headerText}</Text>
            </TouchableOpacity>     
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
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
      button:{
        width: '50%',
        padding: 16,
        borderWidth: 1,
        alignItems: 'center',
        marginTop: 50,
      },
  });

export default AdminUserAccount;
