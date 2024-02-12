import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

//screens
import Home from './screens/Home';
import Alerts from './screens/Alerts';
import Settings from './screens/Settings';
import Stats from './screens/Stats';
import Wallet from './screens/Wallet';
import CreateContract from './screens/CreateContract';
import infoContract from './screens/infoContract';
import SignContract from './screens/SignContract';
import ShowContract from './screens/ShowContracts';
import ModifyContract from './screens/ModifyContract';
import ApplyChanges from './screens/ApplyChanges';

const HomeStackNavigator = createNativeStackNavigator();

function MyStack() {
    return (
        <HomeStackNavigator.Navigator
            initialRouteName='Home1'
        >
            <HomeStackNavigator.Screen
                name="Home1"
                component={Home}
                options={{
                    title: 'Pantalla Inicio',
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                }}
            />
            <HomeStackNavigator.Screen
                name='CreateContract'
                component={CreateContract}
                options={{
                    title: 'Crear Contrato',
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                }}
            />
            <HomeStackNavigator.Screen
                name='SignContract'
                component={SignContract}
                options={{
                    title: 'Firmar Contrato',
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                }}
            />
            <HomeStackNavigator.Screen
                name='infoContract'
                component={infoContract}
                options={{
                    title: 'Consultar Contratos',
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                }}
            />
            <HomeStackNavigator.Screen
                name='ShowContract'
                component={ShowContract}
                options={{
                    title: 'Ver Contratos',
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                }}
            />
            <HomeStackNavigator.Screen
                name="ModifyContract"
                component={ModifyContract}
                options={{
                    title: 'Modificar Contrato',
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                }}
            />
            <HomeStackNavigator.Screen
                name="ApplyChanges"
                component={ApplyChanges}
                options={{
                    title: 'Confirmar Cambios',
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                }}
            />
        </HomeStackNavigator.Navigator>
    );
}


const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                tabBarActiveTintColor: '#113D54',
                tabBarInactiveTintColor: '#5E6E6D',
                tabBarStyle: {
                    backgroundColor: '#9BBEC8',
                },
            }}
        >
            <Tab.Screen
                name="Cartera"
                component={Wallet}
                options={{
                    tabBarLabel: 'Cartera',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="wallet" size={24} color={color} style={{ marginTop: 3 }} />
                    ),
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                    tabBarLabelStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />

            <Tab.Screen
                name="Información"
                component={Stats}
                options={{
                    tabBarLabel: 'Información',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart-sharp" size={24} color={color} style={{ marginTop: 5 }} />
                    ),
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                    tabBarLabelStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />

            <Tab.Screen
                name="Home"
                component={MyStack}
                options={{
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={33} style={{ marginTop: 5 }} /> //hereda el color del padre (screenOptions)
                    ),
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                    tabBarLabelStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />

            <Tab.Screen
                name="Alertas"
                component={Alerts}
                options={{
                    tabBarLabel: 'Alertas',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bell" color={color} size={25} style={{ marginTop: 5 }} />
                    ),
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                    tabBarLabelStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />

            <Tab.Screen
                name="Ajustes"
                component={Settings}
                options={{
                    tabBarLabel: 'Ajustes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={24} color={color} style={{ marginTop: 3 }} />
                    ),
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#9BBEC8',
                    },
                    tabBarLabelStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />

        </Tab.Navigator>
    );
}

export default function Navigation() {
    return (
        <MyTabs />
    );
}