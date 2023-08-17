import { StyleSheet, View, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native';

const LandingPage = ({route, navigation}) => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.splashContainer}>
                <Image
                    source={require('./assets/splashScreen1.png')}
                    style={{ width: 300, height: 300 }}
                />
                <Text style={{fontSize: 38, fontWeight: 'bold', color: '#00B0FF'}}>Find & Plan your event.</Text>
                <Text style={{fontSize: 15, fontWeight: '200', lineHeight: 25}}>Whether it's private parties, about weddings, birthdays, company gatherings, whatever.</Text>
                <TouchableOpacity style={styles.getStarted} onPress={() => navigation.navigate('Login')}>
                    <Text style={{fontSize: 20, fontWeight: '400', color: '#00B0FF'}}>Get Started</Text>
                    <Image
                        source={require('./assets/splashScreenArrow.png')}
                        style={{ width: 30, height: 30, marginLeft: 5}}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
  );
};
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    splashContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        padding: 15
    },

    getStarted: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    }
});

export default LandingPage;