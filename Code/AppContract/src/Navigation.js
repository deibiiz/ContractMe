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


const HomeStackNavigator = createNativeStackNavigator();

function MyStack() {
    return (
        <HomeStackNavigator.Navigator
            initialRouteName='Home1'
        >
            <HomeStackNavigator.Screen
                name="Home1"
                component={Home}
                options={{ title: 'Pantalla Inicio' }}
            />
            <HomeStackNavigator.Screen
                name='CreateContract'
                component={CreateContract}
                options={{ title: 'Crear Contrato' }}
            />
            <HomeStackNavigator.Screen
                name='infoContract'
                component={infoContract}
                options={{ title: 'Verificar Contrato' }}
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
                tabBarActiveTintColor: '#12B0FF',
            }}
        >
            <Tab.Screen
                name="Wallet"
                component={Wallet}
                options={{
                    tabBarLabel: 'Cartera',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="wallet" size={24} color={color} style={{ marginTop: 3 }} />
                    ),
                    headerShown: true,
                }}
            />

            <Tab.Screen
                name="Stats"
                component={Stats}
                options={{
                    tabBarLabel: 'Información',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart-sharp" size={24} color={color} style={{ marginTop: 5 }} />
                    ),
                    headerShown: true,
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
                }}
            />

            <Tab.Screen
                name="Alerts"
                component={Alerts}
                options={{
                    tabBarLabel: 'Alertas',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bell" color={color} size={25} style={{ marginTop: 5 }} />
                    ),
                    headerShown: true,
                }}
            />

            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    tabBarLabel: 'Ajustes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={24} color={color} style={{ marginTop: 3 }} />
                    ),
                    headerShown: true,
                }}
            />

        </Tab.Navigator>
    );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    );
}