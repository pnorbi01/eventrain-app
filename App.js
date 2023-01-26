import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ActivityIndicator } from 'react-native';


const App = () => {
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

      try {
        await fetch('http://localhost/eventrain/api/login.php', {
          method: 'POST',
          body: JSON.stringify({
            username: username,
            password: password,
          }),
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setLoading(false);
            setMessage(data.message);
            setToken(data.token);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      catch (error) {
        console.log('Error', error);
      }
    }
    else {
      setMessage('Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
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
            onChangeText={(password) => setPassword(password)}
          />
          <Button onPress={login}
            title="Login"
          />
          <Text>{message}</Text>
          <Text>{token}</Text>
        </>
      )}
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
  spinnerTextStyle: {
    color: '#FFF',
  },
});

export default App;
