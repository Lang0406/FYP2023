import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from './firebase';

const Comment = ({ route }) => {
  const { post } = route.params;
  const [comments, setComments] = useState([]);
  const [commentDescription, setCommentDescription] = useState('');
  const [email, setUserEmail] = useState(route.params?.email || '');
  const [role, setUserRole] = useState(route.params?.role || '');

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

  useEffect(() => {
    fetchComments();
  }, [post]);

  useEffect(() => {
    console.log('User Email on Post Page:', email);
  }, [email]);

  useEffect(() => {
    console.log('User Role on Post Page:', role);
  }, [role]);

  const handlePostComment = async () => {
    try {
      if (!commentDescription) {
        console.error('Comment description cannot be empty.');
        return;
      }
  
      const timestamp = new Date().getTime();
      const randomNumber = Math.floor(Math.random() * 10000);
      const commentId = `${timestamp}-${randomNumber}`;
  
      const isInfluencer = role === 'influencer'; // Set isInfluencer flag based on role

      await db.collection('comments').doc(commentId).set({
        postId: post.postId,
        description: commentDescription,
        time: new Date().toLocaleString(),
        userEmail: email, // Use userEmail state directly
        isInfluencer: isInfluencer, // Add isInfluencer flag to the comment
      });
  
      setCommentDescription('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const commentRef = db.collection('comments').doc(commentId);
      const commentDoc = await commentRef.get();

      if (!commentDoc.exists) {
        console.error('Comment does not exist.');
        return;
      }

      const commentData = commentDoc.data();

  
      if (commentData.userEmail === email || role === 'admin') {
        await commentRef.delete();
        fetchComments();
      } else {
        Alert.alert('Permission Denied', 'You do not have permission to delete this comment.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <View>
      <View style={styles.postContainer}>
        {/* Display post details */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{post.description}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text>Date: {post.time}</Text>
          <Text>User Email: {post.userEmail}</Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Add a comment..."
        value={commentDescription}
        onChangeText={(text) => setCommentDescription(text)}
      />
      <Button title="Post Comment" onPress={handlePostComment} />

      {comments.length > 0 ? (
        <View>
          {comments.map((comment, index) => (
            <View key={index} style={styles.commentContainer}>
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{comment.description}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text>Date: {comment.time}</Text>
                <Text>User Email: {comment.userEmail} {comment.isInfluencer ? '✓' : ''}</Text>
                {(comment.userEmail === email || role === 'admin') && (
                  <Button title="Delete" onPress={() => handleDeleteComment(comment.id)} />
                )}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
});

export default Comment;
