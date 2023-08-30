import React from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AddEvent from './pages/AddEvent';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import AccountDetails from './pages/AccountDetails';
import InvitationDetail from './pages/InvitationDetail';
import Token from './pages/Token';
import Password from './pages/Password';
import Identification from './pages/Identification';
import EventDetails from './pages/EventDetails';
import ReservedGifts from './pages/ReservedGifts';
import Wishlist from './pages/Wishlist';
import Guestlist from './pages/Guestlist';
import MyGuestlist from './pages/MyGuestlist';
import LandingPage from './pages/LandingPage';
import PublicEvent from './pages/PublicEvent';
import Map from './pages/Map';
import CheckInternet from './pages/CheckInternet';


const Stack = createNativeStackNavigator();

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Landing Page' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Landing Page" component={LandingPage} />
        <Stack.Screen name="CheckInternet" component={CheckInternet}  options={{gestureEnabled: false, headerLeft: () => <></>}} />
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
        <Stack.Screen name="Public Event" component={PublicEvent} />
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
