import React from 'react';
import { StatusBar, StyleSheet, Alert, Image, TouchableOpacity, View, Text, Dimensions, ScrollView, ImageBackground, Platform } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import BaseViewAdmin from './BaseViewAdmin'
import LinearGradient from 'react-native-linear-gradient';
import IdSelect from '../IdSelect'
import { models } from '../../../../commons/model';
import { StackActions, NavigationActions } from 'react-navigation';
import Popup from '../../../components/Dialog';
import Root from '../../../components/Root';
import { api } from '../../../../commons/api/Api';

const AppStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: configs.heightStatusbar, }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

class UserInformation extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.dataLogin = models.getDataLogin()

        this.handleOnClickView = this.handleOnClickView.bind(this)
    }

    handleOnClickView = (value, id,) => {
        switch (id) {
            case IdSelect.idUserInfo:
                this.props.navigation.navigate('ThongTinNguoiDungScreen')
                break;
            case IdSelect.idNotification:
                this.props.navigation.navigate('ThongBaoScreen')
                break;
            case IdSelect.idChangePass:
                this.props.navigation.navigate('DoiMatKhauScreen')
                break;
            case IdSelect.idLogout:
                Popup.show({
                    type: 'Warning',
                    title: 'Cảnh báo đăng xuất',
                    textBody:
                        'Bạn có thực muốn đăng xuất khỏi tài khoản này hay không',
                    button: true,
                    buttonCancel: true,
                    callback: () => this.props.navigation.navigate('LoginScreen'),
                    callbackOk: () => Popup.hide(),
                });

                break;
        }
    }

    requestLogout = async () => {
        await this.props.getLogout();
        if (models.deleteAllData()) {
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              key: null,
              actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
            }),
          );
        } else {
          configs.showAlert('Đã có lỗi xảy ra khi đăng xuất, vui lòng thử lại');
        }
      };

    render() {
        return (
            <Root>
                <BaseViewAdmin stylesView={{ flex: 1, backgroundColor: 'white' }}
                    titleScreen={"Thông tin admin"}
                    subTitle={'havantam.it@gmail.com'}
                    styleToolbar={{ height: 45 }}
                    isBorderBottomWidth={false}
                    styleTitle={[styles.styleTitle]}
                    styleTitleToolbarBase={[styles.styleTitleToolbarBase, { color: 'white' }]}
                >

                    <View style={{ height: 180, alignItems: 'center' }}>
                        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 180, backgroundColor: 'rgba(0,0,0,0.20)' }}>
                            <Image source={require('../../../../assets/image/logo_datviet.png')} style={{ width: '100%', height: '100%', resizeMode: 'stretch', opacity: 0.1 }} />
                        </View>
                        <Image source={{ uri: this.dataLogin.avatar }} style={[{
                            width: 90,
                            height: 90,
                            borderRadius: 45,
                            backgroundColor: 'white',
                            padding: 8
                        }, { marginTop: 10, }]} />

                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', marginHorizontal: 12 }} numberOfLines={2} ellipsizeMode={'tail'}>
                            {"Tên: " + this.dataLogin.name}</Text>
                        <Text style={{ fontSize: 10, color: 'black' }}>{this.dataLogin.id_branch}</Text>
                        <Text style={{ fontSize: 10, color: 'black' }}>{"version: " + configs.VERSION_APP}</Text>
                    </View>

                    <TextView
                        id={IdSelect.idUserInfo}
                        onPress={this.handleOnClickView}
                        style={[styles.viewRow, {}]}
                        stylesTextContent={styles.viewContentRow}
                        styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45", flex: 1 }}
                        value={'Thông tin người dùng'}
                        iconLeft='user-login'
                        iconColor={configs.colorOrange}
                        iconSize={configs.sizeIcon18}
                        iconRight={'right-arrow1'}
                        iconRightSize={configs.sizeIcon18}
                    />
                    <TextView
                        id={IdSelect.idNotification}
                        onPress={this.handleOnClickView}
                        style={[styles.viewRow, {}]}
                        stylesTextContent={styles.viewContentRow}
                        styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45", flex: 1 }}
                        value={'Nhắc nhở'}
                        iconLeft='alarm-normal'
                        iconColor={configs.colorOrange}
                        iconSize={configs.sizeIcon18}
                        iconRight={'right-arrow1'}
                        iconRightSize={configs.sizeIcon18}
                    />
                    <TextView
                        id={IdSelect.idChangePass}
                        onPress={this.handleOnClickView}
                        style={[styles.viewRow, {}]}
                        stylesTextContent={styles.viewContentRow}
                        styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45", flex: 1 }}
                        value={'Đổi mật khẩu'}
                        iconLeft='lock-filled'
                        iconColor={configs.colorOrange}
                        iconSize={configs.sizeIcon18}
                        iconRight={'right-arrow1'}
                        iconRightSize={configs.sizeIcon18}
                    />
                    <TextView
                        id={IdSelect.idLogout}
                        onPress={this.handleOnClickView}
                        style={[styles.viewRow, {}]}
                        stylesTextContent={styles.viewContentRow}
                        styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45", flex: 1 }}
                        value={'Đăng xuất'}
                        iconLeft='logout'
                        iconColor={configs.colorOrange}
                        iconSize={configs.sizeIcon18}
                        iconRight={'right-arrow1'}
                        iconRightSize={configs.sizeIcon18}
                    />
                </BaseViewAdmin>
            </Root>
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
    styleTitleViewIcon: {
        fontSize: configs.fontSize14,
        fontFamily: 'Lato-Regular',
        color: 'black',
        textAlign: 'center',
    },
    styleViewToolbarBase: {
        backgroundColor: 'transparent',
        height: configs.heightToolBar,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    stylesubTitle: {
        fontFamily: 'Lato-Regular',
        color: configs.colorText,
        fontSize: 12,
        marginTop: -2
    },
    viewContentRow: {
        flexDirection: 'row',
        flex: 1,
        height: '100%',
        alignItems: 'center',
        marginLeft: configs.marginLeft10,
    },
    styleValue: {
        marginLeft: 12
    },
    styleTextView: {
        borderBottomWidth: 0.5,
        borderColor: 'gray',
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 12
    },
    viewRow: {
        backgroundColor: 'white',
        height: 50,
        paddingHorizontal: configs.padding15,
        borderBottomColor: configs.colorBorder,
        borderBottomWidth: 1
    },
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {
        getLogout: (params) => {
            api.getLogout(dispatch);
          },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(UserInformation)