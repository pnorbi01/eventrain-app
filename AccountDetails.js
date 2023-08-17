import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const AccountDetails = ({route, navigation}) => {

    const { token } = route.params;
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    useFocusEffect(
        React.useCallback(() => {
          readAccountInformation();
          console.log("Account");
        }, [])
    );

    const readAccountInformation = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/read-account-information.php', {
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

    const formattedDate = data.length > 0 ? new Date(data[0].registered_at).toLocaleDateString("en-GB") : "";

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('./assets/accountInformation.png')} style={{ width: 200, height: 200 }} />
            <View style={styles.accountTitleView}>
                <View style={styles.accountTitle}>
                    <Text style={{fontWeight: '700', fontSize: 30}}>Account details</Text>
                </View>
            </View>
            <View style={styles.accountDetails}>
                <View style={styles.datas}>
                    <Text style={styles.data}>Username</Text>
                    {data.length > 0 && <Text style={styles.value}>{data[0].username}</Text>}
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Email</Text>
                    {data.length > 0 && <Text style={styles.value}>{data[0].email}</Text>}
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Firstname</Text>
                    {data.length > 0 && <Text style={styles.value}>{data[0].firstname}</Text>}
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Lastname</Text>
                    {data.length > 0 && <Text style={styles.value}>{data[0].lastname}</Text>}
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Registration Date</Text>
                    {data.length > 0 && <Text style={styles.value}>{formattedDate}</Text>}
                </View>
                {data.length > 0 && data[0].level === 'admin' ? ( 
                <View style={styles.cardView}>
                    <Image source={require('./assets/verified.png')} style={{width: 50, height: 50}}/>
                    <Text style={{color: '#000', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>The following account is Verified, because is a developer at EventRain.</Text>
                </View>
                ) : ( 
                <View style={styles.cardView}>
                    <Image source={require('./assets/freeAccount.png')} style={{width: 50, height: 50}}/>
                    <Text style={{color: '#000', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>The following account is neither Premium or Verified.</Text>
                </View>
                )}
                <TouchableOpacity onPress={() => navigation.navigate("Token", { token: token })}>
                    <View style={styles.cardView}>
                        <Image source={require('./assets/token.png')} style={{width: 50, height: 50}}/>
                        <Text style={{color: '#000', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>Check your token to be able to update your password.</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Identification", { token: token })}>
                    <View style={styles.cardView}>
                        <Image source={require('./assets/password.png')} style={{width: 50, height: 50}}/>
                        <Text style={{color: '#000', marginLeft: 10, fontWeight: '500', flexShrink: 1}}>Update your password by clicking on the card.</Text>
                    </View>
                </TouchableOpacity>
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
        paddingTop: 10,
        paddingBottom: 10
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
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20
    },

    accountTitleView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingLeft: 20,
        paddingTop: 20
    },

    accountTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },

    cardView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#ccc',
        width: '100%',
        padding: 15,
        borderRadius: 30,
        margin: 5
    }

  
});

export default AccountDetails;

/*
<View style={styles.datas}>
                    <Text style={styles.data}>Level</Text>
                    {data.length > 0 && <Text style={styles.value}>{data[0].level}</Text>}
                </View>

                <View style={styles.datas}>
                    <Text style={styles.data}>Password</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Identification", { token: token })}>
                        <Image source={require('./assets/arrowRight.png')} style={{width: 15, height: 15}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Token</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Token", { token: token })}>
                        <Image source={require('./assets/arrowRight.png')} style={{width: 15, height: 15}}/>
                    </TouchableOpacity>
                </View>

*/