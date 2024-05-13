import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Country, City } from 'country-state-city';

const CountryCityPicker = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        // Cargar todos los países al iniciar el componente
        const countryList = Country.getAllCountries();
        setCountries(countryList);
        // Si deseas preseleccionar un país, puedes hacerlo aquí
        if (countryList.length > 0) {
            const initialCountryCode = countryList[0].isoCode;
            setSelectedCountry(initialCountryCode);
            setCities(City.getCitiesOfCountry(initialCountryCode));
        }
    }, []);

    useEffect(() => {
        // Cargar las ciudades cuando cambie el país seleccionado
        if (selectedCountry) {
            const citiesList = City.getCitiesOfCountry(selectedCountry);
            setCities(citiesList);
            // Resetea la ciudad seleccionada si cambia el país
            if (citiesList.length > 0) {
                setSelectedCity(citiesList[0].name);
            } else {
                setSelectedCity('');
            }
        }
    }, [selectedCountry]);

    return (
        <View style={{ padding: 20 }}>
            <Text>Select Country:</Text>
            <Picker
                selectedValue={selectedCountry}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedCountry(itemValue);
                }}>
                {countries.map((country, index) => (
                    <Picker.Item key={index} label={country.name} value={country.isoCode} />
                ))}
            </Picker>

            <Text>Select City:</Text>
            <Picker
                selectedValue={selectedCity}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedCity(itemValue);
                }}>
                {cities.map((city, index) => (
                    <Picker.Item key={index} label={city.name} value={city.name} />
                ))}
            </Picker>
        </View>
    );
}

export default CountryCityPicker;