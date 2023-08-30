import React,  { useState, } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet, View, Text, Button, TextInput, Image, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Card, Tooltip } from 'react-native-elements';
import CheckInternet from './CheckInternet';

const { width } = Dimensions.get('window');

const AddEvent = ({route, navigation}) => {

    const { token, image, username } = route.params;
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [location, setLocation] = useState("");
    const [street, setStreet] = useState("");
    const [openStart, setOpenStart] = useState(false);
    const [start, setStart] = useState(new Date());
    const [openDeadline, setOpenDeadline] = useState(false);
    const [deadline, setDeadline] = useState(new Date());
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('public');
    const [inputFields, setInputFields] = useState([]);
    const [gifts, setGifts] = useState(Array(inputFields.length).fill(''));
    const [isConnected, setIsConnected] = useState(false);

    const add = async () => {
      if(name.trim().length != 0 && type.trim().length != 0 && status.trim().length != 0 && location.trim().length != 0 && street.trim().length != 0) {
       await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/events/create.php', {
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
          eventStart: start.toISOString().slice(0, 19).replace('T', ' '),
          eventDeadline: deadline.toISOString().slice(0, 19).replace('T', ' '),
          gifts: gifts

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
                  source={require('../assets/images/caution.png')}
                  style={{ width: 20, height: 20 }}
                  />
                  <Text style={{ color: '#FFF', marginLeft: 5 }}>Something went wrong</Text>
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
              source={require('../assets/images/caution.png')}
              style={{ width: 20, height: 20 }}
              />
              <Text style={{ color: '#FFF', marginLeft: 5 }}>Please fill all fields</Text>
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

      const addInputField = () => {
        setInputFields([...inputFields, ""]);
      };
    
      const removeInputField = (index) => {
        const updatedFields = [...inputFields];
        updatedFields.splice(index, 1);
        setInputFields(updatedFields);
      };

    return (
      <View style={styles.container}>
          <KeyboardAvoidingView style={{ flexGrow: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled keyboardVerticalOffset={1}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              <View style={styles.createEventPageView}>
                <View style={styles.createEventView}>
                  <View style={styles.noteText}>
                      <Image source={require('../assets/images/note.png')} style={{ width: 35, height: 35 }} />
                      <Text style={{ textAlign: 'left', left: 5 }}>Gifts are not required part of event creating. Please fill out the fields correctly as instructed in the guide. To see the guide tap on the info icon.</Text>
                  </View>
                  <Text>{message}</Text>
                </View>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputView}>
                      <TextInput
                        style={styles.input}
                        placeholder="Event's name"
                        onChangeText={(name) => setName(name)}
                      />
                      <Tooltip
                        popover={<Text>e.g. My Birthday</Text>}
                        backgroundColor="#F5CF87"
                        withOverlay={false}>
                        <Image source={require('../assets/images/info.png')} style={{ width: 23, height: 23 }} />
                      </Tooltip>
                    </View>
                      <View style={styles.radioBtnView}>
                        <Text style={{fontSize: 18, marginBottom: 10}}>Select the status of your event</Text>
                        <RadioButton.Group onValueChange={newValue => setStatus(newValue)} value={status}>
                          <RadioButton.Item label="Public" value="public" />
                          <RadioButton.Item label="Private" value="private" />
                        </RadioButton.Group>
                      </View>
                      <View style={styles.inputView}>
                        <TextInput
                          style={styles.input}
                          placeholder="Event's type"
                          onChangeText={(type) => setType(type)}
                        />
                        <Tooltip
                          popover={<Text>e.g. Birthday</Text>}
                          backgroundColor="#F5CF87"
                          withOverlay={false}>
                        <Image source={require('../assets/images/info.png')} style={{ width: 23, height: 23 }} />
                        </Tooltip>
                      </View>
                      <View style={styles.inputView}>
                        <TextInput
                          style={styles.input}
                          placeholder="Event's location"
                          onChangeText={(location) => setLocation(location)}
                        />
                        <Tooltip
                          popover={<Text>e.g. Magyarország, Budapest</Text>}
                          backgroundColor="#F5CF87"
                          withOverlay={false}
                          width={210}>
                        <Image source={require('../assets/images/info.png')} style={{ width: 23, height: 23 }} />
                        </Tooltip>
                      </View>
                      <View style={styles.inputView}>
                        <TextInput
                          style={styles.input}
                          placeholder="Event's street"
                          onChangeText={(street) => setStreet(street)}
                        />
                        <Tooltip
                          popover={<Text>e.g. Margit híd</Text>}
                          backgroundColor="#F5CF87"
                          withOverlay={false}>
                        <Image source={require('../assets/images/info.png')} style={{ width: 23, height: 23 }} />
                        </Tooltip>
                      </View>
                        <Button onPress={() => setOpenStart(true)} title="Pick the start date of event" />
                        {openStart && (
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={start}
                            mode={'datetime'}
                            is24Hour={true}
                            display="default"
                            onChange={onChangeStart}
                          />
                        )}
                        <Button onPress={() => setOpenDeadline(true)} title="Pick the deadline of event" />
                        {openDeadline && (
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={deadline}
                            mode={'datetime'}
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDeadline}
                          />
                        )}
                    </View>
                    <View style={styles.giftContainer}>
                      <Button title="Add Gift" onPress={addInputField} />
                      {inputFields.map((value, index) => (
                        <Card key={index} containerStyle={{ padding: 10}}>
                          <TextInput
                            placeholder={`Gift ${index + 1}`}
                            value={value}
                            onChangeText={(text) => {
                              const updatedFields = [...inputFields];
                              updatedFields[index] = text;
                              setInputFields(updatedFields);

                              const updatedGifts = [...gifts];
                              updatedGifts[index] = text;
                              setGifts(updatedGifts);
                            }}
                          />
                          <Button title="Remove gift" color="#D77165" onPress={() => removeInputField(index)} />
                        </Card>
                      ))}
                    </View>
                </View>
                <View style={styles.createButton}>
                  <Button onPress={() => add()} title="Create event" color={'#699F4C'} />
                  <Image source={require('../assets/images/createEventArrow.png')} style={{width: 18, height: 18}} />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
            {isConnected === false ? (
              <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
            ) : null }
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
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width
  },

  createEventView: {
    alignItems: 'center', 
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

  inputContainer: {
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'flex-start',  
    justifyContent: 'center',
    marginBottom: 20
  },

  inputView: {
    display: 'flex',
    flexDirection: 'row', 
    alignItems: 'center',  
    justifyContent: 'space-between'
  },

  createButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  errorMessage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#D77165',
    borderRadius: 20,
    marginTop: 10
  },

  radioBtnView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    paddingLeft: 13,
    marginTop: 15
  },

  giftContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15
  },

  noteText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingRight: 30,
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#F5CF87',
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 20
  }

});

export default AddEvent;

/*

                  <TextInput
                    style={styles.input}
                    placeholder="Event's status"
                    onChangeText={(status) => setStatus(status)}
                  />*/
