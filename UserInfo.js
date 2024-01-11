import React from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';

const UserInfoScreen = ({ navigation, route }) => {
  const { email, age, location } = route.params.user;
  const userEmail = route.params.userEmail;


  const navigateToMap = () => {
    navigation.navigate('Map');
  };

  const navigateToPost = () => {
    navigation.navigate('Post', { userEmail: userEmail });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.infoContainer}>
        <Image source={require('./assets/pf.jpg')} style={styles.logo} />
        <Text>Email: {email}</Text>
        <Text>Age: {age}</Text>
        <Text>Location: {location}</Text>
        <Button title="Map" onPress={navigateToMap} />
        <Button title="Forum" onPress={navigateToPost} />
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
        <Text style={styles.verifyText}>Verify as Influencer</Text>
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
});

export default UserInfoScreen;
