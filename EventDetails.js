import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TextInput, Button, Alert } from 'react-native';

const EventDetails = ({route, navigation}) => {

    const { token, eventData, image, username, email } = route.params;
    const [message, setMessage] = useState('');
    const [data, setData] = useState([]);

    const update = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/update.php?eventId=' + eventData.event_id, {
         method: 'PUT',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Token': token
         },
         body: JSON.stringify(eventData)
         }).then(response => {
           if(response.ok) {
              response.json().then((data)=>
              {
                setMessage('Event has been updated successfully')
              })
              .catch(err => console.log(err))
           }
           else {
             setMessage('Something went wrong while updating the event')
           }
         })
         .catch(err => console.log(err))
       }

    const deleteEvent = async () => {
      await fetch('http://192.168.0.17/EventRain/api/events/delete.php?eventId=' + eventData.event_id, {
        method: 'DELETE',
        headers: {
          'Token': token
        }
      })
      .then((response) => {
        if(response.ok) {
            navigation.navigate('Home', {
                token: token,
                image: image,
                username: username,
                email: email
            })
        }
        else {
          setMessage('Something went wrong while deleting')
        }
      })
      .catch(err => console.log(err))
    }

    const showDeleteAlert = () => {
        Alert.alert('Deleting event', 'This is permanent and irreversible!',
            [
                {
                    text: 'Delete',
                    onPress: () => { deleteEvent() },
                    style: 'destructive'
                },
                {
                    text: 'Cancel'
                }
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.noteText}>
                <Image source={require('./assets/note.png')} style={{ width: 35, height: 35 }} />
                <Text style={{ textAlign: 'left', left: 5 }}>Deleting the event is permanent and irreversible.</Text>
            </View>
            <Text style={{fontSize: 17, fontWeight: '300'}}>The selected event is <Text style={{fontWeight: 'bold'}}>{eventData.event_name}</Text></Text>
            <View style={styles.eventDetails}>
                <Text style={{width: '100%', fontWeight: '200', marginBottom: 15}}>EVENT INFORMATION</Text>
                <View style={styles.datas}>
                    <Text style={styles.data}>Name</Text>
                    <TextInput 
                        style={styles.value} 
                        value={eventData.event_name}
                        onChangeText={(name) => eventData.event_name = name}  
                    />
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Status</Text>
                    <TextInput 
                        style={styles.value} 
                        value={eventData.event_status}
                        onChangeText={(status) => eventData.event_status = status}  
                    />
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Type</Text>
                    <TextInput 
                        style={styles.value} 
                        value={eventData.event_type}
                        onChangeText={(type) => eventData.event_type = type}  
                    />
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Location</Text>
                    <TextInput 
                        style={styles.value} 
                        value={eventData.event_location}
                        onChangeText={(location) => eventData.event_location = location}  
                    />
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Street</Text>
                    <TextInput 
                        style={styles.value} 
                        value={eventData.event_street}
                        onChangeText={(street) => eventData.event_street = street}  
                    />
                </View>
                <View style={styles.messageView}>
                    <Text>{message}</Text>
                </View>
                <View style={styles.buttons}>
                    <Button onPress={() => update()}
                        title="Update"
                    />
                    <Button onPress={() => showDeleteAlert()}
                        color="#f00"
                        title="Delete"
                    />
                </View>
            </View>
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

    datas: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%',
        paddingTop: 12,
        paddingBottom: 12
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
    
    info: {
        top: 50,
        fontWeight: 'bold'
    },

    eventDetails: {
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        padding: 30
    },

    noteText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        padding: 20,
        backgroundColor: 'rgba( 2, 37, 74, 0.55 )',
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10
    },

    buttons: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    messageView: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%'
    }
  
});

export default EventDetails;