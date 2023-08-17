import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ActivityIndicator, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import Toast from 'react-native-root-toast';
import * as Clipboard from 'expo-clipboard';
import CustomToast from './CustomToast';

const Token = ({ route, navigation }) => {
    const { token } = route.params;
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [displayedToken, setDisplayedToken] = useState('');

    const startLoading = () => {
        setLoading(true);
    };

    const showToast = () => {
        Toast.show(<CustomToast text="Copied to clipboard!" />, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: false,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            opacity: 0.9,
          });
    };

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(displayedToken);
        showToast();
    };

    const checkToken = async () => {
        if (password.trim().length !== 0) {
        startLoading();

        try {
            const response = await fetch('http://192.168.0.17/EventRain/api/events/check-token.php', {
            method: 'POST',
            body: JSON.stringify({
                password: password,
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Token': token
            },
            });

            setLoading(false);

            if (response.ok) {
            const data = await response.json();
            if (data.token) {
                setDisplayedToken(data.token);
                setMessage('');
            } else {
                setDisplayedToken('');
                setMessage(
                <View style={styles.errorMessage}>
                    <Image
                    source={require('./assets/caution.png')}
                    style={{ width: 20, height: 20 }}
                    />
                    <Text style={{ color: '#FFF', marginLeft: 5 }}>Token not found</Text>
                </View>
                );
            }
            } else {
            setDisplayedToken('');
            setMessage(
                <View style={styles.errorMessage}>
                <Image
                    source={require('./assets/caution.png')}
                    style={{ width: 20, height: 20 }}
                />
                <Text style={{ color: '#FFF', marginLeft: 5 }}>Invalid password</Text>
                </View>
            );
            }
        } catch (error) {
            setLoading(false);
            setDisplayedToken('');
            setMessage(
            <View style={styles.errorMessage}>
                <Image
                source={require('./assets/caution.png')}
                style={{ width: 20, height: 20 }}
                />
                <Text style={{ color: '#FFF', marginLeft: 5 }}>An error occurred</Text>
            </View>
            );
        }
        } else {
        setDisplayedToken('');
        setMessage(
            <View style={styles.errorMessage}>
            <Image
                source={require('./assets/caution.png')}
                style={{ width: 20, height: 20 }}
            />
            <Text style={{ color: '#FFF', marginLeft: 5 }}>Please fill all required fields</Text>
            </View>
        );
        }
        setTimeout(() => {
        setMessage('');
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.tokenContainer}>
                <Image source={require('./assets/token.png')} style={{ width: 100, height: 100, shadowColor: '#171717', shadowOffset: {width: -2, height: 7}, shadowOpacity: 0.2, shadowRadius: 3 }} />
            </View>
            <View style={styles.tokenValidation}>
                <View style={styles.noteText}>
                    <Image source={require('./assets/note.png')} style={{ width: 35, height: 35 }} />
                    <Text style={{ textAlign: 'left', left: 5 }}>Note that, if you logout once the token will be deleted, and you will get a new one on your next login!</Text>
                </View>
                <Text style={{ textAlign: 'center', fontWeight: '300' }}>Please enter your password to be able to see your current token.</Text>
                <TextInput
                style={styles.input}
                placeholder="Password"
                defaultValue={password}
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                />
                {loading ? (
                <ActivityIndicator
                    visible={loading}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                    size='large'
                />
                ) : (
                <Button onPress={() => checkToken()} title="Show my token" />
                )}
                {displayedToken ? (
                    <TouchableOpacity style={styles.tokenView} onPress={() => copyToClipboard()}>
                        <Text style={styles.tokenText}>{displayedToken}</Text>
                        <Text style={styles.tokenInfo}>Copy your token by tapping on it.</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
            <Text>{message}</Text>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({

    spinnerTextStyle: {
        color: '#FFF',
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    tokenContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    tokenValidation: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        padding: 10
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

    noteText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20,
        backgroundColor: '#F5CF87',
        borderRadius: 25,
        marginBottom: 10
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

    tokenText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14
    },

    tokenInfo: {
        textAlign: 'center',
        fontSize: 11,
        marginTop: 10
    },

    tokenView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    }
  
});

export default Token;