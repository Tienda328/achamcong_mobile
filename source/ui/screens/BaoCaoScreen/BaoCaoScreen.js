
import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, Animated } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons'
import { LocaleConfig, Calendar, Agenda, CalendarList } from 'react-native-calendars';
import { api } from '../../../commons/api/Api';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import BaoCaoScreen from './BaoCaoScreen.js'
import LocBaoCaoScreen from '../LocBaoCaoScreen/index.js'

LocaleConfig.locales['fr'] = {
    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    monthNamesShort: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';

const icon_menu = require('../../../assets/image/icon_menu.png')
class BaoCaoSScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            checkNgayNghiDate: 0,
            isShowPickerDate: false,
            isShowDialog: false,
            reRender: false,
        }
        this.toDate = ''
        this.dateNgayNghi = ''
        this.fromDate = ''
        this.indexPickerDate = 0

        this.dataSeleLoaiNghi = {}
        this.indexPage = 0

        this.currentPage = this.currentPage.bind(this)
        this.handleMenu = this.handleMenu.bind(this)

    }

    currentPage = (currentpage) => {
        // this.props.setIndexTabParcel(currentpage.i)
        this.indexPage = currentpage.i
    }

    handleMenu = () => {
        this.indexPage = 0
        if (Platform.OS === 'android') {
            setTimeout(() => {
                this.scrollableTabView.goToPage(0)
                this.props.handleMenu()
            }, 300);
        } else {
            this.props.handleMenu()
        }

    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    render() {
        return (
            <BaseView stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={"Báo cáo"}
                subTitle={'havantam.it@gmail.com'}
                isBorderBottomWidth={false}
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

                <ScrollableTabView
                    ref={(ref) => { this.scrollableTabView = ref; }}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={false}
                    renderTabBar={() => (<DefaultTabBar />)}
                    onScroll={(x) => scrollX.setValue(x)}
                    // page={this.state.indexPage}
                    initialPage={this.indexPage}
                    onChangeTab={this.currentPage}
                >

                    <BaoCaoScreen tabLabel='Báo cáo' />
                    <LocBaoCaoScreen tabLabel='Lọc báo cáo' />

                </ScrollableTabView>
            </BaseView>
        )
    }
}
export const scrollX = new Animated.Value(0);

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
    },
    styleTextInputElement: {
        flexDirection: 'row',
        height: configs.heightInput40,
        borderColor: configs.colorTitleCard,
        // borderColor: configs.colorBorder,
        borderWidth: 0.5,
        borderRadius: 8,
    },
    tabBarStyle: {
        backgroundColor: configs.colorMain,
        borderTopColor: configs.colorDivide,
        width: '100%',
        borderTopWidth: 0,
        paddingLeft: 5,
        marginTop: 0,
    },
})
const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(BaoCaoSScreen)