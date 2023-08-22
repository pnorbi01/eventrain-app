import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const ReservedGifts = ({route, navigation}) => {

    const { token } = route.params;
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    const seperator = () => {
        return (
            <View style={styles.seperator} />
        )
    }

    useFocusEffect(
        React.useCallback(() => {
          readReservedGifts();
        }, [])
    );

    const readReservedGifts = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/read-reserved-gifts.php', {
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
             setMessage('Something went wrong retrieving the events')
        }
        })
        .catch(err => console.log(err))
    }

    const releaseGift = async (giftId) => {
        await fetch('http://192.168.0.17/EventRain/api/events/release-gift.php?giftId=' + giftId, {
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
                readReservedGifts()
            })
            .catch(err => console.log(err))
        }
        else {
            setMessage('Something went wrong while releasing your gift')
        }
        })
        .catch(err => console.log(err))
    }

    const releaseAllGifts = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/release-all-reserved-gifts.php' , {
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
                readReservedGifts()
            })
            .catch(err => console.log(err))
        }
        else {
            setMessage('Something went wrong while releasing your gifts')
        }
        })
        .catch(err => console.log(err))
    }

    const showReleaseGiftAlert = (giftId, giftName) => {
        Alert.alert('Releasing ' + giftName, 'If you release the gift it will be available for others!',
            [
                {
                    text: 'Release',
                    onPress: () => { releaseGift(giftId) }
                },
                {
                    text: 'Cancel'
                }
            ]
        )
    }

    const showReleaseAllGiftsAlert = () => {
        Alert.alert('Releasing all gifts' , 'If you release the gifts it will be available for others!',
            [
                {
                    text: 'Release All',
                    onPress: () => { releaseAllGifts() }
                },
                {
                    text: 'Cancel'
                }
            ]
        )
    }

    const ReservedGiftCards = ({ item }) => {
        return (
            <View style={styles.giftFlatListBody}>
                <View style={styles.giftView}>
                    <View style={styles.leftSide}>
                        <View>
                            <Image source={require('../assets/images/gift.png')} style={{ width: 45, height: 45 }} />
                        </View>
                        <View style={styles.giftDescription}>
                            <Text style={{fontWeight: '400', fontSize: 17}}>{item.name}</Text>
                            <View style={styles.event}>
                                <Text style={{textAlign: 'center', fontSize: 13, color: '#000'}}>Event: {item.event_name}</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.lockedGiftView}  activeOpacity = { 1 } onPress={() => showReleaseGiftAlert(item.gift_id, item.name)} >
                        <Image source={require('../assets/images/locked.png')} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/images/reservedGifts.png')} style={{width: 260, height: 230}}/>
            <View style={styles.reservedGifts}>
                <Text style={{fontWeight: '200', marginBottom: 15}}>RESERVED GIFTS</Text>
                {data.length > 0 && (
                <TouchableOpacity style={styles.clearAllView} activeOpacity = { 1 } onPress={() => showReleaseAllGiftsAlert()}>
                    <Image source={require('../assets/images/trashCan.png')} style={{ width: 20, height: 20 }} />
                    <Text style={{color: '#FFF'}}>Release all</Text>
                </TouchableOpacity>
                )}
            </View>
                {data.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Image source={require('../assets/images/noGifts.png')} style={{width: 80, height: 80}}/>
                    <Text style={styles.noDataText}>You have no reserved gifts!</Text>
                </View>
                ) : (
                    <FlatList
                        style={styles.giftFlatList}
                        data={data}
                        renderItem={({item}) => (
                            <ReservedGiftCards item={item} />
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
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%'
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

    lockedGiftView: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#D77165',
        padding: 5,
        borderRadius: 10
    },

    clearAllView: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#D77165',
        padding: 5,
        borderRadius: 10
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

export default ReservedGifts;