import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import Modal from 'react-native-modal';


const InvitationDetail = ({route, navigation}) => {
    
    const { token, name, type, status, location, street, start, close, id } = route.params;
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [isButtonVisible, setIsButtonVisible] = useState(false); 
    const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [modalStatus, setModalStatus] = useState('');
    const [modalLocation, setModalLocation] = useState('');
    const [modalStreet, setModalStreet] = useState('');
    const [modalStart, setModalStart] = useState('');
    const [modalClose, setModalClose] = useState('');

    useFocusEffect(
        React.useCallback(() => {
          invitationDetail();
          setNotificationToRead();
          getLocationFromName(location + "," + street);
          console.log("InvDetail");
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
                <View style={styles.datas}>
                    <Text style={styles.data}>Guestlist</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Guestlist", { token: token, id: id })}>
                        <Image source={require('./assets/arrowRight.png')} style={{width: 15, height: 15}}/>
                    </TouchableOpacity>
                </View>
                {data && data.length > 0 && data[0].status === 'accepted' && (
                <View style={styles.datas}>
                    <Text style={styles.data}>Wishlist</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Wishlist", { token: token, id: id })}>
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
            <MapView style={{ width: '90%', height: '50%', borderRadius: 5}}>
                <Marker coordinate={coordinates} title={location + ", " + street} />
            </MapView>
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
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
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
    }
  
});

export default InvitationDetail;