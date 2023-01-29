import React,  { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, SafeAreaView, FlatList, Modal, TextInput } from 'react-native';

const Home = ({route, navigation}) => {

    const { token } = route.params;
    const [data, setData] = useState([]);
    const [message, setMessage] = useState(''); 
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});

    useEffect(() => {
      list();
  });

    const list = async () => {
       await fetch('http://192.168.0.17/EventRain/api/events/read.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Token': token
        }
        }).then(response => {
          if(response.ok) {
            response.json()
            .then(data => {
              setData(data)
              setMessage("Events retrieved")
            })
            .catch(err => console.log(err))
          }
          else {
            setMessage('Something went wrong retrieving the events')
          }
        })
        .catch(err => console.log(err))
      }

      const update = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/update.php?eventId=' + modalData.event_id, {
         method: 'PUT',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Token': token
         },
         body: JSON.stringify(modalData)
         }).then(response => {
           if(response.ok) {
              response.json().then((data)=>
              {
                setMessage(data.message)
                setModalVisible(false)
                list()
              })
              .catch(err => console.log(err))
           }
           else {
             setMessage('Something went wrong while updating the event')
           }
         })
         .catch(err => console.log(err))
       }

    const logout = async () => {
      await fetch('http://192.168.0.17/EventRain/api/logout.php', {
        method: 'POST',
        headers: {
          'Token': token
        }
      })
      .then((response) => {
        if(response.ok) {
          navigation.navigate('Login')
        }
        else {
          setMessage('Something went wrong')
        }
      })
      .catch(err => console.log(err))
    }

    const deleteEvent = async () => {
      await fetch('http://192.168.0.17/EventRain/api/events/delete.php?eventId=' + modalData.event_id, {
        method: 'DELETE',
        headers: {
          'Token': token
        }
      })
      .then((response) => {
        if(response.ok) {
          setModalVisible(false)
          list()
          setMessage("Event deleted")
        }
        else {
          setMessage('Something went wrong while deleting')
        }
      })
      .catch(err => console.log(err))
    }

    return (
      <SafeAreaView style={styles.container}>
      <View>
      <FlatList
        data={data}
        renderItem={({item}) => <Text onPress={() => {setModalData(item); setModalVisible(true)}} style={styles.event}>{item.event_name}</Text>}      
      />
      <Button onPress={() => logout()}
          title="Logout"
      />
      <Button onPress={() => navigation.navigate("AddEvent", {
                        token: token
                    })}
          title="Add event"
      />
      <Text>{message}</Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Name</Text>
            <TextInput
              style={styles.input}
              value={modalData.event_name}
              onChangeText={(name) => modalData.event_name = name}
            />
            <Text style={styles.modalText}>Status</Text>
            <TextInput
              style={styles.input}
              value={modalData.event_status}
              onChangeText={(status) => modalData.event_status = status}
            />
            <Text style={styles.modalText}>Type</Text>
            <TextInput
              style={styles.input}
              value={modalData.event_type}
              onChangeText={(type) => modalData.event_type = type}
            />
            <Text style={styles.modalText}>Location</Text>
            <TextInput
              style={styles.input}
              value={modalData.event_location}
              onChangeText={(location) => modalData.event_location = location}
            />
            <Text style={styles.modalText}>Street</Text>
            <TextInput
              style={styles.input}
              value={modalData.event_street}
              onChangeText={(street) => modalData.event_street = street}
            />

            <Button onPress={() => update()}
              title="Update"
            />
            <Button onPress={() => deleteEvent()}
              title="Delete"
            />
            <Button onPress={() => setModalVisible(false)}
              title="Close"
            />
          </View>
        </View>
      </Modal>
      </View>
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

  event: {
    backgroundColor: 'lightgrey',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  name: {
    fontSize: 32,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: 500,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Home;
