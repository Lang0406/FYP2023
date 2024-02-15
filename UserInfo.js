import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, Linking } from 'react-native';
import { Tooltip } from 'react-native-elements';
import { db, firebase } from './firebase'; 

const UserInfoScreen = ({ navigation, route }) => {
  const [profilePicture, setProfilePicture] = useState(require('./assets/pf.jpg'));
  const { email, age, location, role } = route.params.user;
  const userEmail = route.params.userEmail;
  const isVerifiedInfluencer = role === 'influencer';

  useEffect(() => {
    
    const fetchUserData = async () => {
      try {
        const userDoc = await db.collection('users').doc(userEmail).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData.profilePicture) {
            setProfilePicture({ uri: userData.profilePicture }); 
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, [userEmail]); 

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
      // Sign-out successful.
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }).catch((error) => {
      // An error happened.
      console.error('Error logging out:', error.message);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.infoContainer}>
        <Image source={profilePicture} style={styles.logo} />
        <Text>Email: 
          <Tooltip popover={<Text>Verified Influencer</Text>} width={200} height={40} >
            <Text style={styles.emailText}>{email} {isVerifiedInfluencer && '✓'}</Text>
          </Tooltip>
        </Text>
        <Text>Age: {age}</Text>
        <Text>Location: {location}</Text>
        <Button title="Map" onPress={navigateToMap} />
        <Button title="Forum" onPress={navigateToPost} />
        <Button title="Logout" onPress={handleLogout} />
      </View>

      <View style={styles.articleContainer}>
        <Text style={styles.articleTitle}>Top 10 Places You Must Go!</Text>
        <Image source={require('./assets/download.jpg')} style={styles.image} />
        <Text style={styles.articleTimeAuthor}>Published on January 2, 2023 by Jay</Text>
      </View>

      <View style={styles.articleContainer}>
        <Text style={styles.articleTitle}>Only True Singaporeans Know Where to Go!</Text>
        <Image source={require('./assets/download2.jpg')} style={styles.image} />
        <Text style={styles.articleTimeAuthor}>Published on January 5, 2023 by Lang</Text>
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
  articleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  articleTimeAuthor: {
    color: '#888',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  verifyContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  verifyText: {
    fontSize: 16,
    color: 'green',
  },
  emailText: {
    fontSize: 16,
    color: 'black',
  },
});

export default UserInfoScreen;
