import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home screen</Text>
            <Text>Hello, I am Nayan</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccced1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#2d128f',
    },
});