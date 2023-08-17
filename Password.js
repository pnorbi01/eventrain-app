import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image, TextInput, Button } from 'react-native';

const Password = ({route, navigation}) => {

    const { token } = route.params;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const startLoading = () => {
        setLoading(true);
    };

    const changePassword = async () => {
        if (currentPassword.trim().length != 0 && newPassword.trim().length != 0) {
            if(newPassword.trim().length > 7) {
            startLoading();
        
                await fetch('http://192.168.0.17/EventRain/api/events/change-password.php', {
                method: 'POST',
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Token': token
                },
                })
                .then((response) => {
                    setLoading(false)
                    if(response.ok) {
                        data = response.json()
                        .then(data => {
                            setMessage(
                                <View style={styles.successMessage}>
                                    <Image
                                    source={require('./assets/updated.png')}
                                    style={{ width: 25, height: 25 }}
                                    />
                                    <Text style={{ color: '#FFF', marginLeft: 5 }}>Your password has been changed successfully!</Text>
                                </View>
                            );
                            setTimeout(() => {
                                setMessage(false);
                            }, 1500);
                        })
                        .catch(err => console.log(err));
                    }
                    else {
                    setMessage(
                        <View style={styles.errorMessage}>
                        <Image 
                            source={require('./assets/caution.png')}
                            style={{ width: 20, height: 20 }}
                        />
                        <Text style={{color: '#FFF', marginLeft: 5}}>Wrong old password</Text>
                        </View>
                    );
                        setTimeout(() => {
                        setMessage(false);
                        }, 1500);
                    }
                    }
                    )
                .catch(() => {
                    setLoading(false)
                    setMessage(
                    <View style={styles.errorMessage}>
                        <Image 
                        source={require('./assets/caution.png')}
                        style={{ width: 20, height: 20 }}
                        />
                        <Text style={{color: '#FFF', marginLeft: 5}}>Wrong old password</Text>
                    </View>
                    );
                    setTimeout(() => {
                        setMessage(false);
                    }, 1500);
                });
            }
            else {
                setMessage(
                    <View style={styles.errorMessage}>
                    <Image 
                        source={require('./assets/caution.png')}
                        style={{ width: 20, height: 20 }}
                    />
                    <Text style={{color: '#FFF', marginLeft: 5}}>New password must be atleast 8 character length</Text>
                    </View>
                );
                setTimeout(() => {
                        setMessage(false);
                }, 1500);
            }
        }
        else {
          setMessage(
            <View style={styles.errorMessage}>
              <Image 
                source={require('./assets/caution.png')}
                style={{ width: 20, height: 20 }}
              />
              <Text style={{color: '#FFF', marginLeft: 5}}>Please fill all required fields</Text>
            </View>
          );
          setTimeout(() => {
                setMessage(false);
          }, 1500);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('./assets/password.png')} style={{width: 150, height: 150, top: 10}}/>
            <View style={styles.passwordUpdate}>
                <Text style={{width: '100%', fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center'}}>Update your password</Text>
                <View>
                    <Text style={{textAlign: 'center', fontWeight: '300'}}>Please enter your existing password and your new password.</Text>
                </View>
                <TextInput
                style={styles.input}
                placeholder="Current Password"
                defaultValue={currentPassword}
                secureTextEntry={true}
                onChangeText={(currentPassword) => setCurrentPassword(currentPassword)}
                />
                <TextInput
                style={styles.input}
                placeholder="New Password"
                defaultValue={newPassword}
                secureTextEntry={true}
                onChangeText={(newPassword) => setNewPassword(newPassword)}
                />
                <Button onPress={() => changePassword()} title="Change my password" />
                {message}
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

    passwordUpdate: {
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        padding: 30
    },

    input: {
        padding: 10,
        marginVertical: 8,
        height: 50,
        width: 250,
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderBottomWidth: 0.5
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

    successMessage: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#699F4C',
        borderRadius: 20
    }
  
});

export default Password;