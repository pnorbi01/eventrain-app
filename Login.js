import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ActivityIndicator, Image, ScrollView } from 'react-native';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const login = async () => {
    if (username.trim().length != 0 && password.trim().length != 0) {
      startLoading();

        await fetch('http://192.168.0.17/EventRain/api/login.php', {
          method: 'POST',
          body: JSON.stringify({
            username: username,
            password: password,
          }),
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
          },
        })
          .then((response) => {
            setLoading(false)
            if(response.ok) {
                data = response.json()
                .then(data => {
                    navigation.navigate('Home', {
                        token: data.token,
                        username: data.username,
                        email: data.email,
                        image: data.image
                    })
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
                  <Text style={{color: '#D77165', marginLeft: 5}}>Invalid username or password</Text>
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
                <Text style={{color: '#D77165', marginLeft: 5}}>Invalid username or password</Text>
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
          <Text style={{color: '#D77165', marginLeft: 5}}>Please fill all required fields</Text>
        </View>
      );
      setTimeout(() => {
            setMessage(false);
      }, 1500);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <View style={styles.companyName}>
          <Image 
            source={require('./assets/logo.png')}
            style={{width: 100, height: 100}}
          />
          <Text style={{fontWeight: '800', fontSize: 25, color: '#274C77'}}>
            EventRain
          </Text>
          <Text style={{top: 0}}>
            The best place for event organization.
          </Text>
        </View>
        <View style={styles.loginBody}>
          <Text style={{fontWeight: '300', fontSize: 15}}>Login with an exisiting account!</Text>
          {loading ? (
            <ActivityIndicator
              visible={loading}
              textContent={'Loading...'}
              textStyle={styles.spinnerTextStyle}
              size='large'
            />
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Username"
                defaultValue={username}
                onChangeText={(username) => setUsername(username)}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                defaultValue={password}
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
              />
              <View style={styles.login}>
                <Image 
                source={require('./assets/login.png')}
                style={{width: 20, height: 20}}
                />
                <Button onPress={() => login()}
                  title="Login"
                  color={'#274C77'}
                />
              </View>
              <Text style={{color: '#D77165'}}>{message}</Text>
              <Text>{token}</Text>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({

  input: {
    padding: 10,
    marginVertical: 8,
    height: 50,
    width: 250,
    backgroundColor: '#FFF',
    borderBottomWidth: 0.5
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  spinnerTextStyle: {
    color: '#FFF',
  },

  companyName: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '100%'
  },

  login: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  errorMessage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  loginBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 70
  }

});

export default Login;
