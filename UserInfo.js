import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

const UserInfoScreen = ({ navigation, route }) => {
  const { email, age, location } = route.params.user;

  const navigateToMap = () => {
    navigation.navigate('Map');
  };

  const navigateToPost = () => {
    navigation.navigate('Post');
  };

  return (
    <View style={styles.container}>
     
      <Image source={require('./assets/pf.jpg')} style={styles.logo} />
      <Text>Email: {email}</Text>
      <Text>Age: {age}</Text>
      <Text>Location: {location}</Text>
      <Button title="Map" onPress={navigateToMap} />
      <Button title="Forum" onPress={navigateToPost} />

      <Text style={styles.title}>Top 10 Places You Must Go!</Text>
      <Image source={require('./assets/download.jpg')} style={styles.image} />

      <Text style={styles.title}>Only True singaporean knows where to go!</Text>
      <Image source={require('./assets/download2.jpg')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 16,
  },
});

export default UserInfoScreen;