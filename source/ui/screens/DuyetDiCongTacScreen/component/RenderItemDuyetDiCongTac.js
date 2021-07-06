import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView } from 'react-native-gesture-handler';

class RenderItemDuyetDiCongTac extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.deleteDuyetDiCongTac = this.deleteDuyetDiCongTac.bind(this)
        this.chapNhanDuyetDiCongTac = this.chapNhanDuyetDiCongTac.bind(this)
        this.tuChoiDuyetDiCongTac = this.tuChoiDuyetDiCongTac.bind(this)
        this.onClickItem = this.onClickItem.bind(this)
    }

    convertTachDate(date) {
        if (!date) {
            return []
        }
        return date.split("-")
    }

    deleteDuyetDiCongTac = () => {
        let { dataItem } = this.props
        Alert.alert(
            configs.NAME_APP,
            'Bạn có muốn xóa đơn của: ' + dataItem?.user_request?.name + ' này hay không?',
            [
                {
                    text: configs.DONG_Y, onPress: () => {
                        this.props.deleteDuyetDiCongTac(dataItem)
                    }
                },
                {
                    text: configs.HUY, onPress: () => {

                    }
                },
            ],
        );
    }

    chapNhanDuyetDiCongTac = () => {
        let { dataItem } = this.props
        this.props.duyetDiCongTac(dataItem, true)

    }

    tuChoiDuyetDiCongTac = () => {
        let { dataItem } = this.props
        this.props.duyetDiCongTac(dataItem, false)
    }

    onClickItem = () => {
        let { dataItem } = this.props
        // this.props.onClickItem(dataItem)
    }

    render() {
        let { dataItem, isDuyetLichSu = false } = this.props
        // let dateToArray = this.convertTachDate(dataItem.time_start)
        // let textToDateThu = dateToArray.length < 3 ? '' : configs.quyDoiNgayThangSangThu2(dataItem.time_start)

        // let dateToArrayEnd = this.convertTachDate(dataItem.time_end)
        // let textDateEnd = dateToArrayEnd.length < 3 ? '' : configs.quyDoiNgayThangSangThu2(dataItem.time_end)

        let textToDateThu = configs.quyDoiNgayThangSangThu4(dataItem.time_start_timestamp)
        return (
            <View style={{
                marginHorizontal: 8, marginTop: 8, backgroundColor: 'white', borderRadius: 8, borderWidth: 0.5, borderColor: '#737373',
                padding: 12
            }}>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{
                        paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: configs.colorBorder, backgroundColor: '#f2f2f2',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60
                    }}>
                        <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 15 }]}>{textToDateThu ? textToDateThu : ""}</Text>
                    </View>

                    <View style={{ paddingHorizontal: 12, flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TextView
                                    style={{ marginBottom: -5 }}
                                    styleValue={[styles.styleTitle, {
                                        color: dataItem.state_request === 0 ? configs.colorDiMuon : (dataItem.state_request === 1 ? configs.colorDongY : "red"),
                                        fontStyle: 'italic', fontSize: 9, marginLeft: -2
                                    }]}
                                    value={dataItem.state_request === 0 ? "Chưa duyệt" : (dataItem.state_request === 1 ? "Đồng ý" : "Từ chối")}
                                    iconLeft={dataItem.state_request === 0 ? 'circle-sync' : (dataItem.state_request === 1 ? "verified" : "warning")}
                                    iconColor={dataItem.state_request === 0 ? configs.colorDiMuon : (dataItem.state_request === 1 ? configs.colorDongY : "red")}
                                    iconSize={9}
                                />

                                <Text style={[styles.styleTitle, { color: configs.colorText, fontSize: 14 }]}>{"Tên: " + (dataItem?.user_request?.name ? dataItem?.user_request?.name : '')}</Text>
                            </View>

                            <TouchableOpacity onPress={this.deleteDuyetDiCongTac} style={{ padding: 8 }}>
                                <IconView
                                    name={'recycle-bin'}
                                    color={'red'}
                                    size={16}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 16 }]}>{'Xin đi công tác'}</Text>
                        <Text style={[styles.styleTitle, { color: 'gray', fontSize: 9 }]}>{configs.quyDoiTimeStampToDate(dataItem.time_start_timestamp)}</Text>

                        {/* <Text style={[styles.styleTitle, { color: 'black', marginTop: 12 }]}>{dataItem.content ? dataItem.content : ''}</Text>
                        {dataItem.note && <Text style={[styles.styleTitle, { color: 'black', marginTop: 12 }]}>{"Lý do từ chối: " + dataItem.note}</Text>} */}
                    </View>
                </View>

                <View style={{ flexDirection: 'row', flex: 1, width: '100%', padding: 8 }}>
                    <TextView
                        style={[styles.styleTitle, { flex: 1 }]}
                        styleValue={styles.styleTitle, { color: 'black' }}
                        title={"Số điện thoại:"}
                        value={(dataItem.phone_customer ? dataItem.phone_customer : '')}
                        iconLeft='telephone'
                        iconColor={configs.colorIcon}
                        iconSize={configs.sizeIcon18}
                    />
                    <TextView
                        style={[styles.styleTitle, { flex: 1 }]}
                        styleValue={styles.styleTitle, { color: 'black' }}
                        title={"Tên khách hàng: "}
                        value={(dataItem.name_customer ? dataItem.name_customer : '')}
                        iconLeft='ic-user'
                        iconColor={configs.colorIcon}
                        iconSize={configs.sizeIcon18}
                    />
                </View>
                <TextView
                    style={[styles.styleTitle, { flex: 1, padding: 8 }]}
                    styleValue={styles.styleTitle, { color: 'black' }}
                    title={"Địa chỉ: "}
                    value={(dataItem.address ? dataItem.address : '')}
                    iconLeft='map-item'
                    iconColor={configs.colorIcon}
                    iconSize={configs.sizeIcon18}
                />

                {/* <Text style={[styles.styleTitle, { color: 'black', marginTop: 8, paddingHorizontal: 8 }]}>{"Địa chỉ: " + (dataItem.address ? dataItem.address : '')}</Text> */}
                <Text style={[styles.styleTitle, { color: 'black', marginTop: 8, paddingHorizontal: 8 }]}>{"Nội dung: " + (dataItem.content ? dataItem.content : '')}</Text>

                <View style={{
                    flexDirection: 'row',
                    marginTop: 10
                }}>
                    {!isDuyetLichSu && <View style={{ width: (configs.SCREEN_WIDTH - 40) / 2, alignItems: 'center', flex: 1 }}>
                        <TextView
                            onPress={this.tuChoiDuyetDiCongTac}
                            style={[styles.styleButton, { marginHorizontal: 10 }]}
                            styleValue={{ fontWeight: '500', fontSize: configs.fontSize12, color: 'red' }}
                            value={'Từ chối'}
                            iconLeft={'warning'}
                            iconColor={'red'}
                            iconSize={configs.sizeIcon12}
                        />
                    </View>}
                    {!isDuyetLichSu && <View style={{ width: (configs.SCREEN_WIDTH - 40) / 2, alignItems: 'center', flex: 1 }}>
                        <TextView
                            onPress={this.chapNhanDuyetDiCongTac}
                            style={[styles.styleButton, { borderRightWidth: 0, }]}
                            styleValue={{ fontWeight: '500', fontSize: configs.fontSize12, color: configs.colorMain }}
                            value={'Duyệt'}
                            iconLeft={'verified'}
                            iconColor={configs.colorMain}
                            iconSize={configs.sizeIcon12}
                        />
                    </View>}
                    {/* <View style={{ width: (configs.SCREEN_WIDTH - 40) / 3, alignItems: 'flex-end', flex: 1 }}>
                        <TextView
                            onPress={this.onClickItem}
                            style={[styles.styleButton]}
                            styleValue={{ fontWeight: '500', fontSize: configs.fontSize12, color: '#ff9933' }}
                            value={'Xem chi tiết >>>'}
                        />

                    </View> */}
                </View>
            </View>
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
    // styleButton: {
    //     flex: 1,
    //     backgroundColor: configs.colorDongY,
    //     marginLeft: 8,
    //     height: 34, borderRadius: 17,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginTop: 12,

    // },
    styleTextButton: {
        color: 'white',
        fontSize: configs.fontSize14_5,
        fontFamily: 'Lato-Regular',
    },
    styleButton: {
        backgroundColor: configs.colorMain,
        height: configs.heightInput40,
        borderColor: configs.colorMainDaiMau2,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        paddingVertical: 12,
        marginLeft: configs.margin15
    },
    styleButton: {
        // flex: 1,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddddbb',
        borderRadius: 50
    },
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(RenderItemDuyetDiCongTac)