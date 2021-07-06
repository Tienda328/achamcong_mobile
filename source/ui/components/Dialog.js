import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

class Popup extends Component {
  static popupInstance;

  static show({ ...config }) {
    this.popupInstance.start(config);
  }

  static hide() {
    this.popupInstance.hidePopup();
  }

  state = {
    positionView: new Animated.Value(HEIGHT),
    opacity: new Animated.Value(0),
    positionPopup: new Animated.Value(HEIGHT),
    popupHeight: 0,
  };

  start({ ...config }) {
    this.setState({
      title: config.title,
      type: config.type,
      icon: config.icon !== undefined ? config.icon : false,
      textBody: config.textBody,
      button: config.button !== undefined ? config.button : true,
      buttonCancel:
        config.buttonCancel !== undefined ? config.buttonCancel : true,
      buttonText: config.buttonText || 'OK',
      buttonTextCancel: config.buttonTextCancel || 'Cancel',
      callback:
        config.callback !== undefined
          ? config.callback
          : this.defaultCallback(),
      callbackOk:
        config.callbackOk !== undefined
          ? config.callbackOk
          : this.defaultCallback(),
      background: config.background || 'rgba(0, 0, 0, 0.5)',
      timing: config.timing,
      autoClose: config.autoClose !== undefined ? config.autoClose : false,
    });

    Animated.sequence([
      Animated.timing(this.state.positionView, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(this.state.positionPopup, {
        toValue: HEIGHT / 2 - this.state.popupHeight / 2,
        bounciness: 15,
        useNativeDriver: true,
      }),
    ]).start();

    if (config.autoClose && config.timing !== 0) {
      const duration = config.timing > 0 ? config.timing : 5000;
      setTimeout(() => {
        this.hidePopup();
      }, duration);
    }
  }

  hidePopup() {
    Animated.sequence([
      Animated.timing(this.state.positionPopup, {
        toValue: HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.positionView, {
        toValue: HEIGHT,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
    // console.log('________hello word');
  }

  defaultCallback() {
    this.hidePopup();
  }

  handleImage(type) {
    switch (type) {
      case 'Success':
        return require('../../assets/image/logo.png');
      case 'Danger':
        return require('../../assets/image/logo.png');
      case 'Warning':
        return require('../../assets/image/logo.png');
    }
  }

  render() {
    const {
      title,
      type,
      textBody,
      button,
      buttonCancel,
      buttonTextCancel,
      buttonText,
      callback,
      callbackOk,
      background,
    } = this.state;
    let el = null;
    if (this.state.button) {
      el = (
        <View
          style={{
            flexDirection: 'row',
            // backgroundColor: '#f00',
            justifyContent: 'space-around',
            alignItems: 'center',
            // marginLeft: 20,
            // backgroundColor: '#f00',
            width: 2 * WIDTH / 3
       
          }}>
          {
            button ? <TouchableOpacity
              style={[styles.Button, styles[type]]}
              onPress={callback}>
              <Text style={styles.TextButton}>{buttonText}</Text>
            </TouchableOpacity> : null
          }
          {/* <View style={{ width: 10 }} /> */}
          {
            buttonCancel ? <TouchableOpacity
              style={[styles.Button, styles[type]]}
              onPress={callbackOk}>
              <Text style={styles.TextButton}>{buttonTextCancel}</Text>
            </TouchableOpacity> : null
          }
        </View>
      );
    }
    else {
      el = <Text />;
    }
    return (
      <Animated.View
        ref={(c) => (this._root = c)}
        style={[
          styles.Container,
          {
            backgroundColor: background || 'transparent',
            opacity: this.state.opacity,
            transform: [{ translateY: this.state.positionView }],
          },
        ]}>
        <Animated.View
          onLayout={(event) => {
            this.setState({ popupHeight: event.nativeEvent.layout.height });
          }}
          style={[
            styles.Message,
            {
              transform: [{ translateY: this.state.positionPopup }],
            },
          ]}>
          <View style={styles.Header} />
          {this.state.icon ? (
            this.state.icon
          ) : (
            <Image
              source={this.handleImage(type)}
              resizeMode="contain"
              style={styles.Image}
            />
          )}
          <View style={styles.Content}>
            <Text style={styles.Title}>{title}</Text>
            <Text style={styles.Desc}>{textBody}</Text>
            {el}
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    position: 'absolute',
    zIndex: 99999,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    top: 0,
    left: 0,
  },
  Message: {
    maxWidth: WIDTH - 20,
    width: WIDTH - 50,
    minHeight: 200,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    // overflow: 'hidden',
    position: 'absolute',
  },
  Content: {
    // padding: 20,
    alignItems: 'center',
  },
  Header: {
    height: 70,
    width: 70,
    backgroundColor: 'white',
    borderRadius: 100,
    marginTop: -35,
  },
  Image: {
    width: 70,
    height: 70,
    position: 'absolute',
    top: -35,
  },
  Title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  Desc: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  Button: {
    borderRadius: 5,
    height: 40,
    width: 100,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  TextButton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  Success: {
    backgroundColor: '#AAF577',
    shadowColor: '#AAF577',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  Danger: {
    backgroundColor: '#F29091',
    shadowColor: '#F29091',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  Warning: {
    backgroundColor: '#fba40d',
    shadowColor: '#fba40d',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
});

export default Popup;
