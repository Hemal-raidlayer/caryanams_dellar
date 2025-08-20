import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import api from '../../../api';

export const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true); // 👈 for show/hide password

  const login = async () => {
    if (!name || !password) {
      Alert.alert('Wrong', 'Please enter both username and password');
      return;
    }

    try {
      const response = await api.post('/auth/login/password', {
        username: name,
        password: password,
        appName: 'app5347583724521',
      });

      console.log('Login Success:', response);
      navigation.replace('Dashboard');
    } catch (error) {
      console.log('Login Error:', error);
      setTimeout(() => {
        Alert.alert('Wrong', 'Invalid Username And Password');
      }, 100);
    }
  };

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

      {/* Password field with Show/Hide inside box */}
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
          <Text style={styles.showHideText}>
            {secureText ? 'Show' : 'Hide'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Submit</Text>
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
});
