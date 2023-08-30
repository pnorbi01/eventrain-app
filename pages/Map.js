import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import CheckInternet from './CheckInternet';

const Map = ({route, navigation}) => {

    const { token, id, name, location, street } = route.params;
    const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState('');

    useFocusEffect(
        React.useCallback(() => {
          getLocationFromName(location + "," + street);
        }, [])
    );

    const getLocationFromName = async (name) => {
        await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(name)}&apiKey=2d884d75579c41d697d23a9d49ec1d3c`, {
            method: 'GET'
        }).then(response => {
            if(response.ok) {
                response.json()
                .then(data => {
                    setCoordinates({latitude: data.features[0].properties.lat, longitude: data.features[0].properties.lon})
                })
                .catch(e => {
                    setMessage('The location of the following event is invalid.');
                })
            }
            else {
                setMessage('No location data found.');
            }
        }).catch(e => {
            setMessage('Something went wrong. Check your internet connectivity.');
        })
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mapContainer}>
                <View style={styles.mapView}>
                    <Text style={{fontWeight: '700', fontSize: 30}}>Map</Text>
                </View>
            </View>
            {message !== '' && (
                <View style={styles.noteText}>
                    <Image source={require('../assets/images/note.png')} style={{ width: 35, height: 35 }} />
                    <Text style={{ textAlign: 'left', left: 5 }}>{message}</Text>
                </View>
            )}
            <MapView style={{ width: '90%', height: '60%', borderRadius: 20}}>
                <Marker coordinate={coordinates} title={location + ", " + street} />
            </MapView>
            {isConnected === false ? (
            <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
            ) : null }
        </SafeAreaView>
  );
};
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    mapContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 20
    },

    mapView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },

    noteText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        padding: 20,
        backgroundColor: '#F5CF87',
        borderRadius: 25,
        marginBottom: 10
    }
  
});

export default Map;