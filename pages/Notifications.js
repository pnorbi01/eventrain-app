import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';


const seperator = () => {
    return (
        <View style={styles.seperator} />
    )
}

const Notifications = ({route, navigation}) => {
    
    const { token } = route.params;
    const [data, setData] = useState([]);
    const [isCircleVisible, setIsCircleVisible] = useState({});
    const [message, setMessage] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [modalUsername, setModalUsername] = useState('');
    const [modalLevel, setModalLevel] = useState('');
    const [formattedRegisteredDate, setFormattedRegisteredDate] = useState('');


    useFocusEffect(
        React.useCallback(() => {
          listNotifications();
        }, [])
    );

    const toggleModal = (modalImage, modalUsername, modalLevel, modalRegisteredAt) => {
        const formattedRegisteredDate = getTheDayOfNotification(modalRegisteredAt);
        setModalImage(modalImage);
        setModalUsername(modalUsername);
        setModalLevel(modalLevel);
        setFormattedRegisteredDate(formattedRegisteredDate);
        setModalVisible(!isModalVisible);
    };

    const closeModal = () => {
        setModalImage('');
        setModalUsername('');
        setModalLevel('');
        setFormattedRegisteredDate('');
        setModalVisible(false);
    };

    const listNotifications = async () => {
        const response = await fetch('http://192.168.0.17/EventRain/api/events/read-notifications.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Token': token
            }
        });
        if (response.ok) {
            const data = await response.json();

            const circleVisibility = {};
            data.forEach(item => {
                circleVisibility[item.event_id] = item.state === 'unread';
            });

            setData(data);
            setIsCircleVisible(circleVisibility);
        } else {
            setMessage('Something went wrong retrieving the events');
        }
    };

    function getTheDayOfNotification(date) {
        const options = { month: 'short', day: 'numeric', year: 'numeric'};
        const dateString = date;
        const dateParts = dateString.split(/[- :]/);
        const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4], dateParts[5]); // Lokális időben létrehozott dátum

        const formattedNotificationTime = new Intl.DateTimeFormat('en-US', options).format(localDate);

        return formattedNotificationTime;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/images/notificationsPage.png')} style={{width: 250, height: 200}}/>
            <View style={styles.notifyTitle}>
                <Text style={{fontWeight: '200'}}>NOTIFICATIONS</Text>
            </View>
            {data.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Image source={require('../assets/images/noNotifications.png')} style={{width: 80, height: 80, marginBottom: 15}}/>
                    <Text style={styles.noDataText}>You have no notifications!</Text>
                </View>
            ) : (
            <FlatList
                style={styles.flat}
                data={data}
                renderItem={({item}) => {
                    const time = getTheDayOfNotification(item.notification_time);
                    return (
                    <View style={styles.flatView}>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View stlye={styles.circle}>
                                <Image source={isCircleVisible[item.event_id] ? require('../assets/images/circle.png') : require('../assets/images/readCircle.png')} style={{width: 10, height: 10, marginRight: 5}}/>
                            </View>
                            <TouchableOpacity activeOpacity={ 1 } onPress={() => {navigation.navigate("Invitation Detail", { token: token, id: item.event_id, name: item.event_name, type: item.event_type, status: item.event_status, location: item.event_location, street: item.event_street, start: item.event_start, close: item.event_close })}} style={{width: '100%'}}>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%'}}>
                                    <View>
                                        <Text style={styles.notification}>
                                            Event Invite
                                        </Text>
                                        <View style={styles.locationFlat}>
                                            <TouchableOpacity style={styles.locationFlat} onPress={() => toggleModal(item.image, item.username, item.level, item.registered_at)}>
                                                <Image source={{ uri: 'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/'+ item.image }} style={{ width: 20, height: 20, borderRadius: 50 }} /> 
                                                <Text style={{color: '#A9A9A9', marginLeft: 5}}>{item.username}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Text style={{color: '#a9a9a9'}}>{time}</Text>
                                </View>
                                
                            </TouchableOpacity>
                        </View>
                    </View>
                    );
                }}
                ItemSeparatorComponent={seperator}
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
                        <View style={styles.information}>
                            <Image source={modalLevel === 'admin' ? require('../assets/images/verified.png') : require('../assets/images/freeAccount.png')} style={{width: 20, height: 20}}/>
                            <Text style={{color: '#FFF', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>
                                {modalLevel === 'admin' ? 'The following account is Verified, because is a developer at EventRain.' : 'The following account is neither Premium or Verified.'}
                            </Text>
                        </View>
                        <View style={styles.information}>
                            <Image source={require('../assets/images/registeredAt.png')} style={{width: 20, height: 20}}/>
                            <Text style={{color: '#FFF', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>Registered in: {formattedRegisteredDate}</Text>
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
        paddingTop: 2
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
    },

    noDataContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '50%'
    },

    noDataText: {
        fontWeight: '200',
        fontSize: 15,
        marginTop: 10
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
        minHeight: 300,
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
    }
  
});

export default Notifications;