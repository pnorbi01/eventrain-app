import React,  { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
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

    return (
      <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.profile}>
          <TouchableOpacity activeOpacity = { 1 } onPress={() => navigation.navigate("Profile", { token: token, username: username, email: email, image: image })}>
            <Image source={{ uri: 'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/'+image }} style={{ width: 40, height: 40, borderRadius: 50 }} />
            {unreadNotifications > 0 &&
              <View style={styles.unreadNotifications}>
                  <Text style={{fontSize: 11, color: '#FFF'}}>{unreadNotifications}</Text>
              </View>
            }
          </TouchableOpacity>
          <Image source={require('./assets/logo.png')} style={{width: 40, height: 40}}/>
          <TouchableOpacity activeOpacity = { 1 } onPress={() => navigation.navigate("Create Event", { token: token, image: image, username: username })}>
            <Image source={require('./assets/navCreate.png')} style={{width: 30, height: 30}}/>
          </TouchableOpacity>
        </View>
        <View style={styles.wishlistTitleView}>
            <Text style={{fontWeight: '700', fontSize: 30}}>Overview</Text>
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
            <TouchableOpacity activeOpacity = { 1 } onPress={() => navigation.navigate("Event Details", { eventData: item, token: token, image: image, username: username, email: email })}>
              <View style={{paddingTop: 20, paddingLeft: 15, paddingRight: 15, paddingBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',  width: '100%'}}>
                <View>
                  <Text style={styles.event}>{item.event_name}</Text>
                  <View style={styles.eventLocationImg}>
                    <Image source={require('./assets/location.png')} style={{width: 20, height: 20}}/>
                    <Text style={{color: '#A9A9A9', marginLeft: 3}}>{item.event_location}, {item.event_street}</Text>
                  </View>
                </View>
                {item.event_status === 'public' ? (
                  <View style={styles.eventStatusPublic}>
                    <Text style={{color: '#FFF', fontSize: 12}}>{item.event_status}</Text>
                  </View>
                ) : (
                  <View style={styles.eventStatusPrivate}>
                    <Text style={{color: '#FFF', fontSize: 12}}>{item.event_status}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
          )}
          ItemSeparatorComponent={seperator}
        />
        )}
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

  profile: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd'
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
    right: -5,
    top: -5,
    backgroundColor:  '#D77165',
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 50
  },

  eventStatusPublic: {
    backgroundColor:  '#699F4C',
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 50
  },

  eventStatusPrivate: {
    backgroundColor:  '#D77165',
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 50
  },

  wishlistTitleView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 15
  }

});

export default Home;
/*

         <Button onPress={() => navigation.navigate("AddEvent", { token: token })} title="Create event"/>
          <Text>{message}</Text>*/