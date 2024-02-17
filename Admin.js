import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';
import { db } from './firebase';
import { useNavigation } from '@react-navigation/native';

const Admin = ({ role }) => {
  const [searchInput, setSearchInput] = useState('');
  const [userAccounts, setUserAccounts] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [refresh, setRefresh] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    setRoleFilter(role === 'accountmanager' ? 'admin' : 'user,influencer');
  }, [roleFilter]);

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
  }, [refresh]);

  const handleUserCreate = () => {
    const item = {
      id: null,
    };
    navigation.navigate('AdminUserAccount', { item, role });
  };

  const handleUserEdit = (item) => {
    navigation.navigate('AdminUserAccount', { item, role });
  };

  const handleUserSuspend = async (item) => {
    const disabled = !item.disabled;
    try {
      await db.collection('users').doc(item.id).update({
        disabled,
      });
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  const renderUserItem = ({ item }) => (
    item.email.toUpperCase().includes(searchInput.toUpperCase()) && roleFilter.includes(item.role) ? (
      <View style={styles.container}>
        <View>
          <Text style={styles.text}>Email: {item.email}</Text>
          <Text style={styles.text}>Gender: {item.gender}</Text>
          <Text style={styles.text}>Age: {item.age}</Text>
          <Text style={styles.text}>Location: {item.location}</Text>
          <Text style={styles.text}>Role: {item.role}</Text>
          {item.disabled ? (
            <Text style={styles.textDisabled}>Account disabled</Text>
          ) : (
            <></>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleUserEdit(item)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.susButton} onPress={() => handleUserSuspend(item)}>
              <Text style={styles.buttonText}> {item.disabled ? 'Unsuspend' : 'Suspend'} </Text>
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for user email..."
          onChangeText={(text) => setSearchInput(text)}
          value={searchInput}
        />
      </View>
      <TouchableOpacity style={styles.createButton} onPress={handleUserCreate}>
        <Text style={styles.createButtonText}>Create New User</Text>
      </TouchableOpacity>
      <FlatList
        data={userAccounts}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.email}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  createButton: {
    width: '80%', // Adjust the width as needed
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  susButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  editButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
    marginHorizontal: 10,
  },
  input: {
    height: 40,
    width: '80%', // Adjust the width as needed
    borderWidth: 1,
    marginVertical: 16,
    margin: 10,
    padding: 8,
    borderRadius: 5,
  },
  button: {
    borderWidth: 0.5,
    padding: 16,
    alignItems: 'center',
    width: '50%',
    backgroundColor: '#3498db', // Dodger Blue
    borderRadius: 10,
    marginBottom: 10,
  },
  container: {
    padding: 16,
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
    backgroundColor: '#f0f8ff', // Alice Blue
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  text: {
    padding: 10,
    color: '#696969', // Dim Gray
  },
  textDisabled: {
    padding: 10,
    fontStyle: 'italic',
    color: 'red',
  },
  pageContainer: {
    marginBottom: 70,
    backgroundColor: '#f0f8ff', // Alice Blue
    paddingHorizontal: 10,
  },
  searchContainer: {
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Admin;
