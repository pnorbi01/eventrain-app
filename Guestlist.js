import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Guestlist = ({route, navigation}) => {

    const { token, id } = route.params;
    const [data, setGuest] = useState([]);
    const [message, setMessage] = useState('');

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

    const GuestCards = ({ item }) => {
        return (
            <View style={styles.guestFlatListBody}>
                <View style={styles.guestView}>
                    <View style={styles.leftSide}>
                        <Image source={{ uri: 'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/'+ item.image }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                        <Text style={{fontWeight: '400', fontSize: 17, marginLeft: 5}}>{item.username}</Text>
                        {item.level === 'admin' && (
                        <Image source={require('./assets/verified.png')} style={{width: 15, height: 15, marginLeft: 5}}/>
                        )}
                    </View>
                    <View style={styles.guestStatus} >
                        <Text style={{fontWeight: '300', fontSize: 12}}>{item.status}</Text>
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
                    <View style={styles.guestInformation}>
                        <Text style={{fontWeight: '300', fontSize: 13, color: '#141d26'}}>Overall Participants: {data.numberOfGuests}</Text>
                        <Text style={{fontWeight: '300', fontSize: 13, color: '#141d26'}}>Attending Participants: {data.attendingGuests}</Text>
                    </View>
                </View>
            </View>
            <FlatList
                style={styles.guestFlatList}
                data={data.guest}
                renderItem={({item}) => (
                    <GuestCards item={item} />
            )}
            />
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

    guestStatus: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        height: '100%'
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
    }
});

export default Guestlist;