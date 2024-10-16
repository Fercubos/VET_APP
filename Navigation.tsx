
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { View, Text, Button } from "react-native";
// the package we are using for naviigation uses a native navigation stack

// Importaciones de Expo y React Native
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Image, Alert } from 'react-native';
import { useState, useEffect } from 'react';

// Firebase Core y Servicios
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Persistencia con AsyncStorage en React Native
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Navegación en React Native
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Componentes internos
// import Navigation from './Navigation';

// Configuración de Firebase (usa variables de entorno en producción)
const firebaseConfig = {
  apiKey: 'AIzaSyBJ2T1esPltnGM6Mk5lU8Dphi2lOGVBJ2Q',
  authDomain: 'vetapp-e0d30.firebaseapp.com',
  projectId: 'vetapp-e0d30',
  storageBucket: 'vetapp-e0d30.appspot.com',
  messagingSenderId: '740226333197',
  appId: '1:740226333197:web:8add2cd237d4d36479b344',
};

// Inicializar Firebase y servicios
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


const Stack = createNativeStackNavigator();

export default function Navigation() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name = "Home"
                    component={Home}
                />
                <Stack.Screen
                    name = "Main_menu "
                    component={Main_menu }
                />
                <Stack.Screen
                    name = "Sign_in"
                    component={Sign_in}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}



function Home({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    // Validación básica
    const validateInputs = () => {
      if (email === '' || password === '') {
        alert('Por favor, ingresa correo y contraseña.');
        return false;
      }
      return true;
    };
  
    const handleLoginNavigation = () => {
      if (validateInputs()) {
        navigation.navigate('Main_menu ', { email, password });
      }
    };
  
    const handleSignUpNavigation = () => {
      navigation.navigate('Sign_in', { data: 'SOME RELEVANT INFO' });
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hi from Home</Text>
  
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
  
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
  
        <Button title="Main_menu " onPress={handleLoginNavigation} />
  
        <Button title="Sign_in" onPress={handleSignUpNavigation} />
      </View>
    );
  }
  
function Main_menu  ( {navigation}: any){
    return(
        <View>
            <Text> Main_menu </Text>
            <Button
                title = "Main_menu"
                onPress={() => {
                    navigation.navigate("Main_menu");
                }}
            />
        </View>
    );
}


function Sign_in({ navigation }: any) {
    // Estado para capturar el email y la contraseña
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    // Función para manejar el registro de usuarios
    const handleSignUp = () => {
      // Método de Firebase para registrar un usuario con email y contraseña
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Usuario registrado correctamente
          console.log("USER: " + userCredential.user.email);
          Alert.alert("Success", "User registered successfully");
          // Navegar al menú principal después de registrar al usuario
          navigation.navigate("Main_menu");
        })
        .catch((error) => {
          // Manejar diferentes tipos de errores
          if (error.code === "auth/weak-password") {
            alert("Password is too weak!");
          } else if (error.code === "auth/email-already-in-use") {
            alert("This email is already registered!");
          } else {
            alert("Registration failed: " + error.message);
          }
          console.log("ERROR: " + error.message + " " + error.code);
        });
    };
  
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign Up</Text>
        
        {/* Campo de texto para el email */}
        <TextInput
          placeholder="Email"
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
          }}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        
        {/* Campo de texto para la contraseña */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginBottom: 20,
            paddingHorizontal: 10,
          }}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        
        {/* Botón para registrar al usuario */}
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
    );
  }
  

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        padding: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
});