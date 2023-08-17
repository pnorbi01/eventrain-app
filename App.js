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
import Identification from './Identification';
import EventDetails from './EventDetails';
import ReservedGifts from './ReservedGifts';
import Wishlist from './Wishlist';
import Guestlist from './Guestlist';
import MyGuestlist from './MyGuestlist';
import LandingPage from './LandingPage';


const Stack = createNativeStackNavigator();

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Landing Page' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Landing Page" component={LandingPage} />
        <Stack.Screen name="Login" component={Login} options={{gestureEnabled: false, headerLeft: () => <></>}}/>
        <Stack.Screen name="Home" component={Home} options={{gestureEnabled: false, headerShown: false, headerLeft: () => <></>}}/>
        <Stack.Screen name="Create Event" component={AddEvent} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Account Details" component={AccountDetails} />
        <Stack.Screen name="Invitation Detail" component={InvitationDetail} />
        <Stack.Screen name="Token" component={Token} />
        <Stack.Screen name="Password" component={Password} />
        <Stack.Screen name="Identification" component={Identification} />
        <Stack.Screen name="Event Details" component={EventDetails} />
        <Stack.Screen name="Reserved Gifts" component={ReservedGifts} />
        <Stack.Screen name="Wishlist" component={Wishlist} />
        <Stack.Screen name="Guestlist" component={Guestlist} />
        <Stack.Screen name="My Guestlist" component={MyGuestlist} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
