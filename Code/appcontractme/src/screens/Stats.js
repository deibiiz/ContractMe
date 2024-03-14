//pantalla que muesta el precio de ethereum actual y una grafica.

import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Stats() {
    const [ethPrice, setEthPrice] = useState(0);
    const [ethPriceHistory, setEthPriceHistory] = useState([]);
    const [euroAmount, setEuroAmount] = useState(1);
    const [ethAmount, setEthAmount] = useState(0);
    const [isEuroToEth, setIsEuroToEth] = useState(true);

    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/coins/ethereum')
            .then(response => response.json())
            .then(data => {
                setEthPrice(data.market_data.current_price.eur);
            });


        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 365);
        fetch(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=eur&from=${startDate.getTime() / 1000}&to=${new Date().getTime() / 1000}`)
            .then(response => response.json())
            .then(data => {
                setEthPriceHistory(data.prices.map((price) => {
                    return {
                        x: new Date(price[0]).toLocaleDateString(),
                        y: price[1]
                    };
                }));
            });
    }, []);

    const changeConversion = () => {
        setIsEuroToEth(!isEuroToEth);
        if (isEuroToEth) {
            const euroValue = ethAmount * ethPrice;
            setEuroAmount(euroValue.toFixed(2));
        } else {
            const ethValue = euroAmount / ethPrice;
            setEthAmount(ethValue.toFixed(6));
        }
    };

    useEffect(() => {
        if (isEuroToEth) {
            const ethValue = euroAmount / ethPrice;
            setEthAmount(ethValue.toFixed(6));
        } else {
            const euroValue = ethAmount * ethPrice;
            setEuroAmount(euroValue.toFixed(2));
        }
    }, [euroAmount, ethAmount, ethPrice, isEuroToEth]);


    const adjustedLabels = ethPriceHistory.map((point, index) => {
        if (index === 0) return point.x;
        if (index === Math.floor(ethPriceHistory.length / 2)) return point.x;
        if (index === ethPriceHistory.length - 35) return point.x;
        return '';
    });


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Precio Ethereum</Text>
                <Text style={styles.price}>{ethPrice}€</Text>

                {ethPriceHistory.length > 0 && (
                    <LineChart
                        data={{
                            labels: adjustedLabels,
                            datasets: [
                                {
                                    data: ethPriceHistory.map(p => p.y),
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width * 0.85}
                        height={350}
                        yAxisLabel="€ "
                        chartConfig={{
                            backgroundColor: 'white',
                            backgroundGradientFrom: 'white',
                            backgroundGradientTo: 'white',
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(22, 72, 99, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            propsForDots: {
                                r: '0.5',
                                strokeWidth: '2',
                                stroke: '#9BBEC8',
                            },
                            propsForBackgroundLines: {
                                stroke: '#427D9D',
                                strokeDasharray: '0',
                                strokeWidth: '0.1',
                            },
                            propsForLabels: {
                                fontWeight: 'bold',
                                fontStyle: "normal"
                            },
                        }}
                        bezier={false}
                        style={{
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 10,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 6,
                            shadowOpacity: 0.3,
                            elevation: 2,
                            marginVertical: 10,
                            marginBottom: 40,
                        }}
                    />
                )}
                <View style={styles.card}>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                            <Text style={styles.titleCalc}>
                                {isEuroToEth ? "Euro-Ethereum" : "Ethereum-Euro"}
                            </Text>
                            <TouchableOpacity
                                style={{ marginLeft: 10 }}
                                onPress={changeConversion}
                            >
                                <FontAwesome5 name="exchange-alt" size={24} color="black" style={{ marginTop: 15, padding: 10 }} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder={isEuroToEth ? "Cantidad en Euros" : "Cantidad en Ethereum"}
                            onChangeText={(text) => {
                                const amount = parseFloat(text) || 0;
                                if (isEuroToEth) {
                                    setEuroAmount(amount);
                                } else {
                                    setEthAmount(amount);
                                }
                            }}
                            value={isEuroToEth ? euroAmount.toString() : ethAmount.toString()}
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.conversionText}>Es aproximadamente:  </Text>
                            <Text style={styles.conversionText}>
                                {isEuroToEth ? `${ethAmount} ETH` : `${euroAmount} €`}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    title: {
        fontSize: 40,
        color: 'black',
        marginBottom: -2,
    },
    price: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 0,
    },
    input: {
        width: '80%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        fontSize: 20,
        marginBottom: 10,
        marginTop: 17,
    },
    titleCalc: {
        fontSize: 27,
        color: 'black',
        marginBottom: 0,
        marginTop: 10,
    },
    conversionText: {
        fontSize: 20,
        color: 'black',
        marginBottom: 10,
    },
    card: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.3,
        elevation: 2,
        marginVertical: 20,
        marginBottom: 40,
    }
});