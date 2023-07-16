import React from 'react';
import Login from './Login';
import Home from './Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AddEvent from './AddEvent';
import Profile from './Profile';
import Notifications from './Notifications';
import AccountDetails from './AccountDetails';
import InvitationDetail from './InvitationDetail';
import Token from './Token';
import Password from './Password';

const Stack = createNativeStackNavigator();

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} options={{gestureEnabled: false, headerShown: true, headerLeft: () => <></>}}/>
        <Stack.Screen name="AddEvent" component={AddEvent} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Account Details" component={AccountDetails} />
        <Stack.Screen name="Invitation Detail" component={InvitationDetail} />
        <Stack.Screen name="Token" component={Token} />
        <Stack.Screen name="Password" component={Password} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
