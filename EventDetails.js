import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const EventDetails = ({route, navigation}) => {

    const { token, eventData, image, username, email } = route.params;
    const [message, setMessage] = useState('');
    const [data, setData] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
          readGifts();
          console.log("gifts");
        }, [])
    );

    const seperator = () => {
        return (
            <View style={styles.seperator} />
        )
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

    const readGifts = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/read-gifts.php?eventId='+eventData.event_id, {
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
             setMessage('Something went wrong retrieving the gifts')
           }
        })
        .catch(err => console.log(err))
    }

    const deleteGift = async (giftId) => {
        await fetch('http://192.168.0.17/EventRain/api/events/delete-gift.php?eventId=' + eventData.event_id + '&giftId=' + giftId, {
            method: 'DELETE',
            headers: {
            'Token': token
            }
        })
        .then((response) => {
            if(response.ok) {
                setMessage('Gift has been deleted successfully')
                readGifts()
            }
            else {
            setMessage('Something went wrong while deleting')
            }
        })
        .catch(err => console.log(err))
    }

    const showDeleteAlert = () => {
        Alert.alert('Deleting ' + eventData.event_name, 'This is permanent and irreversible!',
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

    const showDeleteGiftAlert = (giftId, giftName) => {
        Alert.alert('Deleting ' + giftName, 'This is permanent and irreversible!',
            [
                {
                    text: 'Delete',
                    onPress: () => { deleteGift(giftId) },
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
            <View style={styles.titleView}>
                <Text style={{fontWeight: '200'}}>EVENT INFORMATION</Text>
                <TouchableOpacity style={styles.deleteView} activeOpacity = { 1 } onPress={showDeleteAlert}>
                    <Image source={require('./assets/trashCan.png')} style={{ width: 20, height: 20 }} />
                    <Text style={{color: '#FFF'}}>Delete</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.eventDetails}>
                <View style={styles.datas}>
                    <Text style={styles.data}>Name</Text>
                    <Text style={styles.value}>{eventData.event_name}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Status</Text>
                    <Text style={styles.value}>{eventData.event_status}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Type</Text>
                    <Text style={styles.value}>{eventData.event_type}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Location</Text>
                    <Text style={styles.value}>{eventData.event_location}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Street</Text>
                    <Text style={styles.value}>{eventData.event_street}</Text>
                </View>
            </View>
            <View style={{padding: 10}}>
                <Text style={{fontSize: 13}}>Your gifts for the selected event will appear below</Text>
            </View>
            {data.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Image source={require('./assets/noGifts.png')} style={{width: 80, height: 80, marginBottom: 15}}/>
                    <Text style={styles.noDataText}>You have no gifts!</Text>
                </View>
            ) : (
                <FlatList
                    style={styles.giftFlatList}
                    data={data}
                    renderItem={({item}) => (
                    <View style={styles.giftFlatListBody}>
                        <View style={{padding: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  width: '100%'}}>
                            <View style={styles.leftSide}>
                                <View>
                                    <Image source={require('./assets/gift.png')} style={{ width: 45, height: 45 }} />
                                </View>
                                <View style={styles.giftDescription}>
                                    <Text style={{fontWeight: '400'}}>{item.name}</Text>
                                    {item.status === 'available' ? (
                                        <View style={styles.giftStatusAvailable}>
                                            <Text style={{textAlign: 'center', fontSize: 11, color: '#FFF'}}>{item.status}</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.giftStatusReserved}>
                                            <Text style={{textAlign: 'center', fontSize: 11, color: '#FFF'}}>{item.status}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity style={styles.deleteView}  activeOpacity = { 1 } onPress={() => showDeleteGiftAlert(item.gift_id, item.name)} >
                                <Image source={require('./assets/trashCan.png')} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ItemSeparatorComponent={seperator}
                />
            )}
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
        padding: 30,
        paddingTop: 20
    },

    noteText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        padding: 20,
        backgroundColor: 'rgba( 2, 37, 74, 0.55 )',
        borderRadius: 25,
        marginBottom: 10,
        marginTop: 10
    },

    titleView: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        paddingTop: 10,
        paddingRight: 30,
        paddingLeft: 30
    },

    deleteView: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#D77165',
        padding: 5,
        borderRadius: 10
    },

    giftFlatList: {
        width: '100%'
    },
    
    giftFlatListBody: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 7},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    giftStatusReserved: {
        backgroundColor:  '#D77165',
        paddingRight: 5,
        paddingLeft: 5,
        paddingTop: 1,
        paddingBottom: 1,
        borderRadius: 50
    },

    giftStatusAvailable: {
        backgroundColor:  '#699F4C',
        paddingRight: 5,
        paddingLeft: 5,
        paddingTop: 1,
        paddingBottom: 1,
        borderRadius: 50
    },

    noDataContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    
    },
    
    noDataText: {
        fontWeight: '200',
        fontSize: 15
    },

    leftSide: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    giftDescription: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 5
    },

    seperator: {
        width: '100%',
        height: 1,
        backgroundColor: '#ddd'
    },
  
});

export default EventDetails;


/*

                <View style={styles.buttons}>
                    <Button onPress={() => update()}
                        title="Update"
                    />
                </View>
                
                
                

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
       
       
       */