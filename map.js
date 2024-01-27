import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
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
    {id:1, title:'Hua Fong Kee Roasted Duck', coordinate: { latitude: 1.3406743389429967, longitude: 103.8465852246636}, color:'black' },
    {id:2, title:'Hua Fong Kee Roasted Duck', coordinate: { latitude: 1.3385479391033848, longitude: 103.84436796699089}, color:'black'},
    {id:3, title:"Lola's Cafe", coordinate: { latitude: 1.3616640960718158, longitude: 103.88595747204695}, color:'black' },
    {id:4, title:"Lola's Cafe", coordinate: { latitude: 1.3121194086456571, longitude: 103.7943036522657}, color:'black' },
    {id:5, title:"ION Orchard", coordinate: { latitude: 1.304129865050391, longitude: 103.83181539996907}, color:'blue' },
    {id:6, title:"Merlion Park", coordinate: { latitude: 1.2867557576145519, longitude: 103.85438618147725}, color:'blue' },
    {id:7, title:"Marina Bay Sands", coordinate: { latitude: 1.2840363784125377, longitude: 103.85908503851705}, color:'blue' },
    {id:8, title:"Gardens By The Bay", coordinate: { latitude: 1.28165104219858, longitude: 103.86363489293318}, color:'blue' },
    {id:9, title:"Takashimaya Shopping Centre", coordinate: { latitude: 1.3030932199254956, longitude: 103.83441471152987}, color:'blue' },
    {id:10, title:"Plaza Singapura", coordinate: { latitude: 1.3003252244596781, longitude: 103.84468653666859}, color:'blue' },
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

  const selectedMarkers1 = markers.filter(marker => [6,7,8].includes(marker.id))
  const selectedMarkers2 = markers.filter(marker => [5,9,10].includes(marker.id))

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
            pinColor={marker.color}
          />  
        ))}
        {selectedMarkers1.length >= 2 && (
          <MapViewDirections
            origin={{
              latitude: selectedMarkers1[0].coordinate.latitude,
              longitude: selectedMarkers1[0].coordinate.longitude,
            }}
            waypoints={selectedMarkers1
              .slice(1, selectedMarkers1.length - 1)
              .map(marker => ({
                latitude: marker.coordinate.latitude,
                longitude: marker.coordinate.longitude,
              }))}
            destination={{
              latitude: selectedMarkers1[selectedMarkers1.length - 1].coordinate.latitude,
              longitude: selectedMarkers1[selectedMarkers1.length - 1].coordinate.longitude,
            }}
            apikey={'AIzaSyD8UXKKGV2mUpaPJ-rOvkPiNFxAVlUn6OM'}
            mode= "WALKING"
            strokeWidth={3}
            strokeColor="blue"
          />
        )}
        {selectedMarkers2.length >= 2 && (
          <MapViewDirections
            origin={{
              latitude: selectedMarkers2[0].coordinate.latitude,
              longitude: selectedMarkers2[0].coordinate.longitude,
            }}
            waypoints={selectedMarkers2
              .slice(1, selectedMarkers2.length - 1)
              .map(marker => ({
                latitude: marker.coordinate.latitude,
                longitude: marker.coordinate.longitude,
              }))}
            destination={{
              latitude: selectedMarkers2[selectedMarkers2.length - 1].coordinate.latitude,
              longitude: selectedMarkers2[selectedMarkers2.length - 1].coordinate.longitude,
            }}
            apikey={'AIzaSyD8UXKKGV2mUpaPJ-rOvkPiNFxAVlUn6OM'}
            mode= "WALKING"
            strokeWidth={3}
            strokeColor="red"
          />
        )}
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
