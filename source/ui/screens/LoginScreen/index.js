import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {BaseComponent, Checkbox, InputView} from '../../components/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {commonsConfigs as configs} from '../../../commons';
import {StackActions, NavigationActions} from 'react-navigation';

import Root from '../../components/Root';

import {api} from '../../../commons/api/Api';
import {actions} from '../../../commons/action';
import {models} from '../../../commons/model';

const logo_ninja = require('../../../assets/image/logo_ninja.png');
const logo_banner = require('../../../assets/image/logo_banner.png');

class LoginScreen extends BaseComponent {
  constructor(props) {
    super(props);

    let dataAccount = models.getAllAccountLogin();
    console.log('dataAccount:    ', dataAccount);
    dataAccount =
      dataAccount.length > 0 ? dataAccount[dataAccount.length - 1] : {};

    this.state = {
      userName: dataAccount.nameAccount ? dataAccount.nameAccount : '',
      password: dataAccount.password ? dataAccount.password : '',
      check_textInputChange: false,
      secureTextEntry: true,
      isValidUser: true,
      isValidPassword: true,
      iconPassword: 'password-login',
      showPassword: true,
      isShowDialog: false,
      itemSelect: {},
    };
    this.isSavePass = true;
    this.dataLogin = models.getDataLogin();
    this.adminPermission = models.getStatusAdmin();
    this.dataDialogChonItemFromList = [];

    this.updateSecureTextEntry = this.updateSecureTextEntry.bind(this);
    this.handleValidUser = this.handleValidUser.bind(this);
    this.textInputChange = this.textInputChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.loginHandle = this.loginHandle.bind(this);
    this.setIputValue = this.setIputValue.bind(this);
    this.handleOnClickShowPassword = this.handleOnClickShowPassword.bind(this);
    this.setChangeCheckBox = this.setChangeCheckBox.bind(this);
    this.showDialogChonItemFromList = this.showDialogChonItemFromList.bind(
      this,
    );
    this.setValueTextInput = this.setValueTextInput.bind(this);
  }

  componentDidMount() {}

  showDialogChonItemFromList = (isShow = true) => {
    this.setState({
      isShowDialog: isShow,
    });
  };

  setValueTextInput = (id, data) => {
    if (id === 'ChonTaiKhoan') {
      let params = {
        email: data.title,
        password: data.value,
        isSave: this.isSavePass,
        token: models.getTokenModel(),
      };
      this.props.setUpLogin(params);
    }
  };

  backPressed = () => {
    return true;
  };

  textInputChange = (val) => {
    if (val.trim().length >= 4) {
      this.setState({
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      this.setState({
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      this.setState({
        password: val,
        isValidPassword: true,
      });
    } else {
      this.setState({
        password: val,
        isValidPassword: false,
      });
    }
  };

  setIputValue = (id, value) => {
    let {userName, password} = this.state;
    if (id === 1) {
      this.setState({userName: value});
    } else if (id === 2) {
      this.setState({password: value});
      if (password && password !== '') {
        this.setState((prevState) => ({
          iconPassword: (prevState.iconPassword = this.state.showPassword
            ? 'eye-on'
            : 'eye-off'),
        }));
      } else {
        this.setState((prevState) => ({
          iconPassword: (prevState.iconPassword = 'password-login'),
        }));
      }
    }
  };

  handleOnClickShowPassword = () => {
    let {userName, password} = this.state;
    if (password && password !== '') {
      this.setState({
        iconPassword: !this.state.showPassword ? 'eye-on' : 'eye-off',
        showPassword: !this.state.showPassword,
      });
    }
  };

  updateSecureTextEntry = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
    });
  };

  handleValidUser = (val) => {
    this.setState({
      isValidUser: val.trim().length >= 4,
    });
  };

  loginHandle = () => {
    let {userName, password} = this.state;

    if (userName.length === 0 || password.length === 0) {
      configs.showAlert('Bạn không được để trống');
      return;
    } else {
      let params = {
        email: userName,
        password: password,
        isSave: this.isSavePass,
        token: models.getTokenModel(),
      };
      this.props.setUpLogin(params);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.LoginReducer) {
      if (
        this.props.LoginReducer.isLogin &&
        (this.props.LoginReducer.countImage ||
          this.props.LoginReducer.countImage === 0) &&
        this.props.LoginReducer.permission !== '0'
      ) {
        if (this.props.LoginReducer.countImage === 0) {
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              key: null,
              actions: [
                NavigationActions.navigate({routeName: 'ChenImageScreen'}),
              ],
            }),
          );
        } else {
          if (this.props.LoginReducer.permission === '1') {
            if (!this.adminPermission) {
              this.props.navigation.dispatch(
                StackActions.reset({
                  index: 0,
                  key: null,
                  actions: [
                    NavigationActions.navigate({routeName: 'HomeAdminScreen'}),
                  ],
                }),
              );
            } else {
              this.props.navigation.dispatch(
                StackActions.reset({
                  index: 0,
                  key: null,
                  actions: [
                    NavigationActions.navigate({routeName: 'TrangChuScreen'}),
                  ],
                }),
              );
            }
          } else {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                key: null,
                actions: [
                  NavigationActions.navigate({routeName: 'TrangChuScreen'}),
                ],
              }),
            );
          }
        }

        if (this.isSavePass) {
          let {userName, password} = this.state;
          models.installAccountLogin({
            nameAccount: userName,
            password: password,
          });
          // console.log(
          //   'models.getAllAccountLogin():    ',
          //   models.getAllAccountLogin(),
          // );
        }
        this.props.resetIsLogin();
      }
    }
  }

  setChangeCheckBox = (id, value) => {
    this.isSavePass = value;
  };

  render() {
    return (
      <Root>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={['#4788d1', '#2e6eb8', '#24568f']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            // locations={[0, 0.1, 0.5]}

            style={[
              styles.container,
              {
                flex: 1,
              },
            ]}>
            <StatusBar backgroundColor="#4788d1" barStyle="light-content" />
            <View style={styles.header}>
              <Text style={styles.text_header}>{'Xin chào!'}</Text>
            </View>
            <Animatable.View
              animation="fadeInUpBig"
              style={[
                styles.footer,
                {
                  backgroundColor: 'white',
                  paddingTop: 12,
                },
              ]}>
              {/* <Text style={[styles.text_footer, {
                            color: 'black'
                        }]}>{'Tên đăng nhập'}</Text> */}
              <View>
                {/* <FontAwesome
                                name="user-o"
                                color={'black'}
                                size={20}
                            /> */}
                {/* <TextInput
                                placeholder="Nhập tên đăng nhập"
                                placeholderTextColor="#666666"
                                style={[styles.textInput, {
                                    color: 'black'
                                }]}
                                autoCapitalize="none"
                                onChangeText={(val) => this.textInputChange(val)}
                                onEndEditing={(e) => this.handleValidUser(e.nativeEvent.text)}
                            /> */}
                <View
                  style={{
                    height: 50,
                    flex: 1,
                    alignItems: 'center',
                    marginBottom: 12,
                  }}>
                  <Image
                    source={logo_banner}
                    style={{height: 50, resizeMode: 'contain'}}
                  />
                </View>

                <InputView
                  id={1}
                  isCleared
                  // isSubmit={this.isSubmit}
                  style={styles.styleTextInput}
                  styleTextInputElement={styles.styleTextInputElement}
                  styleInput={styles.styleInput}
                  stylesIconLeft={styles.stylesIconLeft}
                  iconLeft={'customer-code'}
                  textTitle={'Tên đăng nhập'}
                  placeholder={'Tên đăng nhập...'}
                  value={this.state.userName}
                  returnKeyType={'next'}
                  onChangeText={this.setIputValue}
                  inputRef={(input) => (this.inputUsername = input)}
                  onSubmitEditing={() => {
                    this.inputPassword.focus();
                  }}
                />
                {this.state.check_textInputChange ? (
                  <Animatable.View animation="bounceIn">
                    {/* <Feather
                                        name="check-circle"
                                        color="green"
                                        size={20}
                                    /> */}
                  </Animatable.View>
                ) : null}
              </View>
              {this.state.isValidUser ? null : (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>
                    {'Tên đăng nhập dài hơn 4 kí tự'}
                  </Text>
                </Animatable.View>
              )}

              {/* <Text style={[styles.text_footer, {
                            color: 'black',
                            marginTop: 35
                        }]}>{'Mật khẩu'}</Text>
                        <View style={styles.action}>
                            <TextInput
                                placeholder="Vui lòng nhập mật khẩu"
                                placeholderTextColor="#666666"
                                secureTextEntry={this.state.secureTextEntry ? true : false}
                                style={[styles.textInput, {
                                    color: 'black'
                                }]}
                                autoCapitalize="none"
                                onChangeText={(val) => this.handlePasswordChange(val)}
                            />
                            <TouchableOpacity
                                onPress={this.updateSecureTextEntry}
                            >
                            </TouchableOpacity>
                        </View> */}

              <InputView
                id={2}
                isCleared
                isSubmit={this.isSubmit}
                style={[
                  styles.styleTextInput,
                  {marginBottom: configs.marginBottom10, marginTop: 20},
                ]}
                styleTextInputElement={styles.styleTextInputElement}
                styleInput={styles.styleInput}
                stylesIconLeft={styles.stylesIconLeft}
                iconLeft={this.state.iconPassword}
                textTitle={'Mật khẩu'}
                placeholder={'Mật khẩu...'}
                value={this.state.password}
                secureTextEntry={this.state.showPassword}
                onChangeText={this.setIputValue}
                onPressIconLeft={this.handleOnClickShowPassword}
                inputRef={(input) => (this.inputPassword = input)}
                returnKeyType={'go'}
                blurOnSubmit={true}
              />
              {this.state.isValidPassword ? null : (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>
                    {'Mật khẩu phải dài hơn 8 kí tự'}
                  </Text>
                </Animatable.View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 20,
                }}>
                <Checkbox
                  id={'1'}
                  isSelected={this.isSavePass}
                  onChange={this.setChangeCheckBox}
                  label={'Nhớ mật khẩu'}
                  labelStyle={{marginLeft: configs.marginLeft, fontSize: 12}}
                  containerStyle={[
                    {
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginTop: 20,
                      flex: 1,
                    },
                  ]}
                />

                {/* <TouchableOpacity style={{
                                flex: 1,
                                alignSelf: 'flex-end'
                            }} onPress={this.showDialogChonItemFromList}>
                                <Text style={{
                                    textAlign: 'right',
                                    fontStyle: 'italic',
                                    textDecorationLine: 'underline',
                                    fontSize: 12
                                }}>{'Chọn tài khoản'}</Text>
                            </TouchableOpacity> */}
              </View>

              <View style={[styles.button, {marginHorizontal: 20}]}>
                <TouchableOpacity
                  style={styles.signIn}
                  onPress={this.loginHandle}>
                  <LinearGradient
                    colors={['#4788d1', '#2e6eb8', '#24568f']}
                    style={styles.signIn}>
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: '#fff',
                        },
                      ]}>
                      {'Đăng nhập'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center'}}>
                {/* <TouchableOpacity onPress={configs.jumToRegisterPage}> */}
                  <Text style={styles.underline}>{'Đăng ký'}</Text>
                {/* </TouchableOpacity> */}
              </View>

              <View style={{alignItems: 'center'}}>
                <TouchableOpacity>
                  <Text style={styles.underline}>{'Quên mật khẩu?'}</Text>
                </TouchableOpacity>
              </View>

              {/* <View style={{ alignSelf: 'center' }}>
                            <TouchableOpacity>
                                <Text style={{ color: 'black', marginTop: 20, marginHorizontal: 20 }}>{'Đăng ký '}
                                    <Text onPress={() => {
                                        // this.props.navigation.navigate('IndexHome')
                                        // this.props.navigation.navigate('DangKyTraiNghiem')
                                    }} style={{ color: '#009387', textDecorationLine: 'underline', fontStyle: 'italic', fontSize: 16, fontWeight: 'bold' }}>{'tại đây'}</Text></Text>
                            </TouchableOpacity>
                        </View> */}
            </Animatable.View>
          </LinearGradient>

          {/* <DialogSelectItemFromList
                    isShowDialog={this.state.isShowDialog}
                    showDialog={this.showDialogChonItemFromList}
                    onDataSelectItem={this.setValueTextInput} /> */}
        </KeyboardAwareScrollView>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#009387'
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 30,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  styleTextInputElement: {
    flexDirection: 'row',
    height: configs.heightInput,
    borderColor: configs.colorMain,
    borderRadius: 8,
  },
  styleTextInput: {
    marginBottom: configs.marginBottom15,
    height: configs.heightInput,
    width: '90%',
    marginLeft: configs.marginLeft20,
    marginRight: configs.marginRight20,
  },
  stylesIconLeft: {
    backgroundColor: configs.bgIconInput,
    width: configs.widthIconInput,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: configs.borderRadius4,
    borderBottomLeftRadius: configs.borderRadius4,
    color: configs.colorMain,
  },
  underline: {
    color: '#009387',
    marginTop: 20,
    marginHorizontal: 20,
    textDecorationLine: 'underline',
  },
});

const mapStateToProps = (state) => ({
  LoginReducer: state.LoginReducer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setUpLogin: (params) => {
      api.setUpLogin(dispatch, params);
    },
    resetIsLogin: () => {
      dispatch(
        actions.requestIsLogin({
          isLogin: false,
          countImage: 0,
          permission: 0,
        }),
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
