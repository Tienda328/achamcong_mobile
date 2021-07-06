import { Component } from "react";
// import Toast from 'react-native-simple-toast';
import { Alert } from 'react-native'
// import {commonsConfigs as configs} from '../commons'

class BaseComponent extends Component {

  // showToast = (contentToast) => {
  //   Toast.show(JSON.stringify(contentToast))
  // }

  showAlert = (contentAlert, title) => {
    Alert.alert(
      title ? title : 'A Chấm Công',
      contentAlert,
      [
        {
          text: 'Đồng ý', onPress: () => { }
        }
      ]
    );
  }

  static navigationOptions = { header: null, };
  render() {
  }
}

export default BaseComponent;