import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';

const MyGuestlist = ({route, navigation}) => {

    const { token, id, close } = route.params;
    const [data, setGuest] = useState([]);
    const [message, setMessage] = useState('');
    const [isClosedModalVisible, setClosedModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
          readGuestlist();
        }, [])
    );

    const readGuestlist = async () => {
        await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/events/read-guestlist.php?eventId='+ id, {
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
                setGuest(data)
             })
             .catch(err => console.log(err))
           }
           else {
             setMessage('Something went wrong retrieving guests')
           }
        })
        .catch(err => console.log(err))
    }

    const deleteGuest = async (email) => {
        await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/events/remove-guest-from-list.php?eventId=' + id + '&guest=' + email, {
            method: 'DELETE',
            headers: {
            'Token': token
            }
        })
        .then((response) => {
            if(response.ok) {
                setMessage('Guest has been deleted successfully')
                readGuestlist()
            }
            else {
            setMessage('Something went wrong while deleting')
            }
        })
        .catch(err => console.log(err))
    }
    
    const showDeleteGuestAlert = (guest, email) => {
        Alert.alert('Removing ' + guest, 'This is permanent!',
            [
                {
                    text: 'Remove',
                    onPress: () => { deleteGuest(email) },
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

    const GuestCards = ({ item }) => {
        return (
            <View style={styles.guestFlatListBody}>
                <View style={styles.guestView}>
                    <View style={styles.leftSide}>
                        <Image source={{ uri: 'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/'+ item.image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <View style={styles.guestDetailView}>
                            <View style={styles.guestData}>
                                <Text style={{fontWeight: '400', fontSize: 17, marginLeft: 5}}>{item.username}</Text>
                                {item.level === 'admin' && (
                                <Image source={require('../assets/images/verified.png')} style={{width: 15, height: 15, marginLeft: 2}}/>
                                )}
                            </View>
                            <View style={styles.guestDetail}>
                                <Text style={{fontWeight: '300', fontSize: 12, marginLeft: 5}}>{item.status}</Text>
                                <Text style={{fontSize: 5, color: '#BBB', marginLeft: 3}}>{'\u2B24'}</Text>
                                <Text style={{fontWeight: '300', fontSize: 12, marginLeft: 5}}>
                                    {item.state === 'read' ? 'Seen' : 'Unseen'}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.editGuestView} >
                        <TouchableOpacity style={styles.deleteGuest} onPress={() => compareDates(close) === true ? toggleClosedEventModal(true) : showDeleteGuestAlert(item.username, item.invited_user_email)}>
                            <Image source={require('../assets/images/trashCan.png')} style={{ width: 15, height: 15 }} />
                            <Text style={{color: '#FFF', fontSize: 12}}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.guestTitleView}>
                <View style={styles.guestTitle}>
                    <Text style={{fontWeight: '700', fontSize: 30}}>Guestlist</Text>
                    {data.numberOfGuests > 0 && (
                    <View style={styles.guestInformation}>
                        <Text style={{fontWeight: '300', fontSize: 13, color: '#141d26'}}>Overall Participants: {data.numberOfGuests}</Text>
                        <Text style={{fontWeight: '300', fontSize: 13, color: '#141d26'}}>Attending Participants: {data.attendingGuests}</Text>
                    </View>
                    )}
                </View>
            </View>
            {data.numberOfGuests === 0 ? (
                <View style={styles.noDataContainer}>
                    <Image source={require('../assets/images/noGuests.png')} style={{width: 80, height: 80}}/>
                    <Text style={styles.noDataText}>No participants have been included yet</Text>
                </View>
            ) : (
            <FlatList
                style={styles.guestFlatList}
                data={data.guest}
                renderItem={({item}) => (
                    <GuestCards item={item} />
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
                    <Image source={require('../assets/images/locked.png')} style={{width: 50, height: 50}}/>
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

    editGuestView: {
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    guestFlatList: {
        width: '100%'
    },
    
    guestFlatListBody: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 8
    },

    guestInformation: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },

    noDataContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
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
        alignItems: 'center'
    },

    errorMessage: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#D77165',
        borderRadius: 20
    },

    guestTitleView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 20
    },

    guestTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },

    deleteGuest: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#D77165',
        padding: 5,
        borderRadius: 10
    },

    guestDetailView: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },

    guestDetail: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    guestData: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    guestView: {
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

export default MyGuestlist;