import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';


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

    useFocusEffect(
        React.useCallback(() => {
          listNotifications();
          console.log("Notifik");
        }, [])
    );

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true, locale: enGB });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('./assets/notifyImage.png')} style={{width: 150, height: 150, top: 10, shadowColor: '#171717', shadowOffset: {width: -2, height: 7}, shadowOpacity: 0.2, shadowRadius: 3}}/>
            <View style={styles.notifyTitle}>
                <Text style={{fontWeight: '200'}}>NOTIFICATIONS</Text>
            </View>
            {data.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Image source={require('./assets/noNotifications.png')} style={{width: 80, height: 80, marginBottom: 15}}/>
                    <Text style={styles.noDataText}>You have no notifications!</Text>
                </View>
            ) : (
            <FlatList
                style={styles.flat}
                data={data}
                renderItem={({item}) => {
                    const formattedDate = formatDate(item.date_time);
                    return (
                    <View style={styles.flatView}>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View stlye={styles.circle}>
                                {isCircleVisible[item.event_id] ? (
                                    <Image source={require('./assets/circle.png')} style={{width: 10, height: 10, marginRight: 5}}/>
                                ) : (
                                    <Image source={require('./assets/readCircle.png')} style={{width: 10, height: 10, marginRight: 5}}/>
                                )}
                            </View>
                            <TouchableOpacity activeOpacity={ 1 } onPress={() => {navigation.navigate("Invitation Detail", { token: token, id: item.event_id, name: item.event_name, type: item.event_type, status: item.event_status, location: item.event_location, street: item.event_street, start: item.event_start, close: item.event_close })}} style={{width: '100%'}}>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                                    <View>
                                        <Text style={styles.notification}>
                                            Event Invite
                                        </Text>
                                        <View style={styles.locationFlat}>
                                            <Image source={{ uri: 'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/'+ item.image }} style={{ width: 20, height: 20, borderRadius: 50 }} /> 
                                            <Text style={{color: '#A9A9A9', marginLeft: 5}}>{item.username}</Text>
                                        </View>
                                    </View>
                                    {data.length > 0 && <Text style={{color: '#a9a9a9'}}>{formattedDate}</Text>}
                                </View>
                                
                            </TouchableOpacity>
                        </View>
                    </View>
                    );
                }}
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
        paddingTop: 5
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
        fontSize: 15
    }
  
});

export default Notifications;