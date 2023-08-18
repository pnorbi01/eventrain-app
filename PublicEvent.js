import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';

const { width } = Dimensions.get('window');

const PublicEvent = ({route, navigation}) => {

    const { token, eventData, image, username, email } = route.params;
    const [message, setMessage] = useState('');
    const [data, setData] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [modalUsername, setModalUsername] = useState('');
    const [modalLevel, setModalLevel] = useState('');
    const [owner, setOwner] = useState('owner');
    const [invitedUserEmail, setInvitedUserEmail] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            readGuests();
          console.log("gifts");
        }, [])
    );

    const readGuests = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/read-public-event-guests.php?eventId='+ eventData.event_id, {
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
                let found = false;
                data.guests.forEach(guest => {
                    if(guest.invited_user_email === email) {
                        if(guest.status === 'joined') {
                            found = true;
                        }
                        else {
                            found = null;
                        }
                    }
                });
                console.log(found);
                setInvitedUserEmail(found);
             })
             .catch(err => console.log(err))
           }
           else {
             setMessage('Something went wrong retrieving the gifts')
           }
        })
        .catch(err => console.log(err))
    }

    const joinParty = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/join-public-event.php?eventId='+ eventData.event_id + '&ownerId=' + eventData.user_id, {
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
                setMessage(data.message);
                readGuests();
             })
             .catch(err => console.log(err))
           }
           else {
             setMessage('Something went wrong while joining party')
           }
        })
        .catch(err => console.log(err))
    }

    const quitParty = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/quit-public-event.php?eventId='+ eventData.event_id, {
         method: 'DELETE',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Token': token
        }
        }).then(response => {
           if(response.ok) {
             response.json()
             .then(data => {
                setMessage(data.message);
                readGuests();
             })
             .catch(err => console.log(err))
           }
           else {
             setMessage('Something went wrong while quiting party')
           }
        })
        .catch(err => console.log(err))
    }

    const toggleModal = (modalImage, modalUsername, modalLevel, owner) => {
        setModalImage(modalImage);
        setModalUsername(modalUsername);
        setModalLevel(modalLevel);
        setOwner(owner);
        setModalVisible(!isModalVisible);
    };

    const closeModal = () => {
        setModalImage('');
        setModalUsername('');
        setModalLevel('');
        setOwner('owner');
        setModalVisible(false);
    };

    const GiftCards = ({ item }) => {
        return (
            <View style={styles.guestFlatListBody}>
                <TouchableOpacity activeOpacity={1} onPress={() => toggleModal(item.image, item.username, item.level)}>
                    <View style={styles.guestView}>
                        <Image source={{ uri: 'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/'+ item.image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Image source={require('./assets/publicEvent.png')} style={{ width: 200, height: 200 }} />
                <View style={styles.publicEventTitleView}>
                    <View style={styles.publicEventTitle}>
                        <Text style={{fontWeight: '500', fontSize: 18}}>Event details</Text>
                        {invitedUserEmail !== null && (
                            <TouchableOpacity onPress={() => invitedUserEmail ? quitParty() : joinParty()} style={invitedUserEmail ? styles.quitParty : styles.joinParty}>
                                <Text style={{ color: "#FFF", fontSize: 13, fontWeight: '400' }}>
                                    {invitedUserEmail ? "Quit party" : "Join party"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
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
                    <TouchableOpacity onPress={() => navigation.navigate("Map", { token: token, id: id, location: eventData.event_location, street: eventData.event_street })}>
                        <View style={styles.cardView}>
                            <Image source={require('./assets/map.png')} style={{width: 50, height: 50}}/>
                            <Text style={{color: '#000', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>Check out the exact location of the event on the map.</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.publicEventTitleView}>
                    <View style={styles.publicEventTitle}>
                        <Text style={{fontWeight: '500', fontSize: 18}}>Event organizer</Text>
                    </View>
                </View>
                <View style={styles.organizerView}>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleModal(eventData.image, eventData.username, eventData.level, owner)}>
                        <View style={styles.organizer}>
                            <Image source={{ uri: 'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/'+ eventData.image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <Image source={require('./assets/crown.png')} style={{ width: 20, height: 20, position: 'absolute', top: -10, right: -3, transform: [{rotate: '35deg'}]}} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.publicEventTitleView}>
                    <View style={styles.publicEventTitle}>
                        <Text style={{fontWeight: '500', fontSize: 18}}>Invited members</Text>
                        <Text style={{fontWeight: '300', fontSize: 11}}>{data.numberOfGuests} people invited</Text>
                    </View>
                </View>
                {data && data.guests && Array.isArray(data.guests) && data.guests.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Image source={require('./assets/noGuests.png')} style={{width: 50, height: 50}}/>
                    <Text style={styles.noDataText}>No invited members yet</Text>
                </View>
                ) : (
                    <FlatList
                        horizontal
                        style={styles.guestFlatList}
                        data={data.guests}
                        renderItem={({item}) => (
                            <GiftCards item={item} />
                    )}
                    />
                )}
                <Modal
                    isVisible={isModalVisible}
                    swipeDirection="down"
                    onSwipeComplete={closeModal}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={900}
                    animationOutTiming={500}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={500}
                    style={styles.modal}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.barIcon} />
                        <View style={styles.accountInformation}>
                            <Image source={{ uri: 'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/'+ modalImage }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                            <Text style={styles.username}>{modalUsername}</Text>
                        </View>
                        <View style={styles.accountDescription}>
                            {owner === 'owner' && (
                                <View style={styles.information}>
                                    <Image source={require('./assets/crown.png')} style={{width: 20, height: 20}}/>
                                    <Text style={{color: '#FFF', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>The following account is the owner of the event.</Text>
                                </View>
                            )}
                            {modalLevel === 'admin' ? (
                                <View style={styles.information}>
                                    <Image source={require('./assets/verified.png')} style={{width: 20, height: 20}}/>
                                    <Text style={{color: '#FFF', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>The following account is Verified, because is a developer at EventRain.</Text>
                                </View>
                            ) : (
                                <View style={styles.information}>
                                    <Image source={require('./assets/freeAccount.png')} style={{width: 20, height: 20}}/>
                                    <Text style={{color: '#FFF', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>The following account is neither Premium or Verified.</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            </ScrollView>
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

    scrollView: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width
    },

    publicEventTitleView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },

    noDataContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },

    noDataText: {
        fontWeight: '200',
        fontSize: 15,
        marginTop: 5
    },

    publicEventTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10
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

    eventDetails: {
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        padding: 25,
        paddingTop: 10
    },

    organizerView: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        width: '100%',
        marginLeft: 25,
        padding: 10
    },

    organizer: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        alignItems: 'center'
    },

    guestFlatList: {
        width: '100%',
        marginLeft: 25,
        flexGrow: 0,
        padding: 10
    },

    guestFlatListBody: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },

    guestView: {
        marginRight: 3
    },

    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    
    modalContent: {
        backgroundColor: "#141d26",
        paddingTop: 12,
        paddingHorizontal: 12,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
      
    barIcon: {
        width: 40,
        height: 5,
        backgroundColor: "#bbb",
        borderRadius: 3,
        position: 'absolute',
        top: 10
    },
      
    username: {
        color: "#bbb",
        fontSize: 24,
        marginTop: 10,
        marginBottom: 5
    },

    accountInformation: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25
    },

    accountDescription: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 25
    },

    information: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        paddingBottom: 25
    },

    joinParty: {
        padding: 5,
        backgroundColor: '#699F4C',
        borderRadius: 10
    },

    quitParty: {
        padding: 5,
        backgroundColor: '#D77165',
        borderRadius: 10
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
    }
});

export default PublicEvent;