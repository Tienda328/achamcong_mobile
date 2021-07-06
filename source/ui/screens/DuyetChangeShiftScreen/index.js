import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, BackHandler } from 'react-native';
import { BaseComponent, BaseView, IconView } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import DuyetChangeShift from './component/DuyetChangeShift';
import LichSuDuyetChangeShift from './component/LichSuDuyetChangeShift';

class DuyetChangeShiftScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.currentPage = this.currentPage.bind(this)
        this.backPressed = this.backPressed.bind(this)
    }

    currentPage = (currentpage) => {
        this.indexPage = currentpage.i
    }

    backPressed = () => {
        this.props.navigation.goBack();
        return true;
    }

    componentDidMount() {
        console.log('Duyệt chuyển đổi ca screen');
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    render() {
        return (
            <BaseView stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={"Duyệt chuyển đổi ca"}
                subTitle={'havantam.it@gmail.com'}
                styleToolbar={{ height: 45 }}
                isBorderBottomWidth={false}
                styleTitle={[styles.styleTitle]}
                styleTitleToolbarBase={styles.styleTitleToolbarBase}
                drawIconLeft={
                    <TouchableOpacity style={[styles.styleViewIconLeftBase]}
                        onPress={this.backPressed}>
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
                    locked={true}
                    initialPage={this.indexPage}
                    onChangeTab={this.currentPage}
                >

                    <DuyetChangeShift
                        navigation={this.props.navigation}
                        tabLabel='Duyệt' />
                    <LichSuDuyetChangeShift
                        navigation={this.props.navigation} tabLabel='Đơn duyệt' type={1} />
                    <LichSuDuyetChangeShift
                        navigation={this.props.navigation} tabLabel='Đơn từ chối' type={2} />

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
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DuyetChangeShiftScreen);