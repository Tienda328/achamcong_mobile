import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Alert,
} from 'react-native';
import {commonsConfigs as configs} from '../../../commons';
import {models} from '../../../commons/model';
import {IconView} from '../../components';
import BaseDialog from '../../components/BaseDiaLog';
const DEVICE_HEIGHT = Dimensions.get('window').height;
const checked = require('../../../assets/image/checked.png');
const uncheck = require('../../../assets/image/uncheck.png');
class DialogSelectItemFromList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reRender: false,
    };
    this.closedDialog = this.closedDialog.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onClickChonItem = this.onClickChonItem.bind(this);
    this.dataDialog = models.getAllAccountLogin();
    this.dataList = [];
    this.dataSelect = [];
    this.onData(this.dataDialog);

    this.dataChon = [];
  }

  closedDialog = () => {
    this.props.showDialog(false);
  };

  onData(data, id, isRender = false) {
    this.dataList = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.dataList.push({
          title: data[i].nameAccount,
          id: data[i].nameAccount,
          value: data[i].password,
          isSelect: id === data[i].nameAccount,
        });
      }
    }

    if (isRender) {
      this.reRender();
    }
  }

  reRender = () => {
    this.setState((prevState) => ({
      reRender: (prevState.reRender = !this.state.reRender),
    }));
  };

  deleteItem = (data) => {
    Alert.alert(
      configs.APP_NAME,
      'bạn muốn xóa tài khoản ' + data.title + ' này không?',
      [
        {text: 'Hủy'},
        {
          text: 'Đồng ý',
          onPress: () => {
            let index = this.dataList.indexOf(data);
            console.log('index:    ', index);
            if (index > -1) {
              this.dataList.splice(index, 1);
              models.deleteItemAccountLogin({
                '0': {
                  nameAccount: data.title,
                  password: data.value,
                },
              });
              this.reRender();
            }
          },
        },
      ],
    );
  };

  // componentDidUpdate(prevProps, prevState) {
  //     if (this.props.dataDialog) {
  //         if (this.props.dataDialog !== prevProps.dataDialog) {
  //             this.dataDialog = this.props.dataDialog ? this.props.dataDialog : {}
  //             this.onData(this.props.dataDialog ? this.props.dataDialog.dataList : [])
  //             this.reRender()
  //         }
  //     }
  // }

  renderItem = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 0.5,
          borderBottomColor: configs.colorText,
          borderTopColor: configs.colorText,
          borderTopWidth: index === 0 ? 0.5 : 0,
          padding: 12,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.dataChon = item;
            this.onData(this.dataDialog, item.id, true);
          }}
          style={{
            flexDirection: 'row',
            color: configs.colorText,
            alignItems: 'center',
            flex: 1,
          }}>
          <Image
            style={{width: 15, height: 15, marginRight: 8}}
            source={item.isSelect ? checked : uncheck}
          />

          <Text
            style={{
              flex: 1,
            }}
            numberOfLines={1}>
            {item.title}
          </Text>
        </TouchableOpacity>

        {/* <IconView
                    onPress={() => { this.deleteItem(item) }}
                    name={'recycle-bin'}
                    color={'red'}
                    style={{ padding: 4 }}
                /> */}
      </View>
    );
  };

  onClickChonItem = (item) => {
    this.closedDialog();
    this.props.onDataSelectItem('ChonTaiKhoan', item, true);
  };

  renderEmptyContainer = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 40,
        }}>
        <Image
          source={require('../../../assets/image/icon_history.png')}
          style={{
            width: 100,
            height: 100,
          }}
        />
        <Text
          style={[
            styles.styleText,
            {fontWeight: 'bold', fontSize: 16, color: 'black'},
          ]}>
          {'Bạn không có tài khoản nào.'}
        </Text>
      </View>
    );
  };

  render() {
    let {isShowDialog} = this.props;
    return (
      <BaseDialog
        visibleModal={isShowDialog}
        titleDialog={'Chọn tài khoản'}
        isIconClosed={true}
        closedDialog={this.closedDialog}>
        <FlatList
          style={{height: DEVICE_HEIGHT / 2}}
          data={this.dataList}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          ListEmptyComponent={this.renderEmptyContainer()}
        />

        <View
          style={{
            flexDirection: 'row',
            marginTop: 12,
            backgroundColor: configs.bgNen,
            paddingVertical: 12,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}>
          <TouchableOpacity
            style={[styles.styleButtonSuaToken]}
            onPress={this.closedDialog}>
            <Text style={[styles.styleText, {color: 'white', fontSize: 16}]}>
              {'Hủy'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.styleButtonSuaToken]}
            onPress={() => {
              this.onClickChonItem(this.dataChon);
            }}>
            <Text style={[styles.styleText, {color: 'white', fontSize: 16}]}>
              {'Đồng ý'}
            </Text>
          </TouchableOpacity>
        </View>
      </BaseDialog>
    );
  }
}

const styles = StyleSheet.create({
  styleText: {
    fontSize: configs.fontSize14,
    fontFamily: 'Lato-Regular',
    color: 'white',
  },

  styleTextInputElement: {
    flexDirection: 'row',
    height: configs.heightInput40,
    borderColor: configs.colorMain,
  },
  styleButtonSuaToken: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: configs.colorMain,
    borderRadius: 6,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default DialogSelectItemFromList;
