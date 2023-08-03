import React,  { useState, } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet, View, Text, Button, TextInput, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const AddEvent = ({route, navigation}) => {

    const { token, image, username } = route.params;
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [location, setLocation] = useState("");
    const [street, setStreet] = useState("");
    const [openStart, setOpenStart] = useState(false);
    const [start, setStart] = useState(new Date());
    const [openDeadline, setOpenDeadline] = useState(false);
    const [deadline, setDeadline] = useState(new Date());
    const [message, setMessage] = useState('');

    const add = async () => {
      if(name.trim().length != 0 && type.trim().length != 0 && status.trim().length != 0 && location.trim().length != 0 && street.trim().length != 0) {
       await fetch('http://192.168.0.17/EventRain/api/events/create.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Token': token
        },
        body: JSON.stringify({
          eventName: name,
          eventType: type,
          eventStatus: status,
          eventLocation: location,
          eventStreet: street,
          eventStart: start,
          eventDeadline: deadline

        })
        }).then(response => {
          if(response.ok) {
            response.json().then(data => {
              setMessage(data.message)
              navigation.navigate("Home", {
                token: token,
                image: image,
                username: username
            })
            })
            .catch(err => console.log(err))
          }
          else {
            setMessage(
              <View style={styles.errorMessage}>
                  <Image
                  source={require('./assets/caution.png')}
                  style={{ width: 20, height: 20 }}
                  />
                  <Text style={{ color: '#D77165', marginLeft: 5 }}>Something went wrong</Text>
              </View>
            );
          }
          setTimeout(() => {
            setMessage('');
          }, 1500);
        })
        .catch(err => console.log(err))
      }
      else {
        setMessage(
          <View style={styles.errorMessage}>
              <Image
              source={require('./assets/caution.png')}
              style={{ width: 20, height: 20 }}
              />
              <Text style={{ color: '#D77165', marginLeft: 5 }}>Please fill all fields</Text>
          </View>
        );
      }
      setTimeout(() => {
        setMessage('');
      }, 1500);
    }

      const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate;
        setOpenStart(false);
        setStart(currentDate);
      };

      const onChangeDeadline = (event, selectedDate) => {
        const currentDate = selectedDate;
        setOpenDeadline(false);
        setDeadline(currentDate);
      };

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Image source={require('./assets/createEvent.png')} style={{width: 150, height: 150, top: 10}}/>
          <View style={styles.createEventPageView}>
            <View style={styles.createEventView}>
                <Text style={{fontWeight: '200'}}>CREATE YOUR OWN EVENT</Text>
            </View>
            <View style={styles.errorMsgView}>
              <Text style={{ color: '#D77165' }}>{message}</Text>
            </View>
               <View style={styles.inputView}>
                  <TextInput
                    style={styles.input}
                    placeholder="Event's name"
                    onChangeText={(name) => setName(name)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Event's status"
                    onChangeText={(status) => setStatus(status)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Event's type"
                    onChangeText={(type) => setType(type)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Event's location"
                    onChangeText={(location) => setLocation(location)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Event's street"
                    onChangeText={(street) => setStreet(street)}
                  />
                    <Button onPress={() => setOpenStart(true)} title="Pick the start date of event" />
                    {openStart && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={start}
                        mode={'date'}
                        is24Hour={true}
                        onChange={onChangeStart}
                      />
                    )}
                    <Button onPress={() => setOpenDeadline(true)} title="Pick the deadline of event" />
                    {openDeadline && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={deadline}
                        mode={'date'}
                        is24Hour={true}
                        onChange={onChangeDeadline}
                      />
                    )}
                </View>
            </View>
            <TouchableOpacity style={styles.createBtn} onPress={() =>  add() }>
                <View style={styles.createBtnView}>
                    <Text style={{ color: '#000', fontSize: 18, paddingLeft: 5, fontWeight: '300'}}>Create</Text>
                </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
    );
  };
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width
  },

  createEventView: {
    alignItems: 'flex-start', 
    display: 'flex',
    justifyContent: 'center',
    padding: 10,
    marginTop: 15
  },

  errorEmptyField: {
    fontSize: 15,
    color: '#f00',
  },

  createEventPageView: {
    width: '100%'
  },

  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 0.5,
    width: '60%'
  },

  inputView: {
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'flex-start',  
    justifyContent: 'center',
    marginBottom: 20
  },

  createBtnView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  createBtn: {
    //backgroundColor: '#454B53',
    borderWidth: 1,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 10,
    paddingLeft: 20,
    paddingRight: 20
  },

  errorMessage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  errorMsgView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  }

});

export default AddEvent;
