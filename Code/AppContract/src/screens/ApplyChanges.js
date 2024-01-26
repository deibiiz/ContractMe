import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { web3, MyContract1 } from '../ether/web3.js';
import { useNavigation } from '@react-navigation/native';
import Boton from '../components/Boton.js';

const ContractAlertScreen = ({ route }) => {
    const { contractDetails } = route.params;
    const navigation = useNavigation();
    console.log(contractDetails.newIsPaused);



    const rejectChanges = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            const receipt = await MyContract1.methods.rejectChange(contractDetails.tokenId).send({ from: accounts[1] });
            console.log("Transacción completada:", receipt);
            navigation.navigate("Home1");
        } catch (error) {
            console.error("Error al rechazar los cambios:", error);
            alert('Error al rechazar los cambios.');
        }
    };

    const acceptChanges = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            const receipt = await MyContract1.methods.applyChange(contractDetails.tokenId).send({ from: accounts[1] });
            console.log("Transacción completada:", receipt);
            navigation.navigate("Home1");
        } catch (error) {
            console.error("Error al aceptar los cambios:", error);
            alert('Error al aceptar los cambios.');
        }
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.titlePrincipal}>Nuevos términos del contrato</Text>

                <View style={styles.block}>
                    <Text style={styles.title}>Título del contrato</Text>
                    <Text>{contractDetails.title}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Cuenta del empleador</Text>
                    <Text>{contractDetails.employer}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Cuenta del trabajador</Text>
                    <Text>{contractDetails.worker}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Salario</Text>
                    <Text>{contractDetails.newSalary} ether</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Descripción</Text>
                    <Text>{contractDetails.newDescription}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Fechas del Contrato</Text>
                    <Text>Inicio: {contractDetails.startDate}</Text>
                    <Text>Fin: {contractDetails.newEndDate}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Estado del Contrato</Text>
                    <Text>{contractDetails.isFinished ? 'Finalizado' : contractDetails.newIsPaused ? 'Pausado' : 'Activo'}</Text>
                </View>
                <View style={{ width: '85%', marginTop: 15, alignSelf: 'center' }}>
                    <>
                        <Boton
                            texto="Aceptar cambios"
                            onPress={() => { acceptChanges() }}
                            estiloBoton={{
                                width: "100%",
                                borderRadius: 8,
                                marginBottom: 5,
                            }}
                            estiloTexto={{
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                        />
                        <Boton
                            texto="Rechazar cambios"
                            onPress={() => { rejectChanges() }}
                            estiloBoton={{
                                width: "100%",
                                borderRadius: 8,
                                backgroundColor: "#F84343",
                            }}
                            estiloTexto={{
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                        />
                    </>
                </View>
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 27,
        marginBottom: 27,
    },
    block: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 10,
        width: '85%',
    },
    titlePrincipal: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },

});

export default ContractAlertScreen;
