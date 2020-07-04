import {ToastAndroid, Platform} from "react-native";

const showToast = (message: string, duration: number) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, duration);
  } else {
    //TODO add toast alternative for IOS
  }
};

const showShortToast = (message: string) => {
  showToast(message, ToastAndroid.SHORT);
};

const showLongToast = (message: string) => {
  showToast(message, ToastAndroid.LONG);
};

export {showToast, showShortToast, showLongToast};
