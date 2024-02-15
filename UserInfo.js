import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Tooltip } from 'react-native-elements';
import { db, firebase } from './firebase';

const UserInfoScreen = ({ navigation, route }) => {
  const [profilePicture, setProfilePicture] = useState(null); // Changed default to null
  const [showProfileImages, setShowProfileImages] = useState(false);
  const { email, age, location, role } = route.params.user;
  const userEmail = route.params.userEmail;
  const isVerifiedInfluencer = role === 'influencer';

  // Manually import the profile images
  const profileImages = [
    require('./assets/1.jpg'),
    require('./assets/2.jpg'),
    require('./assets/3.jpg'),
    require('./assets/4.jpg'),
    require('./assets/5.jpg'),
    require('./assets/6.jpg'),
    require('./assets/7.jpg'),
    require('./assets/8.jpg'),
    require('./assets/9.jpg'),
    require('./assets/10.jpg'),
    require('./assets/11.jpg'),
    require('./assets/12.jpg'),
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await db.collection('users').doc(userEmail).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData.profilePicture) {
            setProfilePicture(userData.profilePicture);
          } else {
            setProfilePicture(require('./assets/pf.jpg')); // Set default profile picture
          }
        } else {
          console.log('User document does not exist');
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
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }).catch((error) => {
      console.error('Error logging out:', error.message);
    });
  };

  const handleProfilePictureSelect = (imageURL) => {
    if (imageURL) {
      setProfilePicture(imageURL);
      setShowProfileImages(false);
      // Update profile picture URL in database
      db.collection('users').doc(userEmail).set({ profilePicture: imageURL }, { merge: true })
        .then(() => {
          console.log('Profile picture updated successfully');
        })
        .catch((error) => {
          console.error('Error updating profile picture:', error.message);
        });
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.infoContainer}>
        <Image source={profilePicture ? { uri: profilePicture } : require('./assets/pf.jpg')} style={styles.logo} />
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

      {showProfileImages && (
        <View style={styles.profileImagesContainer}>
          {profileImages.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => handleProfilePictureSelect(image.uri)}>
              <Image source={image} style={styles.profileImage} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Button title="Select Profile Picture" onPress={() => setShowProfileImages(true)} />

      {/* Add back the "Verify as Influencer" button */}
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
  profileImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    margin: 5,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 16,
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
