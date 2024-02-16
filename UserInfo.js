import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Tooltip } from 'react-native-elements';
import { firebase } from './firebase';

const UserInfoScreen = ({ navigation, route }) => {
  const { email, age, location, role } = route.params.user;
  const userEmail = route.params.userEmail;
  const isVerifiedInfluencer = role === 'influencer';

  const navigateToMap = () => {
    navigation.navigate('Map');
  };

  const navigateToPost = () => {
    navigation.navigate('Forum', { userEmail: userEmail });
  };

  const sendVerificationEmail = () => {
    const recipientEmail = 'simfyp2023@gmail.com';
    const subject = 'Influencer Verification Request';
    const body = 'I want to verify as an influencer. I will like to prove my identity with the following material.';
    const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    Linking.openURL(mailtoUrl).catch((err) => console.error('An error occurred', err));
  };

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }).catch((error) => {
      console.error('Error logging out:', error.message);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.emailText}>
          {email} {isVerifiedInfluencer && '✓'}
        </Text>
        <Text style={styles.label}>Age:</Text>
        <Text>{age}</Text>
        <Text style={styles.label}>Location:</Text>
        <Text>{location}</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToPost}>
          <Text>Go to Posts</Text>
        </TouchableOpacity>
        <Button title="Logout" onPress={handleLogout} />
      </View>

      {isVerifiedInfluencer && (
        <View style={styles.verifyContainer}>
          <Button title="Verified Influencer" disabled />
        </View>
      )}

      {!isVerifiedInfluencer && (
        <View style={styles.verifyContainer}>
          <Button title="Verify as Influencer" onPress={sendVerificationEmail} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyContainer: {
    marginTop: 10,
  },
});

export default UserInfoScreen;
