import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TextInput, ActivityIndicator, Image, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import CheckInternet from './CheckInternet';

const { width } = Dimensions.get('window');

const Identification = ({ route, navigation }) => {
    const { token } = route.params;
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [specifiedToken, setSpecifiedToken] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const startLoading = () => {
        setLoading(true);
    };

    const identification = async () => {
      if (specifiedToken.trim().length != 0) {
        startLoading();
  
          await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/events/identification.php', {
            method: 'POST',
            body: JSON.stringify({
              specifiedToken: specifiedToken
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
                      navigation.navigate('Password', {
                          token: data.token
                      })
                  })
                  .catch(err => console.log(err));
              }
              else {
                setMessage(
                  <View style={styles.errorMessage}>
                    <Image 
                      source={require('../assets/images/caution.png')}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text style={{color: '#FFF', marginLeft: 5}}>Invalid token</Text>
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
                    source={require('../assets/images/caution.png')}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text style={{color: '#FFF', marginLeft: 5}}>Invalid token</Text>
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
              source={require('../assets/images/caution.png')}
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
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.tokenContainer}>
                    <Image source={require('../assets/images/identify.png')} style={{ width: 100, height: 100 }} />
                </View>
                <View style={styles.tokenValidation}>
                    <View style={styles.noteText}>
                        <Image source={require('../assets/images/note.png')} style={{ width: 35, height: 35 }} />
                        <Text style={{ textAlign: 'left', left: 5 }}>You have to identify yourself with unique token, before you make changes on your password!</Text>
                    </View>
                    <View style={styles.helpView}>
                      <Text style={{ textAlign: 'center', fontWeight: '300', width: '80%'}}>Please enter your unique token below. If you do not know your token, please go to Token tab and check it!</Text>
                    </View>
                    <TextInput
                    style={styles.input}
                    placeholder="Unique Token"
                    defaultValue={specifiedToken}
                    onChangeText={(specifiedToken) => setSpecifiedToken(specifiedToken)}
                    />
                    {loading ? (
                    <ActivityIndicator
                        visible={loading}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                        size='large'
                        multiline={true}
                    />
                    ) : (
                    <TouchableOpacity onPress={() => identification()}>
                      <Text style={{color: '#00B0FF', fontSize: 18}}>Identify</Text>
                    </TouchableOpacity>
                    )}
                </View>
              {message}
              </ScrollView>
            </KeyboardAvoidingView>
            {isConnected === false ? (
              <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
            ) : null }
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

    scrollView: {
      flexGrow: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width
  },

    tokenContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    helpView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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
        fontWeight: '200',
        textAlign: 'center',
        marginTop: 15
    }
  
});

export default Identification;