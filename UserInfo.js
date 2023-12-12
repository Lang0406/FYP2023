import React from 'react';
import { View, Text } from 'react-native';

export default function UserInfoScreen({ route }) {
  const { email, age, location } = route.params.user;

  return (
    <View>
      <Text>Email: {email}</Text>
      <Text>Age: {age}</Text>
      <Text>Location: {location}</Text>
    </View>
  );
}
