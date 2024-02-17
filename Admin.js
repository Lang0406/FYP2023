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
            <TouchableOpacity style={styles.buttonEdit} onPress={() => handleUserEdit(item)}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSuspend} onPress={() => handleUserSuspend(item)}>
              <Text> {item.disabled ? 'Unsuspend' : 'Suspend'} </Text>
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
      <TouchableOpacity style={styles.topButton} onPress={handleUserCreate}>
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
};

const styles = StyleSheet.create({
  topButton: {
    width: '50%',
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: '#add8e6', // Light Blue
  },
  buttonEdit: {
    borderWidth: 0.5,
    padding: 16,
    alignItems: 'center',
    width: '50%',
    borderColor: 'darkslateblue',
    backgroundColor: '#98fb98', // Pale Green
  },
  buttonSuspend: {
    borderWidth: 0.5,
    padding: 16,
    alignItems: 'center',
    width: '50%',
    borderColor: 'red',
    backgroundColor: '#ffb6c1', // Light Pink
  },
  container: {
    padding: 16,
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
    backgroundColor: '#f0f8ff', // Alice Blue
  },
  buttonContainer: {
    flex: 2,
    flexDirection: 'row',
  },
  text: {
    padding: 10,
    color: 'darkslateblue',
  },
  textDisabled: {
    padding: 10,
    fontStyle: 'italic',
    color: 'red',
  },
  pageContainer: {
    marginBottom: 70,
    backgroundColor: '#f0f8ff', // Alice Blue
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
