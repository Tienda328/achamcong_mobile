import React, { Component } from "react";
import { StatusBar, View, TouchableOpacity, Text, SafeAreaView, StyleSheet, KeyboardAwareScrollView, Image } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import IconView from './IconView'
import { AppDimensions, AppColors } from '../../commons/defined/index'
import { commonsConfigs as configs } from '../../commons'
import { borderRadiusButton } from "../../commons/defined/AppDimensions";
import { models } from "../../commons/model";

const AppStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: AppDimensions.heightStatusbar, }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

const logo_app = require('../../assets/image/logo.png')

class BaseView extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }

        this.dataLogin = models.getDataLogin()
    }

    drawIconLeft() {
        let { drawIconLeft, onClickBack } = this.props
        if (drawIconLeft) {
            return drawIconLeft
        } else {
            return (
                <TouchableOpacity style={[styles.styleViewIconLeftBase]}
                    onPress={onClickBack}>
                    <IconView
                        style={{ justifyContent: 'center', alignItems: 'center', }}
                        color='white'
                        name={"left-arrow"}
                        size={AppDimensions.sizeIcon20}
                        height={AppDimensions.sizeIcon20}
                    />
                </TouchableOpacity>
            )
        }
    }

    drawIconRight() {
        let { drawIconRight, onClickIconRight, nameIconRight, colorIconRight, fontSizeIconRight = AppDimensions.sizeIcon20 } = this.props
        if (drawIconRight) {
            return drawIconRight
        } else {
            return (
                <TouchableOpacity style={[styles.styleViewIconRightBase]}
                    onPress={onClickIconRight}>
                    <IconView
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                        color={colorIconRight}
                        name={nameIconRight}
                        size={fontSizeIconRight}
                        height={AppDimensions.sizeIcon20}
                    />
                </TouchableOpacity>
            )
        }
    }

    drawViewScreen() {
        let { drawViewScreen } = this.props
        if (drawViewScreen) {
            return drawViewScreen
        }
        return null
    }

    render() {
        let { isShowIconLeft = true, isScroll = true,
            isShowIconRight, styleContent,
            children, titleScreen,
            styleTitle, styleTitleToolbarBase, isShowViewScreen,
            stylesubTitle, subTitle,
            isShowLogo = true, stylesViewTitle,
            isBorderBottomWidth = true,
            isShowSubTitle = false,
            stylesView } = this.props
        return (
            <View style={[stylesView]}>
                <LinearGradient
                    locations={[0, 0.5, 0.8]}
                    // colors={['white', 'white', 'white']}
                    colors={['#e6e6e6', '#f2f2f2', '#ffffff']}
                    // colors={[AppColors.colorMainDaiMau1, AppColors.colorMainDaiMau2, AppColors.colorMainDaiMau3]}
                    style={[styles.linearGradient, isBorderBottomWidth ? styles.styleLinear : {}]}>
                    <AppStatusBar
                        backgroundColor='transparent'
                        style={{ height: AppDimensions.heightStatusbar, }}
                    />
                    {/* <SafeAreaView
                        backgroundColor='#F7A81B'
                    /> */}

                    {/* ve tollbar va icon left */}
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        {isShowViewScreen && this.drawViewScreen()}
                        {isShowIconLeft && this.drawIconLeft()}
                        <View style={[styles.styleViewToolbarBase, styleTitle]}>
                            {isShowLogo && <Image
                                source={logo_app}
                                style={{ width: 40, height: 40 }}
                            />}
                            <View style={[stylesViewTitle, { marginLeft: 8 }]}>
                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.styleTitleToolbarBase, styleTitleToolbarBase]}>{titleScreen}</Text>
                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.stylesubTitle, stylesubTitle]}>{isShowSubTitle ? subTitle : (this.dataLogin && this.dataLogin.email ? this.dataLogin.email : '')}</Text>
                            </View>
                        </View>
                        {isShowIconRight && this.drawIconRight()}
                    </View>
                </LinearGradient>
                {styleContent ?
                    <View style={styleContent}>
                        {children}
                    </View>
                    : children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    linearGradient: {
        paddingBottom: 8,
        shadowColor: 'gray',
    },
    styleLinear: {
        elevation: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 1,
            width: 1
        },
        borderBottomWidth: 0.5,
        borderBottomColor: AppColors.colorBorder
    },

    styleViewIconLeftBase: {
        position: 'absolute',
        padding: AppDimensions.padding,
        height: '100%',
        width: AppDimensions.heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: AppDimensions.marginLeft10,
    },

    styleViewIconRightBase: {
        padding: AppDimensions.padding,
        width: AppDimensions.heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 12
    },

    styleViewToolbarBase: {
        backgroundColor: 'transparent',
        height: AppDimensions.heightToolBar,
        alignItems: 'center',
        flexDirection: 'row',
    },

    styleTitleToolbarBase: {
        fontWeight: 'bold',

    },
    stylesubTitle: {
        // paddingHorizontal: AppDimensions.heightToolBar + 20,
        fontFamily: 'Lato-Regular',
        color: configs.colorText,
        fontSize: 12,
        marginTop: -2
    }
})

export default BaseView
