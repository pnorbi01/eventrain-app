import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';

const EventDetails = ({route, navigation}) => {

    const { token, eventData, image, username, email } = route.params;
    const [message, setMessage] = useState('');
    const [data, setData] = useState([]);
    const [isClosedModalVisible, setClosedModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
          readGifts();
          console.log("gifts");
        }, [])
    );

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
        await fetch('http://192.168.0.17/EventRain/api/events/read-gifts.php?eventId='+ eventData.event_id, {
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

    function compareDates(targetDateString) {
        const targetDate = new Date(targetDateString.replace(/-/g, '/'));
        const currentDate = new Date();

        if (currentDate.getTime() > targetDate.getTime()) {
            return true;
        } else {
            return false;
        }
    }

    const toggleClosedEventModal = () => {
        setClosedModalVisible(!isClosedModalVisible);
    }

    const closeClosedEventModal = () => {
        setClosedModalVisible(false);
    }

    const GiftCards = ({ item }) => {
        return (
            <View style={styles.giftFlatListBody}>
                <View style={styles.giftView}>
                    <View style={styles.leftSide}>
                        <View>
                            <Image source={require('./assets/gift.png')} style={{ width: 45, height: 45 }} />
                        </View>
                        <View style={styles.giftDescription}>
                            <Text style={{fontWeight: '400'}}>{item.name}</Text>
                            <View style={item.status === 'available' ? styles.giftStatusAvailable : styles.giftStatusReserved}>
                                <Text style={{textAlign: 'center', fontSize: 11, color: '#FFF'}}>
                                    {item.status === 'available' ? item.status : item.status}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.deleteView}  activeOpacity = { 1 } onPress={() => compareDates(eventData.event_close) === true ? toggleClosedEventModal(true) : showDeleteGiftAlert(item.gift_id, item.name)} >
                        <Image source={require('./assets/trashCan.png')} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.noteText}>
                <Image source={require('./assets/note.png')} style={{ width: 35, height: 35 }} />
                <Text style={{ textAlign: 'left', left: 5 }}>Deleting either event or gift is permanent and irreversible.</Text>
            </View>
            <View style={styles.titleView}>
                <Text style={{fontWeight: '200'}}>EVENT INFORMATION</Text>
                <TouchableOpacity style={styles.deleteView} activeOpacity = { 1 } onPress={() => compareDates(eventData.event_close) === true ? toggleClosedEventModal(true) : showDeleteAlert()}>
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
                <View style={styles.datas}>
                    <Text style={styles.data}>Start</Text>
                    <Text style={styles.value}>{eventData.event_start}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Close</Text>
                    <Text style={styles.value}>{eventData.event_close}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("My Guestlist", { token: token, id: eventData.event_id, close: eventData.event_close })}>
                    <View style={styles.cardView}>
                        <Image source={require('./assets/guestlist.png')} style={{width: 50, height: 50}}/>
                        <Text style={{color: '#000', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>Check out the invited members to the following event.</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{padding: 10}}>
                <Text style={{fontSize: 13}}>Your gifts for the selected event will appear below</Text>
            </View>
            {data.numberOfGifts === 0 ? (
                <View style={styles.noDataContainer}>
                    <Image source={require('./assets/noGifts.png')} style={{width: 80, height: 80}}/>
                    <Text style={styles.noDataText}>You have no gifts!</Text>
                </View>
            ) : (
                <FlatList
                    style={styles.giftFlatList}
                    data={data.gifts}
                    renderItem={({item}) => (
                        <GiftCards item={item} />
                    )}
                />
            )}
            <Modal
                isVisible={isClosedModalVisible}
                swipeDirection="down"
                onSwipeComplete={closeClosedEventModal}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={900}
                animationOutTiming={500}
                backdropTransitionInTiming={1000}
                backdropTransitionOutTiming={500}
                style={styles.modal}
            >
                <View style={styles.closedEventModalContent}>
                    <View style={styles.barIcon} />
                    <Image source={require('./assets/locked.png')} style={{width: 50, height: 50}}/>
                    <Text style={{color: '#FFF', fontWeight: 'bold', marginTop: 10, textAlign: 'center'}}>You are unable to handle the request as the event has closed.</Text>
                </View>
            </Modal>
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
        paddingTop: 5,
        paddingBottom: 5
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
        backgroundColor: '#F5CF87',
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
        margin: 8
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
        fontSize: 15,
        marginTop: 10
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

    giftView: {
        padding: 15, 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',  
        width: '100%',
        backgroundColor: '#DBDBDB',
        borderRadius: 20,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 7 },
        shadowOpacity: 0.2,
        shadowRadius: 3
    },

    cardView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#ccc',
        width: '100%',
        padding: 15,
        borderRadius: 30,
        margin: 5
    },

    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },

    closedEventModalContent: {
        backgroundColor: "#141d26",
        paddingTop: 12,
        paddingHorizontal: 12,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    barIcon: {
        width: 40,
        height: 5,
        backgroundColor: "#bbb",
        borderRadius: 3,
        position: 'absolute',
        top: 10
    }
  
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