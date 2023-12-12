
import React from 'react';
import { View, Text, Button } from 'react-native';

const UserInfoScreen = ({ navigation, route }) => {
  const { email, age, location } = route.params.user;

  const navigateToMap = () => {
    // Replace 'Map' with the correct screen name if it's different
    navigation.navigate('Map');
  };

  return (
    <View>
      <Text>Email: {email}</Text>
      <Text>Age: {age}</Text>
      <Text>Location: {location}</Text>
      <Button title="Go to Map" onPress={navigateToMap} />
    </View>
  );
};

export default UserInfoScreen;

