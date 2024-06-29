import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Boton from "../components/Boton";
import { useAccount } from "../components/ContextoCuenta";
import { auth, db } from "../AppLogin/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Home = () => {
    const navigation = useNavigation();
    const { selectedAccount, setSelectedAccount } = useAccount();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "users", user.uid);

            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setSelectedAccount(data.ganache);
                        console.log("Documento encontrado:", data);
                    } else {
                        console.log("No se ha encontrado documento");
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener documento:", error);
                });
        } else {
            console.log("Usuario no verificado");
        }
    }, [selectedAccount]);



    return (
        <View style={styles.container}>

            <Boton
                texto="Crear Contrato"
                onPress={() => navigation.navigate("CreateContract")}
                estiloBoton={
                    {
                        borderRadius: 5,
                        marginTop: 0,
                        width: 300,
                    }
                }
            />
            <Boton
                texto="Firmar Contrato"
                onPress={() => navigation.navigate("SignContract")}
                estiloBoton={
                    {
                        borderRadius: 5,
                        marginTop: 10,
                        width: 300,
                    }
                }
            />
            <Boton
                texto="Buscar Contratos"
                onPress={() => navigation.navigate("SearchContract")}
                estiloBoton={
                    {
                        borderRadius: 5,
                        marginTop: 10,
                        width: 300,
                    }
                }
            />
            <Boton
                texto="Mis Contratos"
                onPress={() => navigation.navigate("ShowContract")}
                estiloBoton={
                    {
                        borderRadius: 5,
                        marginTop: 10,
                        width: 300,
                    }
                }
            />
        </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
