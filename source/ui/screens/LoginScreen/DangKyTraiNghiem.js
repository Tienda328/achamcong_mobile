import React, { Component } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, TextInput, Text, StatusBar, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import { IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';
import { BaseComponent, BaseView, PagerTabIndicator, Checkbox, InputView } from '../../components/index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { commonsConfigs as configs } from '../../../commons'
import { StackActions, NavigationActions } from 'react-navigation'
import { api } from '../../../commons/api/Api';
import { actions } from '../../../commons/action';
import { models } from '../../../commons/model';


const logo_ninja = require('../../../assets/image/logo_ninja.png')
const logo_banner = require('../../../assets/image/logo_banner.png')

class DangKyTraiNghiem extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            userName: '',
            password: '',
            userCompany: '',
            iconPassword: 'password-login',
        }
        this.isSavePass = true

        this.loginHandle = this.loginHandle.bind(this)
        this.setIputValue = this.setIputValue.bind(this)
        this.handleOnClickShowPassword = this.handleOnClickShowPassword.bind(this)
        this.setChangeCheckBox = this.setChangeCheckBox.bind(this)
    }

    backPressed = () => {
        return true;
    }

    setIputValue = (id, value) => {
        let { userName, password } = this.state
        if (id === 1) {
            this.setState({ userCompany: value })
        } else if (id === 4) {
            this.setState({ password: value })
            if (password && password !== '') {
                this.setState(prevState => ({
                    iconPassword: prevState.iconPassword = (this.state.showPassword ? "eye-on" : "eye-off")
                }))
            } else {
                this.setState(prevState => ({
                    iconPassword: prevState.iconPassword = "password-login"
                }))
            }
        }
    }

    handleOnClickShowPassword = () => {
        let { userName, password } = this.state
        if (password && password !== '') {
            this.setState({
                iconPassword: (!this.state.showPassword ? "eye-on" : "eye-off"),
                showPassword: !this.state.showPassword,
            })
        }
    }

    loginHandle = () => {

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.LoginReducer) {
            if (this.props.LoginReducer.dataCreateTrial && (this.props.LoginReducer.dataCreateTrial !== prevProps.LoginReducer.dataCreateTrial)) {
                
            }
        }
    }

    setChangeCheckBox = (id, value) => {
        this.isSavePass = value
    }

    render() {
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#4788d1', '#2e6eb8', '#24568f']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    // locations={[0, 0.1, 0.5]}

                    style={[styles.container, {
                        flex: 1,
                    }]}>
                    <StatusBar backgroundColor='#4788d1' barStyle="light-content" />
                    <View style={styles.header}>
                        <Text style={styles.text_header}>{'Đăng ký trải nghiệm!'}</Text>
                    </View>
                    <Animatable.View
                        animation="fadeInUpBig"
                        style={[styles.footer, {
                            backgroundColor: 'white',
                            paddingTop: 12
                        }]}
                    >
                        <View style={{ height: 50, alignItems: 'center' }}>
                            <Image
                                source={logo_banner}
                                style={{ height: 50, resizeMode: 'contain' }}
                            />
                        </View>

                        <View style={{ flex: 1, marginTop: 12 }}>
                            <InputView
                                id={1}
                                isCleared
                                // isSubmit={this.isSubmit}
                                style={styles.styleTextInput}
                                styleTextInputElement={styles.styleTextInputElement}
                                styleInput={styles.styleInput}
                                stylesIconLeft={styles.stylesIconLeft}
                                iconLeft={"customer-code"}
                                textTitle={'Tên công ty'}
                                placeholder={"Tên công ty..."}
                                value={this.state.userCompany}
                                returnKeyType={"next"}
                                onChangeText={this.setIputValue}
                            // inputRef={input => this.inputUsername = input}
                            // onSubmitEditing={() => { this.inputPassword.focus() }}
                            />

                            <InputView
                                id={2}
                                isCleared
                                // isSubmit={this.isSubmit}
                                style={[styles.styleTextInput, { marginBottom: configs.marginBottom10, marginTop: 10 }]}
                                styleTextInputElement={styles.styleTextInputElement}
                                styleInput={styles.styleInput}
                                stylesIconLeft={styles.stylesIconLeft}
                                iconLeft={"customer-code"}
                                textTitle={'Tên đăng nhập'}
                                placeholder={"Tên đăng nhập..."}
                                value={this.state.userName}
                                returnKeyType={"next"}
                                onChangeText={this.setIputValue}
                                inputRef={input => this.inputUsername = input}
                                onSubmitEditing={() => { this.inputPassword.focus() }}
                            />

                            <InputView
                                id={3}
                                isCleared
                                // isSubmit={this.isSubmit}
                                style={[styles.styleTextInput, { marginBottom: configs.marginBottom10, marginTop: 10 }]}
                                styleTextInputElement={styles.styleTextInputElement}
                                styleInput={styles.styleInput}
                                stylesIconLeft={styles.stylesIconLeft}
                                iconLeft={"customer-code"}
                                textTitle={'Số điện thoại'}
                                placeholder={"Nhập số điện thoại..."}
                                value={this.state.userName}
                                returnKeyType={"next"}
                                onChangeText={this.setIputValue}
                                inputRef={input => this.inputUsername = input}
                                onSubmitEditing={() => { this.inputPassword.focus() }}
                            />

                            <InputView
                                id={4}
                                isCleared
                                isSubmit={this.isSubmit}
                                style={[styles.styleTextInput, { marginBottom: configs.marginBottom10, marginTop: 10 }]}
                                styleTextInputElement={styles.styleTextInputElement}
                                styleInput={styles.styleInput}
                                stylesIconLeft={styles.stylesIconLeft}
                                iconLeft={this.state.iconPassword}
                                textTitle={'Mật khẩu'}
                                placeholder={"Mật khẩu..."}
                                value={this.state.password}
                                secureTextEntry={this.state.showPassword}
                                onChangeText={this.setIputValue}
                                onPressIconLeft={this.handleOnClickShowPassword}
                                inputRef={input => this.inputPassword = input}
                                returnKeyType={"go"}
                                blurOnSubmit={true}
                            />

                            <InputView
                                id={5}
                                isCleared
                                isSubmit={this.isSubmit}
                                style={[styles.styleTextInput, { marginBottom: 20, marginTop: 10 }]}
                                styleTextInputElement={styles.styleTextInputElement}
                                styleInput={styles.styleInput}
                                stylesIconLeft={styles.stylesIconLeft}
                                iconLeft={this.state.iconPassword}
                                textTitle={'Nhập lại mật khẩu'}
                                placeholder={"Nhập lại mật khẩu..."}
                                value={this.state.password}
                                secureTextEntry={this.state.showPassword}
                                onChangeText={this.setIputValue}
                                onPressIconLeft={this.handleOnClickShowPassword}
                                inputRef={input => this.inputPassword = input}
                                returnKeyType={"go"}
                                blurOnSubmit={true}
                            />
                        </View>

                        <View style={[styles.button, { marginHorizontal: 20 }]}>
                            <TouchableOpacity
                                style={styles.signIn}
                                onPress={this.loginHandle}
                            >
                                <LinearGradient
                                    colors={['#4788d1', '#2e6eb8', '#24568f']}
                                    style={styles.signIn}
                                >
                                    <Text style={[styles.textSign, {
                                        color: '#fff'
                                    }]}>{'Đăng ký trải nghiệm'}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                    </Animatable.View>
                </LinearGradient>
            </KeyboardAwareScrollView>
        )
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
        paddingBottom: 50
    },
    footer: {
        flex: 6,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        // paddingHorizontal: 20,
        paddingVertical: 12
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
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
        marginTop: 12
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    styleTextInputElement: {
        flexDirection: 'row',
        height: configs.heightInput,
        borderColor: configs.colorMain,
        borderRadius: 8
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
});

const mapStateToProps = state => ({
    LoginReducer: state.LoginReducer
});

const mapDispatchToProps = (dispatch) => {
    return {

        setUpCreateTrial: (params) => {
            api.setUpLogin(dispatch, params)
        },
        setUpLogin: (params) => {
            api.setUpLogin(dispatch, params)
        },
        resetIsLogin: () => {
            dispatch(actions.requestIsLogin({
                isLogin: false,
                countImage: 0,
                permission: 0
            }))
        }
    }

};

export default connect(mapStateToProps, mapDispatchToProps)(DangKyTraiNghiem)