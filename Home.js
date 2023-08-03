import React,  { useState } from 'react';
import { StyleSheet, View, Text, Button, SafeAreaView, FlatList, Modal, TextInput, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const seperator = () => {
  return (
      <View style={styles.seperator} />
  )
}

const Home = ({route, navigation}) => {

    const { token, username, email, image } = route.params;
    const [data, setData] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [message, setMessage] = useState(''); 
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});

    useFocusEffect(
      React.useCallback(() => {
        list();
        listUnreadNotifications();
        console.log("Home");
      }, [])
    );

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

      const listUnreadNotifications = async () => {
        await fetch('http://192.168.0.17/EventRain/api/events/unread-notifications.php', {
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
              setUnreadNotifications(data.unreadNotifications)
             })
             .catch(err => console.log(err))
           }
           else {
             setMessage('Something went wrong retrieving notifications')
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
      <View style={styles.container}>
        <View style={styles.profile}>
          <TouchableOpacity activeOpacity = { 1 } onPress={() => navigation.navigate("Profile", { token: token, username: username, email: email, image: image })}>
            <Image source={{ uri: 'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/'+image }} style={{ width: 40, height: 40, borderRadius: 50 }} />
              <View style={styles.unreadNotifications}>
                  <Text style={{fontWeight: 'bold', fontSize: 12, color: '#FFF'}}>{unreadNotifications}</Text>
              </View>
          </TouchableOpacity>
          <Image source={require('./assets/logo.png')} style={{width: 40, height: 40}}/>
          <TouchableOpacity activeOpacity = { 1 } onPress={() => navigation.navigate("Create Event", { token: token, image: image, username: username })}>
            <Image source={require('./assets/navCreate.png')} style={{width: 30, height: 30}}/>
          </TouchableOpacity>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', left: 20}}>
          <Text style={styles.titleFlat}>MY EVENTS</Text>
        </View>
        {data.length === 0 ? (
              <View style={styles.noDataContainer}>
                  <Image source={require('./assets/noEvents.png')} style={{width: 80, height: 80, marginBottom: 15}}/>
                  <Text style={styles.noDataText}>You have no events yet!</Text>
              </View>
        ) : (
        <FlatList
          style={styles.eventFlatList}
          data={data}
          renderItem={({item}) => (
          <View style={styles.eventFlatListBody}>
            <TouchableOpacity activeOpacity = { 1 } onPress={() => {setModalData(item); setModalVisible(true)}}>
              <View style={{padding: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  width: '100%'}}>
                <View>
                  <Text onPress={() => {setModalData(item); setModalVisible(true)}} style={styles.event}>{item.event_name}</Text>
                  <View style={styles.eventLocationImg}>
                    <Image source={require('./assets/location.png')} style={{width: 20, height: 20}}/>
                    <Text style={{color: '#A9A9A9'}}>{item.event_location}, {item.event_street}</Text>
                  </View>
                </View>
                <View style={styles.eventStatus}>
                  <Text style={{color: '#FFF'}}>{item.event_status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          )}
          ItemSeparatorComponent={seperator}
        />
        )}
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
              color="#f00"
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
    width: '100%'
  },
  
  event: {
    fontWeight: 'bold',
    fontSize: 15
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  modalView: {
    width: '100%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5
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

  logout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profile: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd'
  },

  user: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
  },

  eventFlatList: {
    width: '100%',
  },

  eventFlatListBody: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },

  seperator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd'
  },

  eventLocationImg: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleFlat: {
    marginTop: 40,
    fontWeight: '200',
    fontSize: 23
  },

  noDataContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

  },

  noDataText: {
    fontWeight: '200',
    fontSize: 15
  },

  unreadNotifications: {
    position: 'absolute',
    right: -10,
    backgroundColor:  'rgba( 199, 38, 38, 0.7 )',
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 50
  },

  eventStatus: {
    backgroundColor: 'rgba( 2, 37, 74, 0.55 )',
    borderRadius: '20',
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 3,
    paddingBottom: 3
  }

});

export default Home;
/*

         <Button onPress={() => navigation.navigate("AddEvent", { token: token })} title="Create event"/>
          <Text>{message}</Text>*/