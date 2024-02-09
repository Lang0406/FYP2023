import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { db } from './firebase'; 

const Map = () => {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    tilt: 45,
  });
  const [searchText, setSearchText] = useState('');
  const [markers, setMarkers] = useState([]);

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

    const fetchMarkersFromFirebase = async () => {
      try {
        const markersSnapshot = await db.collection('markers').get();
        const markersData = markersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMarkers(markersData);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };

    getLocationAsync();
    fetchMarkersFromFirebase();
  }, []);

  const handleSearch = () => {
    console.log('Searching for:', searchText);
    
  };

  const validMarkers = markers.filter(marker => marker.coordinate && marker.coordinate.latitude && marker.coordinate.longitude);

  const groupByRoute = (markers) => {
    const groupedMarkers = {};
    markers.forEach(marker => {
      const route = marker.route || 'noRoute';
      if (!groupedMarkers[route]) {
        groupedMarkers[route] = [];
      }
      groupedMarkers[route].push(marker);
    });
    return groupedMarkers;
  };

  const groupedMarkers = groupByRoute(validMarkers);

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
          coordinate={{
            latitude: parseFloat(region.latitude),
            longitude: parseFloat(region.longitude),
          }}
          title="Current Location"
        />

        {Object.entries(groupedMarkers).map(([route, group], index) => (
          <React.Fragment key={index}>
            {group.map(marker => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: parseFloat(marker.coordinate.latitude),
                  longitude: parseFloat(marker.coordinate.longitude),
                }}
                title={marker.title}
                pinColor={marker.color}
              />
            ))}
            {route !== 'noRoute' && group.length >= 2 && (
              <MapViewDirections
                origin={{
                  latitude: parseFloat(group[0].coordinate.latitude),
                  longitude: parseFloat(group[0].coordinate.longitude),
                }}
                waypoints={group
                  .slice(1, group.length - 1)
                  .map(marker => ({
                    latitude: parseFloat(marker.coordinate.latitude),
                    longitude: parseFloat(marker.coordinate.longitude),
                  }))}
                destination={{
                  latitude: parseFloat(group[group.length - 1].coordinate.latitude),
                  longitude: parseFloat(group[group.length - 1].coordinate.longitude),
                }}
                apikey={'AIzaSyD8UXKKGV2mUpaPJ-rOvkPiNFxAVlUn6OM'}
                mode="WALKING"
                strokeWidth={3}
                strokeColor={`#${Math.floor(Math.random() * 16777215).toString(16)}`} 
              />
            )}
          </React.Fragment>
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
