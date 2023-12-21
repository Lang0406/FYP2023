
import React from 'react';
import { View, Text, Button } from 'react-native';

const UserInfoScreen = ({ navigation, route }) => {
  const { email, age, location } = route.params.user;

  const navigateToMap = () => {
    navigation.navigate('Map');
  };

  const navigateToPost = () => {
    navigation.navigate('Post')
  }

  return (
    <View>
      <Text>Email: {email}</Text>
      <Text>Age: {age}</Text>
      <Text>Location: {location}</Text>
      <Button title="Map" onPress={navigateToMap} />
      <Button title="Forum" onPress={navigateToPost} />
    </View>
  );
};

export default UserInfoScreen;

