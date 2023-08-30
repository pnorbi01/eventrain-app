import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';
import CheckInternet from './CheckInternet';


const InvitationDetail = ({route, navigation}) => {
    
    const { token, name, type, status, location, street, start, close, id } = route.params;
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [isButtonVisible, setIsButtonVisible] = useState(false); 
    const [isModalVisible, setModalVisible] = useState(false);
    const [isClosedModalVisible, setClosedModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [modalStatus, setModalStatus] = useState('');
    const [modalLocation, setModalLocation] = useState('');
    const [modalStreet, setModalStreet] = useState('');
    const [modalStart, setModalStart] = useState('');
    const [modalClose, setModalClose] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
          invitationDetail();
          setNotificationToRead();
        }, [])
    );

    const toggleModal = (modalType, modalStatus, modalLocation, modalStreet, modalStart, modalClose) => {
        setModalType(modalType);
        setModalStatus(modalStatus);
        setModalLocation(modalLocation);
        setModalStreet(modalStreet);
        setModalStart(modalStart);
        setModalClose(modalClose);
        setModalVisible(!isModalVisible);
    };

    const closeModal = () => {
        setModalType('');
        setModalStatus('');
        setModalLocation('');
        setModalStreet('');
        setModalStart('');
        setModalClose('');
        setModalVisible(false);
    };

    const toggleClosedEventModal = () => {
        setClosedModalVisible(!isClosedModalVisible);
    }

    const closeClosedEventModal = () => {
        setClosedModalVisible(false);
    }

    const handlePress = (value) => {
        const updateStatus = async () => {
            await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/events/update-status.php?eventId=' + id + '&status=' + value, {
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
        await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/events/invitation-detail.php?eventId=' + id, {
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
        await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/events/set-notification-to-read.php?eventId=' + id, {
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

    function compareDates(targetDateString) {
        const targetDate = new Date(targetDateString.replace(/-/g, '/'));
        const currentDate = new Date();

        if (currentDate.getTime() > targetDate.getTime()) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.eventDetailTitleView}>
            <View style={styles.eventDetailTitle}>
                <Text style={{fontWeight: '700', fontSize: 30}}>{name}</Text>
                <View>
                    <TouchableOpacity style={styles.moreInfo} onPress={() => toggleModal(type, status, location, street, start, close)}>
                        <Text style={{color: '#000', fontSize: 12}}>More info</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <View style={styles.accountDetails}>
            <View style={styles.datas}>
                <Text style={styles.data}>My Station</Text>
                {data.length > 0 && <Text style={styles.value}>{data[0].status}</Text>}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Guestlist", { token: token, id: id })}>
                <View style={styles.cardView}>
                    <Image source={require('../assets/images/guestlist.png')} style={{width: 50, height: 50}}/>
                    <Text style={{color: '#000', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>Check out the invited members to the following event.</Text>
                </View>
            </TouchableOpacity>
            {data && data.length > 0 && data[0].status === 'accepted' && (
            <TouchableOpacity onPress={() => compareDates(close) === true ? toggleClosedEventModal(true) : navigation.navigate("Wishlist", { token: token, id: id })}>
                <View style={styles.cardView}>
                    <Image source={require('../assets/images/gift.png')} style={{width: 50, height: 50}}/>
                    <Text style={{color: '#000', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>Check out the added gifts for the event.</Text>
                </View>
            </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.navigate("Map", { token: token, id: id, name: name, location: location, street: street })}>
                <View style={styles.cardView}>
                    <Image source={require('../assets/images/map.png')} style={{width: 50, height: 50}}/>
                    <Text style={{color: '#000', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>Check out the exact location of the event on the map.</Text>
                </View>
            </TouchableOpacity>
        </View>
        {isButtonVisible && (
        <View style={styles.choiceView}>
            <View style={styles.text}>
                <Text style={{textAlign: 'center', fontWeight: '300'}}>Please, let your friend know your choice as soon as possible!</Text>
            </View>
            <View style={styles.buttonsView}>
                <TouchableOpacity style={styles.choiceBtnView} onPress={() => handlePress('accepted')}>
                    <View style={styles.choiceBtn}>
                        <Image source={require('../assets/images/accept.png')} style={{width: 18, height: 18}}/>
                        <Text style={{color: '#699F4C', fontSize: 18, paddingLeft: 5}}>Accept</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.choiceBtnView} onPress={() => handlePress('declined')}>
                    <View style={styles.choiceBtn}>
                        <Image source={require('../assets/images/decline.png')} style={{width: 20, height: 20}}/>
                        <Text style={{color: '#D77165', fontSize: 18, paddingLeft: 5}}>Decline</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
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
                <View style={styles.eventInformation}>
                    <View style={styles.modalTitle}>
                        <Text style={{fontWeight: '700', fontSize: 30, color: '#bbb'}}>Further details</Text>
                    </View>
                    <View style={styles.datas}>
                        <Text style={styles.modalData}>Type</Text>
                        <Text style={styles.modalValue}>{modalType}</Text>
                    </View>
                    <View style={styles.datas}>
                        <Text style={styles.modalData}>Status</Text>
                        <Text style={styles.modalValue}>{modalStatus}</Text>
                    </View>
                    <View style={styles.datas}>
                        <Text style={styles.modalData}>Location</Text>
                        <Text style={styles.modalValue}>{modalLocation}</Text>
                    </View>
                    <View style={styles.datas}>
                        <Text style={styles.modalData}>Street</Text>
                        <Text style={styles.modalValue}>{modalStreet}</Text>
                    </View>
                    <View style={styles.datas}>
                        <Text style={styles.modalData}>Start</Text>
                        <Text style={styles.modalValue}>{modalStart}</Text>
                    </View>
                    <View style={styles.datas}>
                        <Text style={styles.modalData}>Close</Text>
                        <Text style={styles.modalValue}>{modalClose}</Text>
                    </View>
                </View>
            </View>
        </Modal>
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
                <Text style={{color: '#FFF', fontWeight: 'bold', marginTop: 10, textAlign: 'center'}}>You are unable to handle gifts as the event has closed.</Text>
            </View>
        </Modal>
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
    
    modalContent: {
        backgroundColor: "#141d26",
        paddingTop: 12,
        paddingHorizontal: 12,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        minHeight: 350,
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

    eventInformation: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        width: '100%',
        padding: 10
    },

    modalData: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#FFF'
    },

    modalValue: {
        fontWeight: '600',
        fontSize: 12,
        color: '#A9A9A9'
    },

    modalTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },

    moreInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00B0FF',
        padding: 5,
        borderRadius: 10
    },

    eventDetailTitleView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 20
    },

    eventDetailTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
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

export default InvitationDetail;