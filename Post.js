import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, FlatList } from 'react-native';
import { db } from './firebase';
import { useNavigation, useRoute } from '@react-navigation/native';

const Post = () => {
  const route = useRoute();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPostModalVisible, setNewPostModalVisible] = useState(false);
  const [newPostDescription, setNewPostDescription] = useState('');
  const [userEmail, setUserEmail] = useState(route.params?.userEmail || '');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // Number of posts to display per page
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await db.collection('posts').get();
        const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    setUserEmail(userEmail);
  }, [userEmail]);

  const handlePostClick = (post) => {
    navigation.navigate('Comment', { post });
  };

  const handleNewPost = () => {
    setNewPostModalVisible(true);
  };

  const handleAddPost = async () => {
    try {
      if (!userEmail) {
        console.error('User email is not available');
        return;
      }

      const timestamp = new Date().getTime();
      const randomNumber = Math.floor(Math.random() * 10000);
      const postId = `${timestamp}-${randomNumber}`;

      const newPost = {
        description: newPostDescription,
        time: new Date().toLocaleString(),
        userEmail: userEmail,
        postId: postId,
      };

      await db.collection('posts').doc(postId).set(newPost);

      const querySnapshot = await db.collection('posts').get();
      const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);

      setNewPostDescription('');
      setNewPostModalVisible(false);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() => handlePostClick(item)}
    >
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text>Date: {item.time}</Text>
        <Text style={styles.userEmail}>User Email: {item.userEmail}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for post"
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />
      <FlatList
        data={currentPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={handlePrevPage}
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationButtonText}>Previous Page</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumberText}>Page {currentPage}</Text>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={handleNextPage}
          disabled={indexOfLastPost >= filteredPosts.length}
        >
          <Text style={styles.paginationButtonText}>Next Page</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.newPostButton} onPress={handleNewPost}>
        <Text style={styles.newPostButtonText}>New Post</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={newPostModalVisible}
        onRequestClose={() => setNewPostModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Post</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter post description"
              onChangeText={(text) => setNewPostDescription(text)}
              value={newPostDescription}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddPost}>
              <Text style={styles.modalButtonText}>Add Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setNewPostModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  descriptionContainer: {
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  userEmail: {
    marginTop: 5,
  },
  newPostButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  newPostButtonText: {
    color: '#fff',
    fontSize: 18,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',

    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Post;
