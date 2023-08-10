import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';


const InvitationDetail = ({route, navigation}) => {
    
    const { token, name, type, status, location, street, start, close, id } = route.params;
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [isButtonVisible, setIsButtonVisible] = useState(false); 
    const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });

    useFocusEffect(
        React.useCallback(() => {
          invitationDetail();
          setNotificationToRead();
          getLocationFromName(location + "," + street);
          console.log("InvDetail");
        }, [])
    );

    const handlePress = (value) => {
        const updateStatus = async () => {
            await fetch('http://192.168.0.17/EventRain/api/events/update-status.php?eventId=' + id + '&status=' + value, {
            method: 'PUT',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Token': token
            },
            body: JSON.stringify()
            }).then(response => {
            if(response.ok) {
                response.json().then((data)=>
                {
                    setMessage('Status has been changed successfully')
                })
                .catch(err => console.log(err))
            }
            else {
                setMessage('Something went wrong while updating your status')
            }
            })
            .catch(err => console.log(err))
        }
        updateStatus();
        setIsButtonVisible(false);
        showUpdatedStatusAlert();
    };

    const getLocationFromName = async (name) => {
        await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(name)}&apiKey=2d884d75579c41d697d23a9d49ec1d3c`, {
            method: 'GET'
        }).then(response => {
            if(response.ok) {
                response.json()
                .then(data => {
                    setCoordinates({latitude: data.features[0].properties.lat, longitude: data.features[0].properties.lon})
                    console.log(coordinates)
                })
            }
        }).catch(e => {
            console.error('Error fetching location from name:', e);
        })
    };

    const showUpdatedStatusAlert = () => {
        Alert.alert('Event Status', 'Your status has been changed, thank you!',
            [
                {
                    text: 'OK',
                    onPress: () => { invitationDetail() }
                }
            ]
        )
    }

    const invitationDetail = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/invitation-detail.php?eventId=' + id, {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Token': token
         }
         }).then(response => {
           if(response.ok) {
             response.json()
             .then(data => {
               setData(data)
               setIsButtonVisible(data[0].status === 'tentative')
             })
             .catch(err => console.log(err))
           }
           else {
             setMessage('Something went wrong while listing the details of the event')
           }
         })
         .catch(err => console.log(err))
    }

    const setNotificationToRead = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/set-notification-to-read.php?eventId=' + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Token': token
        },
        body: JSON.stringify()
        }).then(response => {
        if(response.ok) {
            response.json().then((data)=>
            {
                setMessage(data.message)
            })
            .catch(err => console.log(err))
        }
        else {
            setMessage('Something went wrong while updating the state at the event')
        }
        })
        .catch(err => console.log(err))
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.invitationTitle}>
                <Text style={{fontWeight: '200'}}>EVENT INVITATION DETAIL</Text>
            </View>
            <View style={styles.accountDetails}>
                <View style={styles.datas}>
                    <Text style={styles.data}>Name</Text>
                    <Text style={styles.value}>{name}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Type</Text>
                    <Text style={styles.value}>{type}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Status</Text>
                    <Text style={styles.value}>{status}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Location</Text>
                    <Text style={styles.value}>{location}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Street</Text>
                    <Text style={styles.value}>{street}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>My Station</Text>
                    {data.length > 0 && <Text style={styles.value}>{data[0].status}</Text>}
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Starts At</Text>
                    <Text style={styles.value}>{start}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Registration Closes At</Text>
                    <Text style={styles.value}>{close}</Text>
                </View>
                {data && data.length > 0 && data[0].status === 'accepted' && (
                <View style={styles.datas}>
                    <Text style={styles.data}>Gifts</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Gifts", { token: token, id: id })}>
                        <Image source={require('./assets/arrowRight.png')} style={{width: 15, height: 15}}/>
                    </TouchableOpacity>
                </View>
                )}
            </View>
            {isButtonVisible && (
            <View style={styles.choiceView}>
                <View style={styles.text}>
                    <Text style={{textAlign: 'center', fontWeight: '300'}}>Please, let your friend know your choice as soon as possible!</Text>
                </View>
                <View style={styles.buttonsView}>
                    <TouchableOpacity style={styles.choiceBtnView} onPress={() => handlePress('accepted')}>
                        <View style={styles.choiceBtn}>
                            <Image source={require('./assets/accept.png')} style={{width: 18, height: 18}}/>
                            <Text style={{color: '#699F4C', fontSize: 18, paddingLeft: 5}}>Accept</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.choiceBtnView} onPress={() => handlePress('declined')}>
                        <View style={styles.choiceBtn}>
                            <Image source={require('./assets/decline.png')} style={{width: 20, height: 20}}/>
                            <Text style={{color: '#D77165', fontSize: 18, paddingLeft: 5}}>Decline</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            )}
            <View style={{marginTop: 15, marginBottom: 10}}>
                <Text style={{fontSize: 19, fontWeight: 'bold'}}>Check it out on map</Text>
            </View>
            <MapView style={{ width: '90%', height: '35%' }}>
                <Marker coordinate={coordinates} title={location + ", " + street} />
            </MapView>
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

    invitationTitle: {
        alignItems: 'flex-start', 
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        padding: 23
    },

    data: {
        fontWeight: 'bold',
        fontSize: 15
    },

    value: {
        fontWeight: '600',
        fontSize: 12,
        color: '#A9A9A9'
    },

    accountDetails: {
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        paddingRight: 23,
        paddingLeft: 23
    },

    datas: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%',
        paddingTop: 6,
        paddingBottom: 6
    },

    choiceView: {
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
    },

    choiceBtn: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    choiceBtnView: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20
    },

    text: {
        width: "90%",
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 10,
        marginTop: 5
    },

    buttonsView: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
    }
  
});

export default InvitationDetail;