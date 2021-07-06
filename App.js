import React, {Component} from 'react';
import {View, Platform, PermissionsAndroid} from 'react-native';
import {models} from './source/commons/model';
import Geolocation from '@react-native-community/geolocation';

export default class App extends Component {
  async componentDidMount() {
    if (Platform.OS == 'ios') {
      Geolocation.requestAuthorization();
    } else {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted) {
        // console.log('You can use the ACCESS_FINE_LOCATION');
      } else {
        console.log('ACCESS_FINE_LOCATION permission denied');
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      }
    }
  }

  render() {
    return <View style={{position: 'absolute'}} />;
  }
}
