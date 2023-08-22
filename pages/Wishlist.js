import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Gifts = ({route, navigation}) => {

    const { token, id } = route.params;
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    useFocusEffect(
        React.useCallback(() => {
          readGifts();
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
                    <Image source={require('../assets/images/caution.png')} style={{ width: 20, height: 20 }}/>
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

    const GiftCards = ({ item }) => {
        return (
            <View style={styles.giftFlatListBody}>
                <View style={styles.giftView}>
                    <View style={styles.leftSide}>
                        <View>
                            <Image source={require('../assets/images/gift.png')} style={{ width: 50, height: 50 }} />
                        </View>
                        <View style={styles.giftDescription}>
                            <Text style={{fontWeight: '400', fontSize: 17}}>{item.name}</Text>
                            <View style={item.status === 'available' ? styles.giftStatusAvailable : styles.giftStatusReserved}>
                                <Text style={{textAlign: 'center', fontSize: 11, color: '#FFF'}}>
                                    {item.status === 'available' ? item.status : item.status}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={item.status === 'available' ? styles.unReserveView : styles.lockedGiftView}  activeOpacity = { 1 } onPress={() => item.status === 'available' && showReserveGiftAlert(item.gift_id, item.name, item.event_id)} >
                        <Image source={item.status === 'available' ? require('../assets/images/unReserve.png') :  require('../assets/images/locked.png')} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.wishlistTitleView}>
                <View style={styles.wishlistTitle}>
                    <Text style={{fontWeight: '700', fontSize: 30}}>Wishlist</Text>
                    {data.numberOfGifts > 0 && (
                    <View style={styles.wishlistInformation}>
                        <Text style={{fontWeight: '300', fontSize: 13, color: '#141d26'}}>{data.numberOfGifts} gift(s) added</Text>
                        <Text style={{fontWeight: '300', fontSize: 13, color: '#141d26'}}>{data.reservedGifts} reserved</Text>
                    </View>
                    )}
                </View>
            </View>
            <Text>{message}</Text>
                {data.numberOfGifts === 0 ? (
                <View style={styles.noDataContainer}>
                    <Image source={require('../assets/images/noGifts.png')} style={{width: 80, height: 80}}/>
                    <Text style={styles.noDataText}>The owner has not given any gifts!</Text>
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
  
    errorMessage: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#D77165',
        borderRadius: 20
    },

    wishlistInformation: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },

    wishlistTitleView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 20
    },

    wishlistTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
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
    }
});

export default Gifts;