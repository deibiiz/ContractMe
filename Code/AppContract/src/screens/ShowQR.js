import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRcode from 'react-native-qrcode-svg';

function ShowQR({ route }) {

  const { tokenId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Escanea este código QR</Text>
      <Text style={styles.instructions}>Al escanear este código QR, se procederá a firmar el contrato con ID: {tokenId} automáticamente.</Text>
      <QRcode
        value={tokenId}
        size={300}
        Color="black"
        backgroundColor="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 27,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 40,
  },
  instructions: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 50,
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 15,
  },
});

export default ShowQR;
