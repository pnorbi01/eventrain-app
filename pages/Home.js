import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CheckInternet from './CheckInternet';

const Home = ({ route, navigation }) => {
  const { token, username, email, image } = route.params;
  const [data, setData] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [publicEvents, setPublicEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      list()
      readPublicEvents()
      listUnreadNotifications()
    }, [])
  )

  const list = async () => {
    await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/events/read.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: token
      }
    })
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then(data => {
              setData(data)
              setMessage('Events retrieved')
            })
            .catch(err => console.log(err))
        } else {
          setMessage('Something went wrong retrieving the events')
        }
      })
      .catch(err => console.log(err))
  }

  const readPublicEvents = async () => {
    await fetch('https://printf.stud.vts.su.ac.rs/EventRain/api/events/read-public-events.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: token
      }
    })
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then(data => {
              setPublicEvents(data)
              setMessage('Public events retrieved')
            })
            .catch(err => console.log(err))
        } else {
          setMessage('Something went wrong retrieving the events')
        }
      })
      .catch(err => console.log(err))
  }

  const listUnreadNotifications = async () => {
    await fetch(
      'https://printf.stud.vts.su.ac.rs/EventRain/api/events/unread-notifications.php',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Token: token
        }
      }
    )
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then(data => {
              setUnreadNotifications(data.unreadNotifications)
            })
            .catch(err => console.log(err))
        } else {
          setMessage('Something went wrong retrieving notifications')
        }
      })
      .catch(err => console.log(err))
  }

  function compareDates(targetDateString) {
    const targetDate = new Date(targetDateString.replace(/-/g, '/'));
    const currentDate = new Date();

    if (currentDate.getTime() > targetDate.getTime()) {
        return true;
    } else {
        return false;
    }
  }

  const OverviewCards = ({ item }) => {
    return (
      <View style={styles.itemView}>
        <View style={styles.item}>
          <Image
            source={require('../assets/images/ownEvents.png')}
            style={{ width: 200, height: 200 }}
          />
          <View style={styles.itemStatus}>
            <Text style={{ fontSize: 11, color: '#FFF' }}>
              {item.event_status}
            </Text>
          </View>
          {compareDates(item.event_close) === true && (
          <View style={styles.itemClosed}>
            <Text style={{ fontSize: 11, color: '#FFF' }}>
              closed
            </Text>
          </View>
          )}
          <View style={styles.itemDescriptionView}>
            <View style={styles.itemDescription}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                {item.event_name}
              </Text>
              <View style={styles.itemLocation}>
                <Image
                  source={require('../assets/images/location.png')}
                  style={{ width: 17, height: 17 }}
                />
                <Text
                  style={{
                    color: '#00B0FF',
                    fontWeight: '500',
                    fontSize: 11
                  }}
                >
                  {item.event_location}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  const ExploreCards = ({ item }) => {
    return (
      <View style={styles.itemView}>
        <View style={styles.item}>
          <Image
            source={require('../assets/images/publicEvents.png')}
            style={{ width: 160, height: 160, position: 'absolute', bottom: 0 }}
          />
          {compareDates(item.event_close) === true && (
          <View style={styles.itemClosed}>
            <Text style={{ fontSize: 11, color: '#FFF' }}>
              closed
            </Text>
          </View>
          )}
          <View style={styles.itemDescriptionView}>
            <View style={styles.itemDescription}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                {item.event_name}
              </Text>
              <View style={styles.itemLocation}>
                <Image
                  source={require('../assets/images/location.png')}
                  style={{ width: 17, height: 17 }}
                />
                <Text
                  style={{
                    color: '#00B0FF',
                    fontWeight: '500',
                    fontSize: 11
                  }}
                >
                  {item.event_location}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profile}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('Profile', {
              token: token,
              username: username,
              email: email,
              image: image
            })
          }
        >
          <Image
            source={{
              uri:
                'https://printf.stud.vts.su.ac.rs/EventRain/assets/images/profile-pictures/' +
                image
            }}
            style={{ width: 40, height: 40, borderRadius: 50 }}
          />
          {unreadNotifications > 0 && (
            <View style={styles.unreadNotifications}>
              <Text style={{ fontSize: 11, color: '#FFF' }}>
                {unreadNotifications}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <Image
          source={require('../assets/images/logo.png')}
          style={{ width: 40, height: 40 }}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('Create Event', {
              token: token,
              image: image,
              username: username
            })
          }
        >
          <Image
            source={require('../assets/images/navCreate.png')}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.eventListTitle}>
        <Text style={{ fontWeight: '700', fontSize: 25 }}>Overview</Text>
        <Text style={{ fontWeight: '300', fontSize: 11 }}>{data.numberOfEvents} event(s) on record</Text>
      </View>
      {data && data.events && Array.isArray(data.events) && data.events.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../assets/images/noEvents.png')}
            style={{ width: 80, height: 80, marginBottom: 15 }}
          />
          <Text style={styles.noDataText}>You have no events yet!</Text>
        </View>
      ) : (
        <FlatList
          data={data.events}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                navigation.navigate('Event Details', {
                  eventData: item,
                  token: token,
                  image: image,
                  username: username,
                  email: email
                })
              }
            >
              <OverviewCards item={item} />
            </TouchableOpacity>
          )}
        />
      )}
      <View style={styles.eventListTitle}>
        <Text style={{ fontWeight: '700', fontSize: 25 }}>Explore</Text>
        <Text style={{ fontWeight: '300', fontSize: 11 }}>{publicEvents.numberOfPublicEvents} public event(s) on record</Text>
      </View>
      {publicEvents && publicEvents.events && Array.isArray(publicEvents.events) && publicEvents.events.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../assets/images/noEvents.png')}
            style={{ width: 80, height: 80, marginBottom: 15 }}
          />
          <Text style={styles.noDataText}>There is no public events yet!</Text>
        </View>
      ) : (
        <FlatList
          data={publicEvents.events}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                navigation.navigate('Public Event', {
                  eventData: item,
                  token: token,
                  image: image,
                  username: username,
                  email: email
                })
              }
            >
              <ExploreCards item={item} />
            </TouchableOpacity>
          )}
        />
      )}
      {isConnected === false ? (
          <CheckInternet isConnected={isConnected} setIsConnected={setIsConnected} />
      ) : null }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  profile: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },

  noDataContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  noDataText: {
    fontWeight: '200',
    fontSize: 15
  },

  unreadNotifications: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#D77165',
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 50
  },

  eventListTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 15
  },

  itemView: {
    marginLeft: 15,
    paddingBottom: 15
  },

  item: {
    width: 250,
    height: 200,
    backgroundColor: '#FFF',
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  },

  itemDescriptionView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '40%',
    backgroundColor: 'rgba(5, 5, 5, 0.75)',
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },

  itemDescription: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
    padding: 15
  },

  itemLocation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },

  itemStatus: {
    position: 'absolute',
    top: 5,
    right: 5,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 6,
    paddingLeft: 6,
    backgroundColor: '#00B0FF',
    borderRadius: 8
  },

  itemClosed: {
    position: 'absolute',
    top: 5,
    left: 5,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 6,
    paddingLeft: 6,
    backgroundColor: '#D77165',
    borderRadius: 8
  }
})

export default Home
