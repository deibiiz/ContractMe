import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function Login({ AutenticarDirecto, AutenticarConHuella, navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={AutenticarDirecto}>
                <Text style={{ marginTop: 180 }}> acceso directo para desarrollo </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
