import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Gifts = ({route, navigation}) => {

    const { token, id } = route.params;
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    const seperator = () => {
        return (
            <View style={styles.seperator} />
        )
    }

    useFocusEffect(
        React.useCallback(() => {
          readGifts();
          console.log("Gifts");
        }, [])
    );

    const readGifts = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/read-gifts.php?eventId='+ id, {
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

    const reserveGift = async (giftId, eventId) => {
        await fetch('http://192.168.0.17/EventRain/api/events/reserve-gift.php?giftId=' + giftId + '&eventId=' + eventId, {
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
                readGifts()
            })
            .catch(err => console.log(err))
        }
        else {
            setMessage(
                <View style={styles.errorMessage}>
                    <Image source={require('./assets/caution.png')} style={{ width: 20, height: 20 }}/>
                    <Text style={{color: '#FFF', marginLeft: 5}}>You can not reserve more than one gift for the same event.</Text>
                </View>
            );
            setTimeout(() => {
                setMessage(false);
            }, 3000);
        }
        })
        .catch(err => console.log(err))
    }

    const showReserveGiftAlert = (giftId, giftName, eventId) => {
        Alert.alert('Reserving ' + giftName, 'Are you sure you want to reserve the following gift?',
            [
                {
                    text: 'Reserve',
                    onPress: () => { reserveGift(giftId, eventId) }
                },
                {
                    text: 'Cancel'
                }
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('./assets/ownersGift.png')} style={{width: 150, height: 150, top: 10, shadowColor: '#171717', shadowOffset: {width: -2, height: 7}, shadowOpacity: 0.2, shadowRadius: 3 }}/>
            <View style={styles.reservedGifts}>
                <Text style={{width: '100%', fontWeight: '200', marginBottom: 5}}>GIFTS</Text>
            </View>
            {message}
                {data.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Image source={require('./assets/noGifts.png')} style={{width: 80, height: 80}}/>
                    <Text style={styles.noDataText}>The owner has not given any gifts!</Text>
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
                                        <Text style={{fontWeight: '400', fontSize: 17}}>{item.name}</Text>
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
                                {item.status === 'available' ? (
                                    <TouchableOpacity style={styles.unReserveView}  activeOpacity = { 1 } onPress={() => showReserveGiftAlert(item.gift_id, item.name, item.event_id)} >
                                        <Image source={require('./assets/unReserve.png')} style={{ width: 20, height: 20 }} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.lockedGiftView} >
                                        <Image source={require('./assets/locked.png')} style={{ width: 20, height: 20 }} />
                                    </TouchableOpacity>
                                )}
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

    reservedGifts: {
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        paddingLeft: 20,
        marginTop: 20
    },

    unReserveView: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#699F4C',
        padding: 5,
        borderRadius: 10
    },

    lockedGiftView: {
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
        alignItems: 'flex-start'
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
  
    errorMessage: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#D77165',
        borderRadius: 20
    }
});

export default Gifts;