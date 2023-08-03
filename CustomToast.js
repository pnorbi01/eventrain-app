import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const CustomToast = ({ text }) => {
  return (
    <View style={styles.toastContainer}>
    <Image source={require('./assets/copied.png')} style={{ width: 25, height: 25 }} />
      <Text style={styles.toastText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    padding: 10,
    backgroundColor: '#2C3E50',
    borderRadius: 18,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 7
  },
});

export default CustomToast;