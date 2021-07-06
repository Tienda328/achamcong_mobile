import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Animated, BackHandler, Dimensions, Text } from 'react-native';
import { BaseComponent, BaseView, InputView, IconView } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons'
import { ScrollView } from 'react-native-gesture-handler';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import DetailDon from './component/DetailDon'
import ChartDetail from './component/ChartDetail'
import Popover from 'react-native-popover-view';
import { models } from '../../../commons/model';
import { actions } from '../../../commons/action';

class DuyetDetailAllScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            showPopover: false
        }
        this.backPressed = this.backPressed.bind(this)
        this.currentPage = this.currentPage.bind(this)
        this.dataDetail = {}
        try {
            this.dataDetail = this.props.navigation.state.params.params
            console.log("this.dataDetail:   " + JSON.stringify(this.dataDetail))
            //1 nghỉ phép, 2 xinddi muộn về sớm, 3 xin quen cham cong
            this.type = this.props.navigation.state.params.type
        } catch (error) {

        }
        this.textLyDoTuChoi = ''
        this.dataLogin = models.getDataLogin()

        this.setShowPopover = this.setShowPopover.bind(this)
        this.duyetNghiPhepApi = this.duyetNghiPhepApi.bind(this)
    }

    currentPage = (currentpage) => {
        // this.props.setIndexTabParcel(currentpage.i)
        this.indexPage = currentpage.i
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        this.props.navigation.goBack();
        return true;
    }

    setShowPopover = (showPopover = false) => {
        this.setState({
            showPopover: showPopover
        })
    }

    duyetNghiPhepApi = (isDuyet) => {
        this.setShowPopover(false)

    }

    duyetDiMuonVeSomApi = (isDuyet) => {
        this.setShowPopover(false)
    }

    render() {
        let { showPopover } = this.state
        return (
            <BaseView stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={this.type === 1 ? "Chi tiết nghỉ phép" : "Chi tiết đi muộn về sớm"}
                subTitle={'havantam.it@gmail.com'}
                styleToolbar={{ height: 45 }}
                isBorderBottomWidth={false}
                styleTitle={[styles.styleTitle, { flex: 1 }]}
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
                isShowIconRight={true}
                nameIconRight={'verified'}
                colorIconRight={configs.colorMain}
                onClickIconRight={() => { this.setShowPopover(true) }}
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

                    <DetailDon
                        navigation={this.props.navigation}
                        dataDetail={this.dataDetail}
                        type={this.type}
                        tabLabel='Chi tiết đơn' />
                    <ChartDetail
                        navigation={this.props.navigation}
                        dataDetail={this.dataDetail}
                        type={this.type}
                        tabLabel='Biểu đồ' />

                </ScrollableTabView>



                <Popover
                    // animationConfig={{ duration: 500, easing: Easing.circle }}
                    popoverStyle={{ backgroundColor: 'transparent' }}
                    isVisible={showPopover}
                    onRequestClose={this.setShowPopover}>
                    <View style={{ width: Dimensions.get('window').width - 40, backgroundColor: 'white', borderRadius: 15 }}>
                        <View style={{
                            height: 45,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            backgroundColor: configs.bgNen,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                            padding: 12
                        }}>
                            <Text style={[styles.styleText, { fontSize: 16, fontWeight: 'bold' }]}>
                                {"Duyệt/Từ chối " + (this.type === 1 ? "nghỉ phép" : "đi muộn về sớm")}
                            </Text>
                        </View>

                        <InputView
                            id={3}
                            isCleared
                            style={[styles.styleInput, { margin: 12 }]}
                            styleTextInputElement={[styles.styleTextInputElement, {
                                height: 100
                            }]}
                            styleInput={{
                                height: '100%',
                                textAlignVertical: 'top',
                            }}
                            placeholder={"Nhập lý do bạn duyệt ..."}
                            value={this.textLyDoTuChoi}
                            blurOnSubmit={true}
                            iconLeft={'parcel-content'}
                            textTitle={"Lý do bạn duyệt: "}
                            onChangeText={(id, data) => {
                                this.textLyDoTuChoi = data
                            }}
                        />

                        <View style={{
                            flexDirection: 'row',
                            marginTop: 12,
                            borderBottomLeftRadius: 15,
                            borderBottomRightRadius: 15,
                            marginBottom: 15
                        }}>
                            <TouchableOpacity style={[styles.styleButtonSuaToken, { backgroundColor: 'red' }]}
                                onPress={() => {
                                    if (this.type === 1) {
                                        this.duyetNghiPhepApi(false)
                                    } else {
                                        this.duyetDiMuonVeSomApi(false)
                                    }
                                }}>
                                <Text style={[styles.styleText, { color: 'white', fontSize: 16, fontWeight: 'bold' }]}>{'Từ chối'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.styleButtonSuaToken]}
                                onPress={() => {
                                    if (this.type === 1) {
                                        this.duyetNghiPhepApi(true)
                                    } else {
                                        this.duyetDiMuonVeSomApi(true)
                                    }
                                }}
                            >
                                <Text style={[styles.styleText, { color: 'white', fontSize: 16, fontWeight: 'bold' }]}>{'Duyệt'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Popover>
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
    styleButtonSuaToken: {
        flex: 1,
        marginHorizontal: 12, backgroundColor: configs.colorMain,
        borderRadius: 6, paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DuyetDetailAllScreen)