import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api';
import LoaderService from '../../Component/LoaderServices';
import CoustomToast from '../../Component/CoustomToast';
import Strings from '../../constants/strings';

export const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        LoaderService.show();
        const userToken = await AsyncStorage.getItem('userToken');
        const savedName = await AsyncStorage.getItem('username');

        if (userToken && savedName) {
          navigation.replace('Dashboard');
        }
      } catch (err) {
        console.log('Error reading storage:', err);
      } finally {
        LoaderService.hide(); // hide loader
      }
    };

    checkLogin();
  }, []);

  const login = async () => {
    if (!name || !password) {
      CoustomToast('error', 'Wrong', 'Please enter both username and password');
      return;
    }

    // setLoginLoading(true);\
    LoaderService.show();

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
        CoustomToast('error', 'Wrong', 'Invalid Username And Password');
      }, 100);
    } finally {
      LoaderService.hide(); // hide loader
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Strings.loginTitle}</Text>

      <TextInput
        placeholder={Strings.emailPlaceholder}
        style={styles.input}
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />

      <View style={styles.passwordBox}>
        <TextInput
          placeholder={Strings.passwordPlaceholder}
          secureTextEntry={secureText}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setSecureText(!secureText)}
          style={styles.showHideButton}
        >
          <Text style={styles.showHideText}>
            {secureText ? Strings.showPassword : Strings.hidePassword}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>{Strings.loginButton}</Text>
      </TouchableOpacity>
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
