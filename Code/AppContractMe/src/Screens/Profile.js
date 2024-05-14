import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import { Country, City } from "country-state-city";
import Boton from "../components/Boton";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../AppLogin/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userData } = route.params;
    const [selectedCountryCode, setSelectedCountryCode] = useState(userData.paisCode || "");
    const [selectedCountryName, setSelectedCountryName] = useState(userData.pais || "");
    const [selectedCity, setSelectedCity] = useState(userData.ciudad || "");
    const [address, setAddress] = useState(userData.direccion || "");
    const [phone, setPhone] = useState(userData.telefono || "");
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);

    //carga valores actuales de pais y ciudad del usuario 
    useEffect(() => {
        const loadCountries = async () => {
            const countryList = Country.getAllCountries();
            setCountries(countryList);

            if (userData.paisCode) {
                const userCountry = countryList.find(contry => contry.isoCode === userData.paisCode);

                if (userCountry) {
                    setSelectedCountryCode(userCountry.isoCode);
                    setSelectedCountryName(userCountry.name);
                    const citiesList = await City.getCitiesOfCountry(userCountry.isoCode);
                    setCities(citiesList);
                    const userCity = citiesList.find(city => city.name === userData.ciudad);

                    if (userCity) {
                        setSelectedCity(userCity.name);
                    }
                }
            }
        };
        loadCountries();
    }, [userData.paisCode, userData.ciudad]);

    // Actualiza el campo ciudades cuando se cambia el pais
    useEffect(() => {
        if (selectedCountryCode !== userData.paisCode) {
            const userCountry = countries.find(country => country.isoCode === selectedCountryCode);
            console.log("Nuevo pais Seleccionado:", userCountry);

            if (userCountry) {
                setSelectedCountryName(userCountry.name);

                const updateCities = async () => {
                    const citiesList = await City.getCitiesOfCountry(selectedCountryCode);
                    setCities(citiesList);
                    if (citiesList.legth > 0) {
                        setSelectedCity(citiesList[0].name);
                    } else {
                        setSelectedCity("");
                    }
                };
                updateCities();
            }
        }
    }, [selectedCountryCode]);


    const saveProfile = async () => {
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const updatedData = {
                pais: selectedCountryName,
                paisCode: selectedCountryCode,
                ciudad: selectedCity,
                direccion: address,
                telefono: phone,
            };

            try {
                await updateDoc(userRef, updatedData);
                console.log("Perfil actualizado");
                alert("Perfil actualizado");
                navigation.navigate("Profile", { userData: userData })
            } catch (error) {
                console.error("Error al actualizar:", error);
            }
        } else {
            console.log("No se encuentra el user");
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Seleccionar país:</Text>
            <Picker
                style={styles.picker}
                selectedValue={selectedCountryCode}
                onValueChange={(itemValue) => {
                    setSelectedCountryCode(itemValue);
                }}>

                {countries.map((country) => (
                    <Picker.Item key={country.isoCode} label={country.name} value={country.isoCode} />
                ))}
            </Picker>

            <Text style={styles.text}>Seleccionar ciudad:</Text>
            <Picker
                style={styles.picker}
                selectedValue={selectedCity}
                onValueChange={(itemValue) => {
                    setSelectedCity(itemValue);
                }}>
                {cities.map((city, index) => (
                    <Picker.Item key={index} label={city.name} value={city.name} />
                ))}
            </Picker>

            <Text style={styles.text}>Dirección:</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                maxLength={50}
            />

            <Text style={styles.text}>Teléfono:</Text>
            <TextInput
                style={styles.input}
                value={phone.toString()}
                onChangeText={setPhone}
                keyboardType="numeric"
                maxLength={9}
            />

            <Boton
                texto="Guardar perfil"
                onPress={saveProfile}
                estiloBoton={
                    {
                        borderRadius: 5,
                        marginTop: 25,
                    }
                }
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginTop: 8,
        padding: 40
    },
    input: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        backgroundColor: "white",
        borderColor: "#B6B6B6",
    },
    picker: {
        backgroundColor: "white",
        shadowColor: "#000",
        elevation: 4,
    },
    text: {
        marginTop: 20,
        fontSize: 17,
        color: "black",
    },
});

export default Profile;
