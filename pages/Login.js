import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity
} from 'react-native'
import CheckInternet from './CheckInternet';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const startLoading = () => {
    setLoading(true)
  }

  const login = async () => {
    if (username.trim().length != 0 && password.trim().length != 0) {
      startLoading()

      await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/login.php', {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password
        }),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json'
        }
      })
        .then(response => {
          setLoading(false)
          if (response.ok) {
            data = response
              .json()
              .then(data => {
                navigation.navigate('Home', {
                  token: data.token,
                  username: data.username,
                  email: data.email,
                  image: data.image
                })
              })
              .catch(err => console.log(err))
          } else {
            setMessage(
              <View style={styles.errorMessage}>
                <Image
                  source={require('../assets/images/caution.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={{ color: '#FFF', marginLeft: 5 }}>
                  Invalid username or password
                </Text>
              </View>
            )
            setTimeout(() => {
              setMessage(false)
            }, 1500)
          }
        })
        .catch(() => {
          setLoading(false)
          setMessage(
            <View style={styles.errorMessage}>
              <Image
                source={require('../assets/images/caution.png')}
                style={{ width: 20, height: 20 }}
              />
              <Text style={{ color: '#FFF', marginLeft: 5 }}>
                Error. Check your internet connectivity.
              </Text>
            </View>
          )
          setTimeout(() => {
            setMessage(false)
          }, 1500)
        })
    } else {
      setMessage(
        <View style={styles.errorMessage}>
          <Image
            source={require('../assets/images/caution.png')}
            style={{ width: 20, height: 20 }}
          />
          <Text style={{ color: '#FFF', marginLeft: 5 }}>
            Please fill all required fields
          </Text>
        </View>
      )
      setTimeout(() => {
        setMessage(false)
      }, 1500)
    }
  }

  return (
    <View style={styles.container}>
        <View style={styles.companyName}>
          <Image
            source={require('../assets/images/loginImage.png')}
            style={{ width: 200, height: 200 }}
          />
          <Text style={{ fontWeight: '800', fontSize: 25, color: '#00B0FF' }}>
            EventRain
          </Text>
          <Text style={{ top: 0 }}>The best place for event organization.</Text>
        </View>
        <View style={styles.loginBody}>
          <Text style={{ fontWeight: '300', fontSize: 15 }}>
            Login with an exisiting account!
          </Text>
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
                placeholder='Username'
                defaultValue={username}
                onChangeText={username => setUsername(username)}
              />
              <TextInput
                style={styles.input}
                placeholder='Password'
                defaultValue={password}
                secureTextEntry={true}
                onChangeText={password => setPassword(password)}
              />
              <TouchableOpacity style={styles.login} onPress={() => login()}>
                <Image
                  source={require('../assets/images/login.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={{ color: '#274C77', fontSize: 18, marginLeft: 5 }}>
                  Login
                </Text>
              </TouchableOpacity>
              <Text>{message}</Text>
            </>
          )}
        </View>
        {isConnected === false ? (
          <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
        ) : null }
    </View>
  )
}

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
    justifyContent: 'flex-start'
  },

  spinnerTextStyle: {
    color: '#FFF'
  },

  companyName: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
    marginTop: 20
  },

  login: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
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

  loginBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 70
  }
})

export default Login
