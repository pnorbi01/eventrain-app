import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ActivityIndicator, Image, SafeAreaView, TouchableOpacity, FlatList, Dimensions } from 'react-native';

var width = Dimensions.get('window').width;

const seperator = () => {
    return (
        <View style={styles.seperator} />
    )
  }

const Notifications = ({route, navigation}) => {
    
    const { token } = route.params;
    const [data, setData] = useState([]);

    useEffect(() => {
        listNotifications();
    });

    const listNotifications = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/read-notifications.php', {
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
             })
             .catch(err => console.log(err))
           }
           else {
             setMessage('Something went wrong retrieving the events')
           }
         })
         .catch(err => console.log(err))
       }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('./assets/notifyImage.png')} style={{width: 150, height: 150, top: 10}}/>
            <View style={styles.notifyTitle}>
                <Text style={{fontWeight: '200'}}>NOTIFICATIONS</Text>
            </View>
            <FlatList
                style={styles.flat}
                data={data}
                renderItem={({item}) => (
                    <View style={styles.flatView}>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View stlye={styles.circle}>
                                <Image source={require('./assets/circle.png')} style={{width: 8, height: 8, marginRight: 5}}/>
                            </View>
                            <TouchableOpacity activeOpacity={ 1 } onPress={() => {navigation.navigate("Invitation Detail", { token: token, id: item.event_id, name: item.event_name, type: item.event_type, status: item.event_status, location: item.event_location, street: item.event_street, start: item.event_start, close: item.event_close })}} style={{width: '100%'}}>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                                    <View>
                                        <Text style={styles.notification}>
                                            Event Invite
                                        </Text>
                                        <View style={styles.locationFlat}>
                                            <Text style={{color: '#A9A9A9'}}>From: {item.username}</Text>
                                        </View>
                                    </View>
                                    <Text style={{color: '#a9a9a9'}}>{item.date_time}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ItemSeparatorComponent={seperator}
            />
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

    flat: {
        width: '100%'
    },

    flatView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 20
    },

    locationFlat: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    notification: {
        fontWeight: 'bold',
        fontSize: 15
    },

    seperator: {
        width: '100%',
        height: 1,
        backgroundColor: '#ddd'
    },

    circle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    notifyTitle: {
        alignItems: 'flex-start', 
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        padding: 23
    }
  
});

export default Notifications;