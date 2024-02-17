import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Dimensions, Linking, TouchableOpacity, Image } from 'react-native';
import { Tooltip } from 'react-native-elements';
import { firebase } from './firebase';

const { width: screenWidth } = Dimensions.get('window');

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
      <View style={styles.horizontalGifContainer}>
        <Image
          source={require('./assets/walk.gif')}
          style={styles.gifImage}
          resizeMode="center"
        />
        <Image
          source={require('./assets/walk.gif')}
          style={styles.gifImage}
          resizeMode="center"
        />
        <Image
          source={require('./assets/walk.gif')}
          style={styles.gifImage}
          resizeMode="center"
        />
      </View>

      {isVerifiedInfluencer && (
        <View style={styles.verifyContainer}>
          <Button title="Verified Influencer" disabled />
        </View>
      )}

      {!isVerifiedInfluencer && (
        <TouchableOpacity style={styles.verifyButton} onPress={sendVerificationEmail}>
          <Text style={styles.verifyButtonText}>Verify as Influencer</Text>
        </TouchableOpacity>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.emailText}>
          {email} {isVerifiedInfluencer && '✓'}
        </Text>
        <Text style={styles.label}>Age:</Text>
        <Text style={styles.ageText}>{age}</Text>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.locationText}>{location}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateToPost}>
          <Text>Go to Posts</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.horizontalGifContainer}>
        <Image
          source={require('./assets/walk.gif')}
          style={styles.gifImage}
          resizeMode="center"
        />
        <Image
          source={require('./assets/walk.gif')}
          style={styles.gifImage}
          resizeMode="center"
        />
        <Image
          source={require('./assets/walk.gif')}
          style={styles.gifImage}
          resizeMode="center"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fcfafc',
  },
  gifImage: {
    flex: 1,
    alignItems: 'center',
    width: '50%',
    height: '50%',
    margin: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 0,
  },
  emailText: {
    fontSize: 24,
    color: 'black',
  },
  ageText: {
    fontSize: 24,
  },
  locationText: {
    fontSize: 24,
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: '#C1E1C1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#89CFF0',
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 30,
  },
  verifyButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#89CFF0',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: 'black',
  },
  horizontalGifContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
    marginTop: 50,
  },
});

export default UserInfoScreen;
