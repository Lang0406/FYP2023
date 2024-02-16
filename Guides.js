import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Modal, Button, Alert } from 'react-native';
import { db } from './firebase';
import { useNavigation, useRoute } from '@react-navigation/native';

const Guides = ({ role, email }) => {
  const route = useRoute();
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newGuidesData, setNewGuidesData] = useState({
    title: '',
    desc: ''
  });
  const [selectedGuides, setSelectedGuides] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGuidesFromFirebase = async () => {
      try {
        const guidesSnapshot = await db.collection('guides').get();
        const guidesData = guidesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGuides(guidesData);
      } catch (error) {
        console.error('Error fetching guides:', error);
      }
    };

    fetchGuidesFromFirebase();
  }, []);

  const handleAddGuides = () => {
    setModalVisible(true);
  };

  const handleEditGuides = (guides) => {
    setSelectedGuides(guides);
    setNewGuidesData({
      title: guides.title,
      desc: guides.desc
    });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedGuides(null);
    setModalVisible(false);
    setNewGuidesData({
      title: '',
      desc: ''
    });
  };

  const handleGuidesSubmission = async () => {
    try {
      if (selectedGuides) {
       
        await db.collection('guides').doc(selectedGuides.id).delete();
      }
     
      const newGuides = await db.collection('guides').add(newGuidesData);
     
      const guidesSnapshot = await db.collection('guides').get();
      const guidesData = guidesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGuides(guidesData);
     
      handleModalClose();
    } catch (error) {
      console.error('Error adding/editing guide:', error);
    }
  };

  const handleDeleteGuides = (guidesId) => {
    Alert.alert(
      'Delete Guide',
      'Are you sure you want to delete this guide?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await db.collection('guides').doc(guidesId).delete();
              
              const updatedGuides = guides.filter(guides => guides.id !== guidesId);
              setGuides(updatedGuides);
            } catch (error) {
              console.error('Error deleting guide:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for guide"
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />
      {role === 'admin' && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddGuides}>
          <Text style={styles.addButtonText}>Add Guides</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={guides.filter(marker => marker.title.toLowerCase().includes(searchTerm.toLowerCase()))}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.guidesContainer}>
            <Text style={styles.guidesTitle}>Title: {item.title}</Text>
            <Text style={styles.guidesDescription}>Description: {item.desc}</Text>
            <View style={styles.guidesButtonsContainer}>
              {role === 'admin' && (
                <>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditGuides(item)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteGuides(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <TextInput
            style={styles.modalInput}
            placeholder="Title"
            value={newGuidesData.title}
            onChangeText={(text) => setNewGuidesData({ ...newGuidesData, title: text })}
          />
          <TextInput
            style={[styles.modalInput, { height: 150, textAlignVertical: 'top' }]}
            multiline={true}
            placeholder="Description"
            value={newGuidesData.desc}
            onChangeText={(text) => setNewGuidesData({ ...newGuidesData, desc: text })}
          />
          <View style={styles.modalButtons}>
            <Button title="Submit" onPress={handleGuidesSubmission} />
            <Button title="Cancel" onPress={handleModalClose} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  guidesContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  guidesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  guidesDescription: {
    fontSize: 16,
  },
  guidesButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalInput: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default Guides;
