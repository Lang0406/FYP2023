import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Linking } from 'react-native';
import { Tooltip } from 'react-native-elements';
import { firebase, db } from './firebase';

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
    const body = 'I want to verify as an influencer. I will like to prove my identity with following material.';
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
        <Text>Email: 
          <Tooltip popover={<Text>Verified Influencer</Text>} width={200} height={40} >
            <Text style={styles.emailText}>{email} {isVerifiedInfluencer && '✓'}</Text>
          </Tooltip>
        </Text>
        <Text>Age: {age}</Text>
        <Text>Location: {location}</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>

      <View style={styles.verifyContainer}>
        <Button title="Verify as Influencer" onPress={sendVerificationEmail} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 16,
    color: 'black',
  },
  verifyContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default UserInfoScreen;
