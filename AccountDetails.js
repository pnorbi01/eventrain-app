import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity, Alert } from 'react-native';

const AccountDetails = ({route, navigation}) => {

    const { token } = route.params;
    const { username } = route.params;
    const { email } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('./assets/accountInformation.png')} style={{width: 150, height: 150, top: 10}}/>
            <View style={styles.accountDetails}>
                <Text style={{width: '100%', fontWeight: '200', marginBottom: 15}}>ACCOUNT INFORMATION</Text>
                <View style={styles.datas}>
                    <Text style={styles.data}>Username</Text>
                    <Text style={styles.value}>{username}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Email</Text>
                    <Text style={styles.value}>{email}</Text>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Password</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Password", { token: token })}>
                        <Image source={require('./assets/arrowRight.png')} style={{width: 15, height: 15}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Token</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Token", { token: token })}>
                        <Image source={require('./assets/arrowRight.png')} style={{width: 15, height: 15}}/>
                    </TouchableOpacity>
                </View>
            </View>
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

    datas: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%',
        paddingTop: 12,
        paddingBottom: 12
    },

    data: {
        fontWeight: 'bold',
        fontSize: 15
    },

    deleteAccount: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#D77165'
    },

    value: {
        fontWeight: '600',
        fontSize: 12,
        color: '#A9A9A9'
    },
    
    info: {
        top: 50,
        fontWeight: 'bold'
    },

    accountDetails: {
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        padding: 30
    },
  
});

export default AccountDetails;