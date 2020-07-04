import React, {useRef, useState, useEffect} from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  Platform,
} from "react-native";
import {
  Button,
  ThemeProvider,
  Header,
  Text,
  Theme,
  Icon,
  Input,
} from "react-native-elements";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Column, Row} from "./src/components/core";
import http from "./src/http";
import {showLongToast, showShortToast} from "./src/toastHelper";
import AsyncStorage from "@react-native-community/async-storage";

const darkBgColor = "#090B0B";
const whiteBgColor = "#FBFBFF";
const whiteBgTextColor = "#242325";
const theme: Theme = {
  colors: {
    primary: "#4D7EA8",
  },
  Header: {
    backgroundColor: darkBgColor,
    centerComponent: {
      color: "#fff",
    },
    rightComponent: {
      color: "#fff",
    },
    leftComponent: {
      color: "#fff",
    },
    containerStyle: {
      borderWidth: 1,
      borderColor: whiteBgTextColor,
      borderBottomColor: whiteBgTextColor,
    },
  },
  Text: {
    style: {
      color: "#fff",
    },
    h4Style: {
      fontSize: 20,
    },
  },
  Button: {
    raised: true,
    icon: {
      disabledStyle: {},
    },
  },
  Input: {
    placeholderTextColor: "#828489",

    selectionColor: "#828489",
    inputStyle: {
      color: "#fff",
    },
  },
  Icon: {
    color: "white",
  },
};

const lightTheme: Theme = {
  ...theme,
  Text: {style: {color: whiteBgTextColor}},
  Header: {
    backgroundColor: whiteBgColor,
    centerComponent: {color: whiteBgTextColor},
    leftComponent: {color: whiteBgTextColor},
    rightComponent: {color: whiteBgTextColor},
    containerStyle: {
      borderBottomColor: darkBgColor,
      borderColor: darkBgColor,
    },
  },
  colors: {
    primary: whiteBgTextColor,
  },
};

const SERVER_URL_KEY = "serverUrl";

const App = () => {
  const themeRef = useRef<ThemeProvider<unknown>>(null);
  const [currentTheme, setTheme] = useState("dark");
  const [bgColor, setBgColor] = useState(darkBgColor);
  const [connected, setConnected] = useState(false);
  const [serverUrl, setServerUrl] = useState("");
  const [connecting, setConnecting] = useState(false);
  const switchTheme = () => {
    if (currentTheme === "dark") {
      themeRef.current?.replaceTheme(lightTheme);
      setBgColor(whiteBgColor);
      setTheme("light");
    } else {
      themeRef.current?.replaceTheme(theme);
      setBgColor(darkBgColor);
      setTheme("dark");
    }
  };

  useEffect(() => {
    if (!serverUrl) {
      AsyncStorage.getItem(SERVER_URL_KEY, (error, results) => {
        if (error) {
          console.log(error);
        } else {
          setServerUrl(results ?? "http://");
        }
      });
    }
  }, []);

  const onServerUrlChanged = (text: string) => {
    setServerUrl(text);
    AsyncStorage.setItem(SERVER_URL_KEY, text).catch((error) => {
      console.log(error);
    });
  };

  const handleError = (error: any) => {
    let message;
    let shouldDisconnect = true;
    if (error.response) {
      if (error.response.data) {
        message = error.response.data.message;
        shouldDisconnect = false;
      }
    } else {
      message = `Unable to connect ${error}`;
    }
    showLongToast(message);
    if (shouldDisconnect) {
      setConnected(false);
    }
    if (connecting) {
      setConnecting(false);
    }
  };
  const onConnectPressed = () => {
    setConnecting(true);
    http
      .configure(serverUrl)
      .then(() => {
        setConnected(true);
        showShortToast("Connected");
        setConnecting(false);
      })
      .catch((error) => {
        showShortToast("Unable to connecet to the server");
        setConnecting(false);
      });
  };

  const performAction = (action: string, customMessage = "Action Sent") => {
    if (!connected) {
      return showShortToast("Unable to excute action [NOT CONNECTED]");
    }
    http
      .post("/keyboard-action", action)
      .then(() => {
        showShortToast(customMessage);
      })
      .catch(handleError);
  };

  const shutdownPressed = (customMessage = "Shutdown is happening...") => {
    if (!connected) {
      return showShortToast("Unable to excute action [NOT CONNECTED]");
    }
    http
      .post("/shutdown", "")
      .then(() => {
        showShortToast(customMessage);
      })
      .catch(handleError);
  };

  const restartPressed = (customMessage = "Restarting...") => {
    if (!connected) {
      return showShortToast("Unable to excute action [NOT CONNECTED]");
    }
    http
      .post("/restart", "")
      .then(() => {
        showShortToast(customMessage);
      })
      .catch(handleError);
  };

  return (
    <ThemeProvider theme={theme} ref={themeRef}>
      <StatusBar backgroundColor={darkBgColor} />
      <SafeAreaView>
        <Header
          placement="left"
          centerComponent={{text: "PC Controller"}}
          rightComponent={{
            icon: "palette",
            onPress: switchTheme,
          }}
        />
        <KeyboardAwareScrollView
          style={{backgroundColor: bgColor}}
          enableOnAndroid
          keyboardShouldPersistTaps="handled">
          <Row
            direction="column"
            justifyContent="center"
            style={styles.content}>
            <Text h4 style={styles.marginBottom10}>
              Connection Status:{" "}
              <Text style={!connected ? styles.notConnected : styles.connected}>
                {!connected ? "Not Connected" : "Connected"}
              </Text>
            </Text>
            <Row
              style={styles.marginBottom10}
              alignItems="center"
              justifyContent="center"
              direction="column">
              <Text h4>PC Controls</Text>
              <Row direction="row">
                <Column size={2}>
                  <Button
                    title="Shut Down"
                    icon={<Icon name="power-settings-new" />}
                    onPress={() => shutdownPressed()}
                  />
                </Column>
                <Column size={2}>
                  <Button
                    title="Restart"
                    icon={<Icon name="cached" />}
                    onPress={() => restartPressed()}
                  />
                </Column>
              </Row>
            </Row>
            <Row direction="column" alignItems="center" justifyContent="center">
              <Text h4>Volume Controls</Text>
              <Row direction="row" style={styles.marginBottom10}>
                <Column size={3}>
                  <Button
                    icon={<Icon name="volume-up" />}
                    onPress={() =>
                      performAction("audio_vol_up", "Volume Increased")
                    }
                  />
                </Column>
                <Column size={3}>
                  <Button
                    icon={<Icon name="volume-mute" />}
                    onPress={() =>
                      performAction("audio_mute", "Volume Mute Toggled")
                    }
                  />
                </Column>
                <Column size={3}>
                  <Button
                    icon={<Icon name="volume-down" />}
                    onPress={() =>
                      performAction("audio_vol_down", "Volume Decreased")
                    }
                  />
                </Column>
              </Row>
            </Row>
            <Row direction="column" alignItems="center" style={{marginTop: 10}}>
              <Text h4>Media Controls</Text>
              <Column size={1} style={[{marginTop: 10}, styles.marginBottom10]}>
                <Button
                  title="Pause"
                  icon={<Icon name="pause" />}
                  onPress={() => performAction("audio_pause", "Paused Toggled")}
                />
              </Column>
              <Column size={1} style={styles.marginBottom10}>
                <Button
                  title="Next Track/Media"
                  icon={<Icon name="skip-next" />}
                  onPress={() =>
                    performAction("audio_next", "Next Track Playing")
                  }
                />
              </Column>
              <Column size={1} style={styles.marginBottom10}>
                <Button
                  title="Previous Track/Media"
                  icon={<Icon name="skip-previous" />}
                  onPress={() =>
                    performAction("audio_prev", "Previous Track Playing")
                  }
                />
              </Column>
            </Row>
            <Row direction="column" alignItems="center" style={{marginTop: 10}}>
              <Text h4>Server Options</Text>
              <Column size={1}>
                <Input
                  placeholder="Server IP"
                  onChangeText={onServerUrlChanged}
                  value={serverUrl}
                  disabled={connecting || connected}
                />
              </Column>
              <Column size={1} style={styles.marginBottom10}>
                <Button
                  title="Connect"
                  icon={<Icon name="link" />}
                  onPress={onConnectPressed}
                  disabled={connecting || connected}
                />
              </Column>
            </Row>
          </Row>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 10,
    padding: 10,
    marginBottom: 100,
    flex: 1,
  },
  colorWhite: {
    color: "#fff",
  },
  notConnected: {
    color: "red",
  },
  connected: {
    color: "green",
  },
  marginBottom10: {
    marginBottom: 10,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  flex2: {
    width: "50%",
    margin: 5,
  },
  flex3: {
    width: "30.333333%",
    margin: 5,
  },
});
export default App;
