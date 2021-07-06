import React from 'react'
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar'
import { commonsConfigs as configs } from '../../../commons'
import ChartStatisticalScreen from '../ChartStatisticalScreen'
import ListDuyetNghiPhep from './component/ListDuyetNghiPhep'
import SettingScreen from '../SettingScreen/index'
import UserInformation from './component/UserInformation'
import { StatusBar, StyleSheet, Alert, Image, TouchableOpacity, View, Text, Dimensions, ScrollView, ImageBackground, Platform } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView } from '../../components';
import { connect } from 'react-redux';

const Tabs = AnimatedTabBarNavigator()
class HomeAdminScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.renderListDuyetNghiPhep = this.renderListDuyetNghiPhep.bind(this)
        this.renderUserInformation = this.renderUserInformation.bind(this)
        this.renderChartStatisticalScreen = this.renderChartStatisticalScreen.bind(this)
        this.renderSettingScreen = this.renderSettingScreen.bind(this)
    }

    renderListDuyetNghiPhep = () => {
        return (
            <ListDuyetNghiPhep
                navigation={this.props.navigation}
            />
        )
    }

    renderUserInformation = () => {
        return (
            <UserInformation
                navigation={this.props.navigation}
            />
        )
    }

    renderChartStatisticalScreen = () => {
        return (
            <ChartStatisticalScreen
                navigation={this.props.navigation}
            />
        )
    }

    renderSettingScreen = () => {
        return (
            <SettingScreen
                navigation={this.props.navigation}
            />
        )
    }


    render() {
        return (
            <Tabs.Navigator initialRouteName="thongke"
                tabBarOptions={{
                    activeTintColor: 'white',
                    activeBackgroundColor: configs.colorMain,
                    tabStyle: {
                        // borderRadius: 16,
                        backgroundColor: "white",
                        // margin: 12,
                    },
                    labelStyle: {
                    }
                }}
                appearence={{
                    // floating: true,
                    dotCornerRadius: 10,
                    // tabBarBackground: "#f2f2f2"
                }}
                lazy={true}
                tabBarPosition="bottom"

            >
                <Tabs.Screen
                    name="thongke"
                    component={this.renderChartStatisticalScreen}
                    options={{
                        tabBarLabel: "Thống kê",
                        tabBarIcon: ({ focused, color }) => (
                            <IconView
                                name={'home-address'}
                                color={color}
                                size={20}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="DuyetNghiPhep"
                    component={this.renderListDuyetNghiPhep}
                    options={{
                        tabBarLabel: "Duyệt nghỉ phép",
                        tabBarIcon: ({ focused, color }) => (
                            <IconView
                                name={'data-transfer'}
                                color={color}
                                size={20}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="setting"
                    component={this.renderSettingScreen}
                    options={{
                        tabBarLabel: "Cài đặt",
                        tabBarIcon: ({ focused, color }) => (
                            <IconView
                                name={'change-contacts'}
                                color={color}
                                size={20}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="NguoiDung"
                    component={this.renderUserInformation}
                    options={{
                        tabBarLabel: "Thông tin admin",
                        tabBarIcon: ({ focused, color }) => (
                            <IconView
                                name={'user-login'}
                                color={color}
                                size={20}
                            />
                        ),
                    }}
                />
            </Tabs.Navigator>
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

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeAdminScreen)