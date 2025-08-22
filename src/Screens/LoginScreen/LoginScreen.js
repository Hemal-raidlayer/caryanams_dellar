import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api';

export const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(true); // Loader while checking token
  const [loginLoading, setLoginLoading] = useState(false); // Loader while login API call

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const savedName = await AsyncStorage.getItem('username');

        if (userToken && savedName) {
          navigation.replace('Dashboard');
        }
      } catch (err) {
        console.log('Error reading storage:', err);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  const login = async () => {
    if (!name || !password) {
      Alert.alert('Wrong', 'Please enter both username and password');
      return;
    }

    setLoginLoading(true);

    try {
      const response = await api.post('v2/auth/login/password', {
        username: name,
        password: password,
        appName: 'app5347583724521',
      });

      console.log('Login Success:', response);
      console.log('>>>>>>:', response.accessToken);

      await AsyncStorage.setItem('userToken', response.accessToken || '');
      await AsyncStorage.setItem('username', name);

      navigation.replace('Dashboard');
    } catch (error) {
      console.log('Login Error:', error);
      setTimeout(() => {
        Alert.alert('Wrong', 'Invalid Username And Password');
      }, 100);
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    // Show loader while checking token
    return (
      <Modal transparent animationType="fade" visible={true}>
        <View style={styles.modalBackground}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />

      <View style={styles.passwordBox}>
        <TextInput
          placeholder="Password"
          secureTextEntry={secureText}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setSecureText(!secureText)}
          style={styles.showHideButton}
        >
          <Text style={styles.showHideText}>{secureText ? 'Show' : 'Hide'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={login}
        disabled={loginLoading}
      >
        {loginLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>

      {/* Loader Modal during login API call */}
      <Modal transparent visible={loginLoading} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  showHideButton: {
    paddingHorizontal: 5,
  },
  showHideText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#333',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
