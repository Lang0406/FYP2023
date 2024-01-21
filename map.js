import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const Map = () => {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    tilt : 45,
  });
  const [searchText, setSearchText] = useState('');

  const markers = [
    {id:1, title:'Hua Fong Kee Roasted Duck', coordinate: { latitude: 1.3406743389429967, longitude: 103.8465852246636} },
    {id:2, title:'Hua Fong Kee Roasted Duck', coordinate: { latitude: 1.3385479391033848, longitude: 103.84436796699089} },
    {id:3, title:"Lola's Cafe", coordinate: { latitude: 1.3616640960718158, longitude: 103.88595747204695} },
    {id:4, title:"Lola's Cafe", coordinate: { latitude: 1.3121194086456571, longitude: 103.7943036522657} },
  ]

  useEffect(() => {
    const getLocationAsync = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        console.log('Location:', location);

        const { latitude, longitude } = location.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      } catch (error) {
        console.error(error);
      }
    };

    getLocationAsync();
  }, []);

  const handleSearch = () => {
    console.log('Searching for:', searchText);
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a location"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          onSubmitEditing={handleSearch}
        />
      </View>

      <MapView style={styles.map} region={region}>
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title="Current Location"
        />
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
          />  
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, 
  },
  searchBar: {
    height: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default Map;
