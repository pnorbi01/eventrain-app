import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const MyGuestlist = ({route, navigation}) => {

    const { token, id } = route.params;
    const [data, setGuest] = useState([]);
    const [message, setMessage] = useState('');

    const seperator = () => {
        return (
            <View style={styles.seperator} />
        )
    }

    useFocusEffect(
        React.useCallback(() => {
          readGuestlist();
          console.log("Guestlist");
        }, [])
    );

    const readGuestlist = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/read-guestlist.php?eventId='+ id, {
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
        await fetch('http://192.168.0.17/EventRain/api/events/remove-guest-from-list.php?eventId=' + id + '&guest=' + email, {
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
                    <Image source={require('./assets/noGuests.png')} style={{width: 80, height: 80}}/>
                    <Text style={styles.noDataText}>No participants have been included yet</Text>
                </View>
            ) : (
            <FlatList
                style={styles.guestFlatList}
                data={data.guest}
                renderItem={({item}) => (
                <View style={styles.guestFlatListBody}>
                    <View style={{padding: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  width: '100%'}}>
                        <View style={styles.leftSide}>
                            <Image source={{ uri: 'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/'+ item.image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View style={styles.guestDetail}>
                                <Text style={{fontWeight: '400', fontSize: 17, marginLeft: 5}}>{item.username}</Text>
                                <Text style={{fontWeight: '300', fontSize: 12, marginLeft: 5}}>{item.status}</Text>
                            </View>
                        </View>
                        <View style={styles.editGuestView} >
                            <TouchableOpacity style={styles.deleteGuest} onPress={() => showDeleteGuestAlert(item.username, item.invited_user_email)}>
                                <Image source={require('./assets/trashCan.png')} style={{ width: 15, height: 15 }} />
                                <Text style={{color: '#FFF', fontSize: 12}}>Remove</Text>
                            </TouchableOpacity>
                        </View>
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
        alignItems: 'flex-start'
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

    guestDetail: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
    }
});

export default MyGuestlist;