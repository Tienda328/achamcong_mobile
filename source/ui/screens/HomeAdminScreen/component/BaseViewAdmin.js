import React, { Component } from "react";
import { StatusBar, View, TouchableOpacity, Text, SafeAreaView, StyleSheet, KeyboardAwareScrollView, Image } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { IconView } from '../../../components'
import { commonsConfigs as configs } from '../../../../commons'
import { models } from "../../../../commons/model";

const AppStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: configs.heightStatusbar, }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

const logo_app = require('../../../../assets/image/logo.png')

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
                        size={configs.sizeIcon20}
                        height={configs.sizeIcon20}
                    />
                </TouchableOpacity>
            )
        }
    }

    render() {
        let { isShowIconLeft, isScroll = true,
            isShowIconRight, styleContent,
            children, titleScreen,
            styleTitle, styleTitleToolbarBase, isShowViewScreen,
            stylesubTitle, subTitle,
            isShowLogo = true, stylesViewTitle,
            isBorderBottomWidth = true,
            isShowSubTitle = false,
            stylesView, onClickBack } = this.props
        return (
            <View style={[stylesView]}>
                <LinearGradient
                    locations={[0, 0.5, 0.8]}
                    colors={['#3366ff', '#4d79ff', '#809fff']}
                    style={[styles.linearGradient, isBorderBottomWidth ? styles.styleLinear : {}]}>
                    <AppStatusBar
                        backgroundColor='transparent'
                        style={{ height: configs.heightStatusbar, }}
                    />
                    <View style={{
                        flexDirection: 'row', position: 'relative'
                    }}>
                        <View style={[styles.styleViewToolbarBase, styleTitle]}>
                            {isShowLogo && <Image
                                source={logo_app}
                                style={{ width: 40, height: 40, position: 'absolute', left: 12 }}
                            />}
                            <View style={[stylesViewTitle, { marginLeft: 8, flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.styleTitleToolbarBase, styleTitleToolbarBase]}>{titleScreen}</Text>
                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.stylesubTitle, stylesubTitle]}>{isShowSubTitle ? subTitle : (this.dataLogin && this.dataLogin.email ? this.dataLogin.email : '')}</Text>
                            </View>
                        </View>

                        {isShowIconLeft ?
                            <IconView
                                onPress={onClickBack}
                                style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 8, position: 'absolute', left: 12, top: 12 }}
                                color='white'
                                name={"left-arrow"}
                                size={configs.sizeIcon20}
                                height={configs.sizeIcon20}
                            /> : <View />}
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
        borderBottomColor: configs.colorBorder
    },

    styleViewIconLeftBase: {
        position: 'absolute',
        padding: configs.padding,
        height: '100%',
        width: configs.heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: configs.marginLeft10,
    },

    styleViewIconRightBase: {
        padding: configs.padding,
        width: configs.heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 12
    },

    styleViewToolbarBase: {
        backgroundColor: 'transparent',
        height: configs.heightToolBar,
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
    },

    styleTitleToolbarBase: {
        fontWeight: 'bold',
        color: 'white'
    },
    stylesubTitle: {
        // paddingHorizontal: AppDimensions.heightToolBar + 20,
        fontFamily: 'Lato-Regular',
        color: configs.colorText,
        fontSize: 12,
        marginTop: -2,
        color: 'white'
    }
})

export default BaseView
