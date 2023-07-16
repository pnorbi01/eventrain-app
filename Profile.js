import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ActivityIndicator, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

const Profile = ({route, navigation}) => {

    const { token } = route.params;
    const { username } = route.params;
    const { email } = route.params;

    const logout = async () => {
        await fetch('http://192.168.0.17/EventRain/api/logout.php', {
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
                    text: 'Cancel',
                    onPress: () => { console.log('Delete pressed!'); }
                }
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={require('./assets/profilePic.png')} style={{width: 100, height: 100}}/>
                <Text style={{fontWeight: 'bold', fontSize: 15, paddingTop: 10}}>{username}</Text>
            </View>
            <TouchableOpacity style={styles.profileBtnContainer} onPress={() => navigation.navigate("Notifications", { token: token, email: email })}>
                <View style={styles.logout}>
                    <Image source={require('./assets/notifications.png')} style={{width: 20, height: 20}}/>
                    <Text style={{fontSize: 18, paddingLeft: 5, fontWeight: '500'}}>Notifications</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtnContainer} onPress={() => navigation.navigate("Account Details", { token: token, username: username, email: email })}>
                <View style={styles.logout}>
                    <Image source={require('./assets/account.png')} style={{width: 25, height: 25}}/>
                    <Text style={{fontSize: 18, paddingLeft: 5, fontWeight: '500'}}>Account</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={showLogoutAlert}>
                <View style={styles.logout}>
                    <Image source={require('./assets/logout.png')} style={{width: 20, height: 20}}/>
                    <Text style={{ color: '#D77165', fontSize: 18, paddingLeft: 5, fontWeight: '500'}}>Log Out</Text>
                </View>
            </TouchableOpacity>
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
        backgroundColor: '#ddd',
        height: 50,
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        margin: 10
    },

    logout: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    logoutBtn: {
        backgroundColor: '#ddd',
        height: 50,
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        margin: 10
    }
  
});

export default Profile;