import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList } from 'react-native';
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
  const [searchLocation, setSearchLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null); // Track current location separately

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
        setCurrentLocation({ latitude, longitude }); // Set current location separately
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

  const handleSearch = async () => {
    try {
      const apiKey = 'AIzaSyD8UXKKGV2mUpaPJ-rOvkPiNFxAVlUn6OM'; 
      const encodedSearchText = encodeURIComponent(searchText);
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedSearchText}&key=${apiKey}`);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setSearchLocation({ latitude: lat, longitude: lng });
        setRegion({
          ...region,
          latitude: lat,
          longitude: lng,
        });
      } else {
        console.error('No results found');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  };

  const handleMarkerSelect = (markerId) => {
    const marker = markers.find(m => m.id === markerId);
    if (marker) {
      setSelectedMarker(marker);
      setRegion({
        ...region,
        latitude: parseFloat(marker.coordinate.latitude),
        longitude: parseFloat(marker.coordinate.longitude),
      });
      setShowPicker(false);
      setSearchLocation(null); //
  
    
      setTimeout(() => {
        handleMapPress(); 
        setTimeout(handleMapPress, 1000);
      }, 1000); 
    }
  };

  const handleTextInputFocus = () => {
    setSelectedMarker(null); // Clear selected marker when the text input is focused
    setShowPicker(true); // Show marker picker when the text input is focused
  };

  const clearSearchLocation = () => {
    setSearchLocation(null); // Clear search location when triggered
  };

  const handleMapPress = () => {
    setShowPicker(true); // Show marker picker when the map is pressed
    setSelectedMarker(null); // Clear selected marker
  };

  const renderRoutes = () => {
    const groupedMarkers = groupMarkersByRoute();
    const routes = Object.entries(groupedMarkers);
  
    return routes.map(([route, group], index) => {
      if (route === 'noRoute' || selectedMarker) return null;
  
      const origin = group[0].coordinate;
      const destination = group[group.length - 1].coordinate;
      const waypoints = group.slice(1, -1).map(marker => marker.coordinate);
  
      return (
        <MapViewDirections
          key={index}
          origin={origin}
          waypoints={waypoints}
          destination={destination}
          apikey={'AIzaSyD8UXKKGV2mUpaPJ-rOvkPiNFxAVlUn6OM'}
          mode="WALKING"
          strokeWidth={3}
          strokeColor="blue" 
        />
      );
    });
  };
  

  const groupMarkersByRoute = () => {
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

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        region={region}
        onPress={handleMapPress} // Add onPress event handler for the map
      >
        {/* Render markers */}
        {markers.map(marker => (
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

        {/* Render directions for search location */}
        {searchLocation && (
          <MapViewDirections
            origin={{
              latitude: parseFloat(currentLocation.latitude),
              longitude: parseFloat(currentLocation.longitude),
            }}
            destination={{
              latitude: parseFloat(searchLocation.latitude),
              longitude: parseFloat(searchLocation.longitude),
            }}
            apikey={'AIzaSyD8UXKKGV2mUpaPJ-rOvkPiNFxAVlUn6OM'}
            mode="WALKING"
            strokeWidth={3}
            strokeColor={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
          />
        )}

        {/* Render routes */}
        {renderRoutes()}

        {/* Always render the current location marker */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: parseFloat(currentLocation.latitude),
              longitude: parseFloat(currentLocation.longitude),
            }}
            title="Current Location"
          />
        )}
        
        {/* Render search location marker */}
        {searchLocation && (
          <Marker
            coordinate={{
              latitude: parseFloat(searchLocation.latitude),
              longitude: parseFloat(searchLocation.longitude),
            }}
            title="Search Location"
          />
        )}
      </MapView>

      {/* Combined search input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a location or select a marker..."
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          onSubmitEditing={handleSearch}
          onFocus={handleTextInputFocus}
        />
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowPicker(!showPicker)}>
          <Text>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Marker picker */}
      {showPicker && (
        <FlatList
          style={styles.markerPicker}
          data={markers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleMarkerSelect(item.id)}>
              <Text style={styles.markerPickerItem}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Clear search location button */}
      {searchLocation && (
        <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearchLocation}>
          <Text style={styles.clearSearchButtonText}>Clear Search Location</Text>
        </TouchableOpacity>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  markerPicker: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    maxHeight: 150,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    zIndex: 1,
  },
  markerPickerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
  },
  clearSearchButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  clearSearchButtonText: {
    color: 'white',
  },
});

export default Map;
