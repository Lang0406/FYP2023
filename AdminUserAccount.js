import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, FlatList } from 'react-native';
import { firebase, db } from './firebase';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const AdminUserAccount = ({route}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [location, setLocation] = useState('');
    const [role, setRole] = useState('');
    const [id, setID] = useState('');
    const [disabled, setDisabled] = useState(false);

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
        setDisabled(item.disabled ? item.disabled : false)
    }, [item]);

    const data = 
      (route.params.role == "accountmanager" ? (
        route.params.item.id ? 
      ([
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ]) : (
          [{ label: 'Admin', value: 'admin' },]
        )
      ) : (
        [
          { label: 'User', value: 'user' },
          { label: 'Influencer', value: 'influencer' },
        ]
      ))

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
                    disabled,
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

    const renderItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
          {item.value == role && (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
        </View>
      );
    };

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
            {item.disabled ? (<Text style={styles.textDisabled}>Account disabled</Text>) : (<></>)}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select role"
              value={role}
              onChange={item => {
                setRole(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
              )}
              renderItem={renderItem}
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
        borderRadius: 5,
      },
      button:{
        width: '50%',
        padding: 16,
        borderWidth: 1,
        alignItems: 'center',
        marginTop: 50,
      },
      dropdownContainer : {
        alignItems: 'flex-start',
      },
      dropdown: {
        margin: 10,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        padding: 12,
        paddingHorizontal: 110,
        alignSelf: 'stretch',
      },
      icon: {
        marginRight: 5,
      },
      item: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      textItem: {
        flex: 1,
        fontSize: 16,
        color: 'black',
      },
      placeholderStyle: {
        fontSize: 16,
        color: 'black',
      },
      selectedTextStyle: {
        fontSize: 16,
        margin: 60,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      textDisabled: {
        padding: 10,
        fontStyle: 'italic',
      },
  });

export default AdminUserAccount;
