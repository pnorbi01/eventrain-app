import React,  { useState, } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet, View, Text, Button, SafeAreaView, TextInput } from 'react-native';

const AddEvent = ({route, navigation}) => {

    const { token } = route.params;
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
                token: token
            })
            })
            .catch(err => console.log(err))
          }
          else {
            setMessage('Something went wrong retrieving the events')
          }
        })
        .catch(err => console.log(err))
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
      <SafeAreaView style={styles.container}>
      <View>
      <Text style={styles.headingEvent}>
        Create your own event
      </Text>
      <Text>{message}</Text>
      <TextInput
        style={styles.input}
        placeholder="Event name"
        onChangeText={(name) => setName(name)}
      />
      <TextInput
        style={styles.input}
        placeholder="Event status"
        onChangeText={(status) => setStatus(status)}
      />
      <TextInput
        style={styles.input}
        placeholder="Event type"
        onChangeText={(type) => setType(type)}
      />
      <TextInput
        style={styles.input}
        placeholder="Event location"
        onChangeText={(location) => setLocation(location)}
      />
      <TextInput
        style={styles.input}
        placeholder="Event street"
        onChangeText={(street) => setStreet(street)}
      />
      <Button onPress={() => setOpenStart(true)} title="Pick start date" />
      {openStart && (
        <DateTimePicker
          testID="dateTimePicker"
          value={start}
          mode={'date'}
          is24Hour={true}
          onChange={onChangeStart}
        />
      )}
      <Button onPress={() => setOpenDeadline(true)} title="Pick deadline" />
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
      <Button onPress={() => add()}
          title="Create event"
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingEvent: {
    fontSize: 20,
    fontWeight: 'bold',
    top: -30,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default AddEvent;
