import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db } from './firebase';

const Comment = ({ route }) => {
  const { post } = route.params;
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!post || !post.postId) {
          console.error('Invalid post object or missing postId.');
          return;
        }

        const commentsRef = db.collection('comments');
        const querySnapshot = await commentsRef.where('postId', '==', post.postId).get();

        const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [post]);

  return (
    <View>
      <View style={styles.postContainer}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{post.description}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text>Date: {post.time}</Text>
          <Text>User Email: {post.userEmail}</Text>
        </View>
      </View>

      {comments.length > 0 ? (
        <View>
          {comments.map((comment, index) => (
            <View key={index} style={styles.commentContainer}>
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{comment.description}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text>Date: {comment.time}</Text>
                <Text>User Email: {comment.userEmail}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text>No comments yet. Be the first to comment!</Text>
      )}
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
  commentContainer: {
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
});

export default Comment;
