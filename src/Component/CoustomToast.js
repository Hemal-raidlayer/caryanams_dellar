import Toast from 'react-native-toast-message';

export const CoustomToast = (type, title, message, position = 'bottom', duration = 3000) => {
  Toast.show({
    type,           // 'success' | 'error' | 'info'
    text1: title,   // Main title
    text2: message, // Subtitle / message
    position,       // 'top' or 'bottom'
    visibilityTime: duration,
    autoHide: true,
    topOffset: 50,   // optional spacing from top
    bottomOffset: 50 // optional spacing from bottom
  });
};

export default CoustomToast;
