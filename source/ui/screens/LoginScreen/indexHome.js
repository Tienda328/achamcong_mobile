import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, BackHandler } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, InputView } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons'
import { ScrollView } from 'react-native-gesture-handler';
import { api } from '../../../commons/api/Api';
import { models } from '../../../commons/model';
import { StackActions, NavigationActions } from 'react-navigation'
import WebView from 'react-native-webview';

class DoiMatKhauScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleMenu);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleMenu);
    }

    render() {
        return (
            <WebView source={{ uri: 'https://achamcong.net/' }} />
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