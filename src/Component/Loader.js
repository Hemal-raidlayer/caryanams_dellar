import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View, Modal, StyleSheet, ActivityIndicator, Text } from 'react-native';

// ForwardRef so we can control it globally
const Loader = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Loading...');

  useImperativeHandle(ref, () => ({
    show: (msg = 'Loading...') => {
      setMessage(msg);
      setVisible(true);
    },
    hide: () => setVisible(false),
  }));

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#007AFF" />
          {message ? <Text style={styles.text}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 18,
    alignItems: 'center',
    minWidth: 140,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  text: {
    marginTop: 12,
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
});

export default Loader;
