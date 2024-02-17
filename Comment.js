import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { db } from './firebase';
import { useNavigation } from '@react-navigation/native';

const Comment = ({ route }) => {
  const navigation = useNavigation();
  const { post } = route.params;
  const [comments, setComments] = useState([]);
  const [commentDescription, setCommentDescription] = useState('');
  const [email, setUserEmail] = useState(route.params?.email || '');
  const [role, setUserRole] = useState(route.params?.role || '');

  const colorPool = ['#FFD700', '#87CEEB', '#98FB98', '#FFA07A', '#FF6347', '#FF69B4','#BF00FF','#FFDB58','#40E0D0'];

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
  
      const isInfluencer = role === 'influencer'; 

      await db.collection('comments').doc(commentId).set({
        postId: post.postId,
        description: commentDescription,
        time: new Date().toLocaleString(),
        userEmail: email, 
        isInfluencer: isInfluencer, 
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

  const renderCommentItem = ({ item, index }) => {
    const commentColor = colorPool[index % colorPool.length];

    return (
      <TouchableOpacity
        style={[styles.commentContainer, { borderColor: commentColor }]}
      >
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text>Date: {item.time}</Text>
          <Text>User Email: {item.userEmail} {item.isInfluencer ? '✓' : ''}</Text>
          {(item.userEmail === email || role === 'admin') && (
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
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
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back to forum</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.postButton}
          onPress={handlePostComment}>
            <Text style={styles.backButtonText}>Post Comment</Text>
        </TouchableOpacity>
      </View>

      {comments.length > 0 ? (
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No comments yet. Be the first to comment!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    borderWidth: 5,
    borderColor: '#baffc9',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  commentContainer: {
    borderWidth: 5,
    borderRadius: 18,
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
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    borderRadius:8,

    padding: 8,
    marginHorizontal:40,
  },
  deleteButtonText: {
    color: 'black',
    fontSize: 16,
  },
  deleteButtonContainer: {
    marginLeft: 'auto', // Push the delete button to the right
    marginTop: -10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    color:'#3498db'
  },
  backButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginLeft:40,
  },
  postButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginRight:40,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Comment;
