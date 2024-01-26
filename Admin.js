import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, FlatList } from 'react-native';
import { db } from './firebase';

const Admin = () => {
    const [userAccounts, setUserAccounts] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
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
      
      const renderUserItem = ({ item }) => (
        <View>
          <TouchableOpacity
            style={styles.container}
            //onPress={() => handlePostClick(item)}
          >
            <View>
              <Text style={styles.text}>Email: {item.email}</Text>
              <Text style={styles.text}>Gender: {item.gender}</Text>
              <Text style={styles.text}>Age: {item.age}</Text>
              <Text style={styles.text}>Location: {item.location}</Text>
            </View>
          </TouchableOpacity>
        </View>

      );  

    return (
        <View>
            <TouchableOpacity style={styles.button}>
              <Text>Create New User</Text>
            </TouchableOpacity>
            <FlatList
                data={userAccounts}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.email}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    button:{
      width: '50%',
      padding: 16,
      borderBottomWidth: 1,
      borderRightWidth: 1,
      alignItems: 'center',
    },
    container: {
      padding: 16,
      borderWidth: 1,
      margin: 10,
      borderRadius: 8,
    },
    text: {
      padding: 10,
    },
});

export default Admin;