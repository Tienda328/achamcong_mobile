import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Animated, BackHandler } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons'
import { ScrollView } from 'react-native-gesture-handler';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import DuyetDiMuonVeSom from './component/DuyetDiMuonVeSom'
import LichSuDuyetDiMuonVeSom from './component/LichSuDuyetDiMuonVeSom'

class DuyetDiMuonVeSomScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.currentPage = this.currentPage.bind(this)
        this.backPressed = this.backPressed.bind(this)
    }

    currentPage = (currentpage) => {
        // this.props.setIndexTabParcel(currentpage.i)
        this.indexPage = currentpage.i
    }

    backPressed = () => {
        this.props.navigation.goBack();
        return true;
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    render() {
        return (
            <BaseView stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={"Duyệt đi muộn về sớm"}
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
                    // page={this.state.indexPage}
                    locked={true}
                    initialPage={this.indexPage}
                    onChangeTab={this.currentPage}
                >

                    <DuyetDiMuonVeSom
                        navigation={this.props.navigation}
                        tabLabel='Duyệt' />
                    <LichSuDuyetDiMuonVeSom
                        navigation={this.props.navigation} tabLabel='Đơn duyệt' type={1} />
                    <LichSuDuyetDiMuonVeSom
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
export default connect(mapStateToProps, mapDispatchToProps)(DuyetDiMuonVeSomScreen)