import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, FlatList } from 'react-native';
import { db } from './firebase';
import { useNavigation } from '@react-navigation/native';

const Admin = ({ route, navigation }) => {
    const [searchInput, setSearchInput] = useState('');
    const [userAccounts, setUserAccounts] = useState([]);

    //Fetch users when page loads
    useEffect(() => {
        const fetchUsers = async () => {
          console.log("Fetching users")
          try {
            const querySnapshot = await db.collection('users').get();
            const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setUserAccounts(usersData);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
    
        fetchUsers();
      }, []);

      //Handle create usera
      const handleUserCreate = () => {
        const item = {
          id: null
        };
        navigation.navigate('AdminUserAccount', {item})
      }

      //Handle edit user
      const handleUserEdit = item => {
        navigation.navigate('AdminUserAccount', {item})
      }

      //Handle suspend user (in progress)
      const handleUserSuspend = item => {
        console.log('Suspend', item)
      }
      
      //Render each user
      const renderUserItem = ({ item }) => (
        item.email.toUpperCase().includes(searchInput.toUpperCase()) ? (
        <View style={styles.container}>
          <View>
            <Text style={styles.text}>Email: {item.email}</Text>
            <Text style={styles.text}>Gender: {item.gender}</Text>
            <Text style={styles.text}>Age: {item.age}</Text>
            <Text style={styles.text}>Location: {item.location}</Text>
            <Text style={styles.text}>Role: {item.role}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonEdit} onPress={() => handleUserEdit(item)}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSuspend} onPress={() => handleUserSuspend(item)}>
                <Text>Suspend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        ) : (
          <></>
        )
      );  

    return (
      <View style={styles.pageContainer}>
          <TouchableOpacity style={styles.topButton} onPress={() => handleUserCreate()}>
            <Text>Create New User</Text>
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <TextInput
                  style={styles.input}
                  placeholder="Search for user email..."
                  onChangeText={(text) => setSearchInput(text)}
                  value={searchInput}
              />
          </View>
          <FlatList
              data={userAccounts}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.email}
          />
      </View>
    );
}

const styles = StyleSheet.create({
    topButton:{
      width: '50%',
      padding: 16,
      borderWidth: 1,
      alignItems: 'center',
    },
    buttonEdit:{
      borderWidth: 0.5,
      padding: 16,
      alignItems: 'center',
      width: '50%',
      borderColor: 'darkslateblue',
    },
    buttonSuspend:{
      borderWidth: 0.5,
      padding: 16,
      alignItems: 'center',
      width: '50%',
      borderColor: 'red',
    },
    container: {
      padding: 16,
      borderWidth: 1,
      margin: 10,
      borderRadius: 8,
    },
    buttonContainer: {
      flex: 2,
      flexDirection: 'row',
    },
    text: {
      padding: 10,
    },
    pageContainer:{
      marginBottom: 70,
    },
    input: {
      height: 40,
      width: '80%',
      borderWidth: 1,
      marginVertical: 16,
      margin: 10,
      padding: 8,
      borderRadius: 5,
    },
    searchContainer: {
      alignItems: 'center',
    },
});

export default Admin;