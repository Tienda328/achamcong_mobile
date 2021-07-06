import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, BackHandler } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, InputView } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons'
import { ScrollView } from 'react-native-gesture-handler';
import { api } from '../../../commons/api/Api';
import { models } from '../../../commons/model';
import { StackActions, NavigationActions } from 'react-navigation'

class DoiMatKhauScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            textPass: '',
            textPassNew: '',
            textPassConfirmation: '',
        }
        this.requestChangePass = this.requestChangePass.bind(this)
        this.setValueTextInput = this.setValueTextInput.bind(this)
        this.handleMenu = this.handleMenu.bind(this)
    }

    requestChangePass = () => {
        let { textPass, textPassNew, textPassConfirmation } = this.state
        if (!textPass || textPass.trim().length === 0) {
            configs.showAlert('Vui lòng nhập mật khẩu cũ')
        } else if (!textPassNew || textPassNew.trim().length === 0) {
            configs.showAlert('Vui lòng nhập mật khẩu mới')
        } else if (!textPassConfirmation || textPassConfirmation.trim().length === 0) {
            configs.showAlert('Vui lòng nhập lại mật khẩu mới')
        } else if (textPassConfirmation !== textPassNew) {
            configs.showAlert('"Mật khẩu mới" và "Nhập lại mật khẩu" đang khác nhau')
        } else {
            let params = {
                "current-password": textPass,
                "password": textPassNew,
                "password_confirmation": textPassConfirmation
            }
            this.props.requestChangePassword(params)
        }
    }

    setValueTextInput = (id, value) => {
        switch (id) {
            case 1:
                this.setState({
                    textPass: value
                })
                break
            case 2:
                this.setState({
                    textPassNew: value
                })
                break
            case 3:
                this.setState({
                    textPassConfirmation: value
                })
                break
        }
    }

    handleMenu = () => {
        if (this.props.handleMenu) {
            this.props.handleMenu()
        } else {
            this.props.navigation.goBack();
            return true
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleMenu);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleMenu);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.DoiMatKhauReducer) {
            if (this.props.DoiMatKhauReducer.messageChangePass && (this.props.DoiMatKhauReducer.messageChangePass !== prevProps.DoiMatKhauReducer.messageChangePass)) {
                console.log(JSON.stringify(this.props.DoiMatKhauReducer.messageChangePass))
                let message = this.props.DoiMatKhauReducer.messageChangePass
                if (message.message === "Đổi mật khẩu thành công") { models.deleteAllData() }
                setTimeout(() => {
                    Alert.alert(
                        configs.APP_NAME,
                        message && message.message ? message.message : 'Thay đổi mật khẩu thành công',
                        [
                            {
                                text: configs.DONG_Y,
                                onPress: () => {
                                    if (message.message === "Đổi mật khẩu thành công") {
                                        this.props.navigation.dispatch(
                                            StackActions.reset({
                                                index: 0,
                                                key: null,
                                                actions: [NavigationActions.navigate({ routeName: 'SplashScreen' })]
                                            })
                                        )
                                    }
                                },
                            },
                        ],
                        { cancelable: false },
                    );
                }, 700);
            }
        }
    }

    render() {
        return (
            <BaseView stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={"Đổi mật khẩu"}
                subTitle={'havantam.it@gmail.com'}
                styleToolbar={{ height: 45 }}
                styleTitle={[styles.styleTitle]}
                styleTitleToolbarBase={styles.styleTitleToolbarBase}
                drawIconLeft={
                    <TouchableOpacity style={[styles.styleViewIconLeftBase]}
                        onPress={this.handleMenu}>
                        {/* <Image
                            source={icon_menu}
                            style={{ justifyContent: 'center', alignItems: 'center', width: 30, height: 30, tintColor: 'black' }}
                        /> */}

                        <IconView
                            style={{ justifyContent: 'center', alignItems: 'center', }}
                            color='black'
                            name={"left-arrow"}
                            size={configs.sizeIcon20}
                            height={configs.sizeIcon20}
                        />
                    </TouchableOpacity>
                }
            >
                <CardView
                    styleCard={{ margin: 12, marginTop: 24, paddingBottom: 12, borderWidth: 0.5, borderColor: '#737373', }}
                    styleTitleCard={{ fontWeight: 'bold', fontSize: 16 }}
                    titleCard={"Nhập mật khẩu"}
                    // nameIcon={isArrowShow ? 'arrow-down' : 'arrow-up'}
                    stylesBgIcon={{}}
                    sizeIcon={configs.sizeIcon24}>

                    <InputView
                        id={1}
                        isCleared
                        style={[styles.styleInput]}
                        styleTextInputElement={[styles.styleTextInputElement]}
                        placeholder={"Nhập mật khẩu cũ ..."}
                        value={this.state.textPass}
                        blurOnSubmit={true}
                        iconLeft={'password-login'}
                        textTitle={"Mật khẩu cũ: "}
                        secureTextEntry={true}
                        onChangeText={this.setValueTextInput}
                    />

                    <InputView
                        id={2}
                        isCleared
                        style={[styles.styleInput]}
                        styleTextInputElement={[styles.styleTextInputElement]}
                        placeholder={"Nhập mật khẩu mới ..."}
                        value={this.state.textPassNew}
                        blurOnSubmit={true}
                        iconLeft={'password-login'}
                        textTitle={"mật khẩu mới: "}
                        secureTextEntry={true}
                        onChangeText={this.setValueTextInput}
                    />

                    <InputView
                        id={3}
                        isCleared
                        style={[styles.styleInput]}
                        styleTextInputElement={[styles.styleTextInputElement]}
                        placeholder={"Nhập lại mật khẩu ..."}
                        value={this.state.textPassConfirmation}
                        blurOnSubmit={true}
                        iconLeft={'password-login'}
                        textTitle={"mật khẩu mới: "}
                        secureTextEntry={true}
                        onChangeText={this.setValueTextInput}
                    />

                    <View style={{ paddingHorizontal: 12, marginTop: 24 }}>
                        <TouchableOpacity onPress={this.requestChangePass} style={{
                            backgroundColor: configs.colorMain, paddingVertical: 10,
                            justifyContent: 'center', alignItems: 'center',
                            borderRadius: 8, borderWidth: 1, borderColor: 'gray',
                            shadowColor: 'gray',
                            elevation: 2,
                            shadowOpacity: 0.5,
                            shadowOffset: {
                                height: 1,
                                width: 1
                            }
                        }}>
                            <Text style={[styles.styleTitle, { color: 'white', fontWeight: 'bold', fontSize: 18 }]}>{'Đồng ý'}</Text>
                        </TouchableOpacity>
                    </View>
                </CardView>
            </BaseView>
        )
    }
}

const styles = StyleSheet.create({
    styleTitle: {
        fontSize: configs.fontSize14_5,
        fontFamily: 'Lato-Regular',
        color: 'black',
    },
    styleTitleToolbarBase: {
        color: 'black',
        fontSize: 18,
    },
    styleViewIconLeftBase: {
        padding: configs.padding,
        width: configs.heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: configs.marginLeft10,
    },
    styleInput: {
        marginTop: configs.margin10,
        paddingHorizontal: 12
    },
    styleTextInputElement: {
        flexDirection: 'row',
        height: configs.heightInput40,
        borderColor: configs.colorTitleCard,
        borderRadius: 8

    },
})

const mapStateToProps = state => ({
    DoiMatKhauReducer: state.DoiMatKhauReducer
});

const mapDispatchToProps = (dispatch) => {
    return {

        requestChangePassword: (params) => {
            api.requestChangePassword(dispatch, params)
        }

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DoiMatKhauScreen)