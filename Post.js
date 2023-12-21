import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from './firebase';
import { useNavigation } from '@react-navigation/native';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await db.collection('posts').get();
        const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (post) => {
    navigation.navigate('Comment', { post }); // Pass the entire post object
  };

  return (
    <View>
      {posts.map((post, index) => (
        <TouchableOpacity
          key={index}
          style={styles.postContainer}
          onPress={() => handlePostClick(post)}
        >
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{post.description}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text>Date: {post.time}</Text>
            <Text>User Email: {post.userEmail}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Post;
