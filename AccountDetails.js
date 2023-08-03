import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const AccountDetails = ({route, navigation}) => {

    const { token } = route.params;
    const [data, setData] = useState([]);

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

    const formattedDate = data.length > 0 ? new Date(data[0].date_time).toLocaleDateString("en-GB") : "";

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('./assets/accountInformation.png')} style={{width: 150, height: 150, top: 10}}/>
            <View style={styles.accountDetails}>
                <Text style={{width: '100%', fontWeight: '200', marginBottom: 15}}>ACCOUNT INFORMATION</Text>
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
                    <Text style={styles.data}>Level</Text>
                    {data.length > 0 && <Text style={styles.value}>{data[0].level}</Text>}
                </View>
                <View style={styles.datas}>
                    <Text style={styles.data}>Registration Date</Text>
                    {data.length > 0 && <Text style={styles.value}>{formattedDate}</Text>}
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