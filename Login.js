import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ActivityIndicator } from 'react-native';

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
                        token: data.token
                    })
                })
                .catch(err => console.log(err));
            }
            else {
                setMessage('Invalid username or password');
            }
            }
            )
          .catch(() => {
            setLoading(false)
            setMessage('Invalid username or password');
        });
    }
    else {
      setMessage('Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text>
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
          <Button onPress={() => login()}
            title="Login"
          />
          <Text>{message}</Text>
          <Text>{token}</Text>
        </>
      )}
      <Text style={styles.footerText}>
        EventRain
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({

  input: {
    padding: 10,
    marginVertical: 15,
    borderWidth: 2,
    height: 50,
    width: 250,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    bottom: -200,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});

export default Login;
