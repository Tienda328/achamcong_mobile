import React from 'react';
import { StyleSheet, Alert, Animated, TouchableOpacity, View, Text, Dimensions, Platform, Image } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView, RadioForm, TabView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { actions } from '../../../../commons/action';
import RBSheet from "react-native-raw-bottom-sheet";
import ItemBottomTimekeeping from './ItemBottomTimekeeping'
import Popover from 'react-native-popover-view';
import { paddingBottom } from '../../../../commons/defined/AppDimensions';

const widthScreen = Dimensions.get('window').width 
class ItemTimekeepingDay extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
            dataList: [],
            showImg: false,
            uri: null,
            nameImage: "" 
        }
        this.getMapCheckin = this.getMapCheckin.bind(this)
        this.showSheet = this.showSheet.bind(this)
        this.closeSheet = this.closeSheet.bind(this)
    }

    componentDidMount() {
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    showSheet = (value, id) => {
        this.RBSheet.open()
    }
    closeSheet = () => {
        this.RBSheet.close()
    }

    renderBottom = () => {
        return (
            <ItemBottomTimekeeping
                dataItem={this.props.dataItem}
                closeSheet={this.closeSheet} />
        )
    }

    drawItemList(params) {
        return (
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={params.title1}
                    value={params.value1}
                />
                {params.title2 && <TextView
                    style={[styles.stylesRow]}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={params.title2}
                    value={params.value2}
                />}
            </View>
        )
    }
    showImage(type) {
        let uri = null
        type == 1 ? (uri = this.props.dataItem.image_in ? this.props.dataItem.image_in : null) :
                    (uri = this.props.dataItem.image_out ? this.props.dataItem.image_out : null)
        if (uri != null) {
            this.setState({ uri : uri })
            this.setState({ showImg: true })
            this.setState({ nameImage: this.props.dataItem.name})
        }
    }
    getMapCheckin = () => {
        // this.props.navigation.navigate("ListMapCheckin", {dataItem: this.props.dataItem})
        this.props.navigatorMapCheckin(this.props.dataItem)
    }
    render() {
        let { dataItem, index } = this.props
        return (
            <View style={[styles.cardItem]}>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: configs.colorMain,
                    minHeight: configs.height30,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    paddingHorizontal: 12
                }}>
                    <Text style={[styles.styleTitle, { color: 'white', fontWeight: '500', flex: 1 }]}>{(index + 1) + '. ' + dataItem.name}</Text>
                </View>

                {(dataItem.total_shift !== 0 && dataItem.remain == 0)?
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View>
                                    <TouchableOpacity onPress={() => {this.showImage(1)}}>
                                        <Image
                                            source={dataItem.image_in? { uri: dataItem.image_in }: null} style={[{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 40 / 2,
                                                marginLeft: 12,
                                                marginTop: 12,
                                                marginBottom: 8
                                            }]}
                                            />
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:1 , flexDirection: "column"}}>
                                    <TextView
                                        style={[styles.stylesRow, {paddingBottom: 1}]}
                                        styleTitle={styles.styleLabel}
                                        stylesTextContent={styles.stylesTextContent}
                                        styleValue={styles.styleValue}
                                        title="Check in"
                                        value={dataItem.time_start_timestamp ? configs.timeConverter(dataItem.time_start_timestamp, 6) : 'Nghỉ'}
                                    />
                                    <TextView
                                        style={[styles.stylesRow, {paddingTop: 1}]}
                                        styleValue={styles.styleValue}
                                        stylesTextContent={styles.stylesTextContent}
                                        styleTitle={styles.styleLabel}
                                        title="Đi muộn"
                                        value={dataItem.late || dataItem.late === 0 ? dataItem.late + 'p' : 'Nghỉ'}
                                    />
                                </View>
                            </View>
                            <View style={{flex: 1, flexDirection: "row"}}>
                                <View>
                                    <TouchableOpacity onPress={() => {this.showImage(2)}}>
                                        <Image
                                            source={dataItem.image_out? { uri: dataItem.image_out }: null} style={[{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 40 / 2,
                                                marginLeft: 12,
                                                marginTop: 8,
                                                marginBottom: 12
                                            }]}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:1 , flexDirection: "column"}}>
                                    <TextView
                                        style={[styles.stylesRow, {paddingBottom: 1}]}
                                        styleTitle={styles.styleLabel}
                                        stylesTextContent={styles.stylesTextContent}
                                        styleValue={styles.styleValue}
                                        title="Check out"
                                        value={dataItem.time_end_timestamp ? configs.timeConverter(dataItem.time_end_timestamp, 6) : 'Nghỉ'}
                                    />
                                    <TextView
                                        style={[styles.stylesRow, {paddingTop: 1}]}
                                        styleValue={styles.styleValue}
                                        stylesTextContent={styles.stylesTextContent}
                                        styleTitle={styles.styleLabel}
                                        title="Về sớm"
                                        value={dataItem.soon || dataItem.soon === 0 ? dataItem.soon + 'p' : 'Nghỉ'}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", height: configs.height20}}>
                            <View style={{flex: 1, alignItems: "flex-start", justifyContent: "center"}}>
                                <TouchableOpacity onPress={this.getMapCheckin}>
                                    <Text style={{
                                        paddingBottom: 5,
                                        paddingHorizontal: 12,
                                        color: configs.colorTextOrange,
                                        fontSize: 12,
                                    }}>{"Xem vị trí >>>"}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1, alignItems: "flex-start", justifyContent: "center"}}>
                                <TouchableOpacity onPress={this.showSheet}>
                                    <Text style={{
                                        paddingBottom: 5,
                                        paddingHorizontal: 12,
                                        color: configs.colorTextOrange,
                                        fontSize: 12,
                                    }}>{"Xem chi tiết >>>"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View> :
                    <Text style={[styles.styleTitle, { color: 'red', padding: 12 }]}>{dataItem.status}</Text>}

                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={configs.verticalScale(530)}
                    duration={250}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 10, borderTopLeftRadius: 10,
                        }
                    }}
                >
                    {this.renderBottom()}
                </RBSheet>
                <Popover isVisible={this.state.showImg} 
                        onRequestClose={() => { this.setState({ showImg: false }) }} 
                        popoverStyle={{borderRadius: 10}}>
                    <View style={styles.viewImageText}>
                        <View style={styles.nameImage}>
                            <Text style={styles.textName}>{this.state.nameImage}</Text>
                            <TouchableOpacity onPress={() => { this.setState({ showImg: false }) }} 
                                            style={styles.buttonCancel}>
                                <IconView
                                    name={'cancel'}
                                    size={configs.sizeIcon24}
                                    color={configs.colorTitleCard}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewImage}>
                            <Image style={styles.imageshow} 
                                source={{uri: this.state.uri}} />
                        </View>
                    </View>
                </Popover>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    viewImageText: {
        flex: 1, width: widthScreen * 0.8, 
        height: widthScreen * 0.9, 
        backgroundColor: configs.backgroudCardView
    },
    viewImage : {
        flex:1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    nameImage: {
        flexDirection: 'row',
        backgroundColor: configs.colorMainDaiMau3, 
        height: widthScreen * 0.1, 
        paddingLeft: 10
    },
    textName: {
        flex: 1,
        color: configs.backgroudCardView, 
        alignSelf: 'center'
    },
    imageshow :{
        width: widthScreen * 0.7, 
        height: widthScreen * 0.7,
        borderRadius: widthScreen * 0.7 / 2
    },
    buttonCancel: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'flex-end', 
        paddingRight: 10
    },
    styleTitle: {
        fontSize: configs.fontSize14_5,
        fontFamily: 'Lato-Regular',
        color: 'black',
    },
    stylesRow: {
        flex: 1,
        marginHorizontal: 8,
        paddingVertical: 8
    },

    stylesTextContent: {
    },

    styleLabel: {
        // fontStyle: 'normal',
        // fontSize: configs.fontSize13,
        // color: configs.colorText1,
    },

    styleValue: {
        fontSize: configs.fontSize13,
        color: 'black',
        marginLeft: 4

    },
    cardItem: {
        flex: 1,
        flexDirection: 'column',
        marginVertical: 6,
        marginHorizontal: 12,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowRadius: 4,
        shadowColor: 'gray',
        elevation: 3,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 1,
            width: 0
        },
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
export default connect(mapStateToProps, mapDispatchToProps)(ItemTimekeepingDay)