import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-root-toast';

const CheckInternet = () => {
    const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Toast.show(
        <View style={styles.toastContainer}>
          <Image source={require('../assets/images/noInternet.png')} style={{ width: 25, height: 25 }} />
          <Text style={styles.toastText}>No internet connection.</Text>
        </View>,
        {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: false,
          animation: true,
          hideOnPress: false,
          delay: 0,
          backgroundColor: 'rgba(255, 255, 255, 0)',
          opacity: 1
        }
      );
    } 
  }, [isConnected]);

  return null;
};

const styles = {
  toastContainer: {
    padding: 10,
    backgroundColor: '#D77165',
    borderRadius: 18,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  toastText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 7,
  },
};

export default CheckInternet;