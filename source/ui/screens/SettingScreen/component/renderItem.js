import React from 'react';
import { StyleSheet, Alert, Switch, TouchableOpacity, View, Text } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView } from 'react-native-gesture-handler';

class RenderItem extends BaseComponent {
    constructor(props) {
        super(props)
        let { dataItem } = this.props
        this.state = {
            isEnabledCheckLocation: dataItem.active_location === 1,
            isEnabledCheckWifi: dataItem.active_ip === 1,
            isShow: true
        }

        this.onclickHideView = this.onclickHideView.bind(this)
        this.toggleSwitchCheckLocation = this.toggleSwitchCheckLocation.bind(this)
        this.toggleSwitchCheckWifi = this.toggleSwitchCheckWifi.bind(this)
    }

    onclickHideView = () => {
        this.setState({ isShow: !this.state.isShow })
    }

    toggleSwitchCheckLocation = () => {
        let { isEnabledCheckLocation } = this.state
        this.setState({ isEnabledCheckLocation: !isEnabledCheckLocation }, () => {
            let params = this.props.dataItem
            params.active_location = (this.state.isEnabledCheckLocation ? 1 : 0)
            this.props.loadChangeCheck(params)
        })
    }

    toggleSwitchCheckWifi = () => {
        let { isEnabledCheckWifi } = this.state
        this.setState({ isEnabledCheckWifi: !isEnabledCheckWifi }, () => {
            let params = this.props.dataItem
            params.active_ip = (this.state.isEnabledCheckWifi ? 1 : 0)
            this.props.loadChangeCheck(params)
        })
    }

    render() {
        let { dataItem, index } = this.props
        let { isEnabledCheckLocation, isShow, isEnabledCheckWifi } = this.state
        return (
            <View>
                <View style={[styles.containerStyle, styles.viewRow, { marginTop: 8, backgroundColor: configs.colorBgCardVIew }]}>
                    <Text style={[styles.styleValue, { flex: 1 }]}>{index + '. Tên ca: '} <Text style={{ fontWeight: 'bold', color: 'black' }}>{dataItem.name}</Text></Text>
                    <IconView
                        onPress={this.onclickHideView}
                        name={isShow ? "arrow-down" : "arrow-up"}
                        size={30}
                        color={configs.colorOrange}
                    />
                </View>

                {isShow && <TouchableOpacity activeOpacity={1} onPress={this.toggleSwitchCheckLocation} style={[styles.containerStyle, styles.viewRow]}>
                    <IconView
                        name={"parcel_locate"}
                        size={configs.sizeIcon18}
                        color={configs.colorOrange}
                    />

                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.styleValue]}>{'Bật/tắt chế độ check vị trí'}</Text>
                    </View>

                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabledCheckLocation ? "red" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.toggleSwitchCheckLocation}
                        value={isEnabledCheckLocation}
                    />
                </TouchableOpacity>}

                {isShow && <TouchableOpacity activeOpacity={1} onPress={this.toggleSwitchCheckWifi} style={[styles.containerStyle, styles.viewRow]}>
                    <IconView
                        name={"customer-check"}
                        size={configs.sizeIcon18}
                        color={configs.colorOrange}
                    />

                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.styleValue]}>{'Bật/tắt chế độ checkIn bằng wifi'}</Text>
                    </View>

                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabledCheckWifi ? "red" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.toggleSwitchCheckWifi}
                        value={isEnabledCheckWifi}
                    />
                </TouchableOpacity>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    styleValue: {
        fontFamily: 'Lato-Regular',
        fontSize: configs.fontSize14,
        color: configs.colorText,
    },

    styleTextInput: {
        marginBottom: configs.marginBottom15,
        height: configs.heightInput,
        width: '90%',
        marginLeft: configs.marginLeft20,
        marginRight: configs.marginRight20,
    },
    containerStyle: {
        paddingTop: configs.paddingTop,
        paddingBottom: configs.paddingBottom,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    viewRow: {
        backgroundColor: 'white',
        height: 50,
        paddingHorizontal: configs.padding15,
        borderBottomColor: configs.colorBorder,
        borderBottomWidth: 1
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
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(RenderItem)