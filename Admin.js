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
        <TouchableOpacity
          style={styles.container}
          //onPress={() => handlePostClick(item)}
        >
          <View style={styles.container}>
            <Text style={styles.container}>Email: {item.email}</Text>
            <Text style={styles.container}>Gender: {item.gender}</Text>
            <Text style={styles.container}>Age: {item.age}</Text>
            <Text style={styles.container}>Location: {item.location}</Text>
          </View>
        </TouchableOpacity>
      );  

    return (
        <View>
            <FlatList
                data={userAccounts}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.email}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    userContainer: {

    },
});

export default Admin;