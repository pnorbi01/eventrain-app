import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CheckInternet from './CheckInternet';

const Profile = ({route, navigation}) => {

    const { token, username, email, image } = route.params;
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [message, setMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
          listUnreadNotifications();
        }, [])
    );

    const logout = async () => {
        await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/logout.php', {
          method: 'POST',
          headers: {
            'Token': token
          }
        })
        .then((response) => {
          if(response.ok) {
            navigation.navigate('Login')
          }
          else {
            setMessage('Something went wrong')
          }
        })
        .catch(err => console.log(err))
    }

    const showLogoutAlert = () => {
        Alert.alert('Logging out', 'Please confirm if you want to logout!',
            [
                {
                    text: 'Logout',
                    onPress: () => { logout() },
                    style: 'destructive'
                },
                {
                    text: 'Cancel'
                }
            ]
        )
    }

    const listUnreadNotifications = async () => {
        await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/events/unread-notifications.php', {
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
              setUnreadNotifications(data.unreadNotifications)
             })
             .catch(err => console.log(err))
           }
           else {
             setMessage('Something went wrong retrieving unread notifications')
           }
         })
         .catch(err => console.log(err))
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={{ uri: 'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/'+image }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                <Text style={{fontWeight: 'bold', fontSize: 17, paddingTop: 10}}>{username}</Text>
            </View>
            <TouchableOpacity style={styles.profileBtnContainer} onPress={() => navigation.navigate("Notifications", { token: token, email: email })}>
                <View style={styles.profileBtnView}>
                    <Image source={require('../assets/images/notifications.png')} style={{width: 20, height: 20}}/>
                    <Text style={{fontSize: 18, paddingLeft: 5, fontWeight: '500', paddingRight: 5}}>Notifications</Text>
                    {unreadNotifications > 0 &&
                    <View style={styles.badge}>
                        <Text style={{fontWeight: 'bold', color: '#FFF'}}>{unreadNotifications}</Text>
                    </View>
                    }
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtnContainer} onPress={() => navigation.navigate("Reserved Gifts", { token: token })}>
                <View style={styles.profileBtnView}>
                    <Image source={require('../assets/images/gifts.png')} style={{width: 20, height: 20}}/>
                    <Text style={{fontSize: 18, paddingLeft: 5, fontWeight: '500'}}>Reserved Gifts</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtnContainer} onPress={() => navigation.navigate("Account Details", { token: token })}>
                <View style={styles.profileBtnView}>
                    <Image source={require('../assets/images/profile.png')} style={{width: 25, height: 25}}/>
                    <Text style={{fontSize: 18, paddingLeft: 5, fontWeight: '500'}}>Account</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={showLogoutAlert}>
                <View style={styles.profileBtnView}>
                    <Image source={require('../assets/images/logout.png')} style={{width: 20, height: 20}}/>
                    <Text style={{ color: '#FFF', fontSize: 18, paddingLeft: 5, fontWeight: '500'}}>Log Out</Text>
                </View>
            </TouchableOpacity>
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

    profileContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    profileBtnContainer: {
        backgroundColor: '#AAB8C2',
        height: 50,
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        margin: 10
    },

    profileBtnView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    logoutBtn: {
        backgroundColor: '#D77165',
        height: 50,
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        margin: 10
    },

    badge: {
        backgroundColor: '#D77165',
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 50
    },

    spinnerTextStyle: {
        color: '#FFF'
    }
  
});

export default Profile;