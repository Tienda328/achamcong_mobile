import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, ScrollView, Dimensions } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView, RadioForm, TabView } from '../../../components';
import { commonsConfigs as configs } from '../../../../commons'
import Wave from 'react-native-waveview'
import LinearGradient from 'react-native-linear-gradient';
import Popover from 'react-native-popover-view';

const WIDTH_SCREEN = Dimensions.get('window').width
class ItemBottomTimekeeping extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
            dataList: [],
            viewWave: null,
            uri: null,
            showImage: false,
            nameImage: '',
        }

        this.waveParams = [
            { A: 20, T: 360, fill: '#22f7e5' },
            { A: 30, T: 360, fill: '#08d4c4' },
            { A: 40, T: 360, fill: '#047b71' },
        ]
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    showImage(type){
        let uri = null
        type == 1 ? (uri = this.props.dataItem.image_in ? this.props.dataItem.image_in : null) :
                    (uri = this.props.dataItem.image_out ? this.props.dataItem.image_out : null)
        if (uri != null) {
            this.setState({ uri : uri })
            this.setState({ showImg: true })
            this.setState({ nameImage: this.props.dataItem.name})
        }
    }
    render() {
        let { dataItem, index } = this.props
        return (
            <View style={[{ flex: 1 }]}>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: configs.colorBorder,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: configs.height50
                }}>
                    <TouchableOpacity
                        style={{
                            width: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => { this.props.closeSheet() }}>
                        <IconView
                            name={'cancel'}
                            size={configs.sizeIcon24}
                            color={configs.colorTitleCard}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{'Chi tiết bảng công - ' + dataItem.name} </Text>
                </View>

                <LinearGradient
                    locations={[0, 0.5, 0.8]}
                    colors={['#ccffff', '#99ffff', '#4dffff']}
                    style={{ flexDirection: 'row', margin: 12, borderRadius: 8, elevation: 3, marginHorizontal: 6, padding: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <Wave
                        style={{
                            width: WIDTH_SCREEN * 2 / 5,
                            height: WIDTH_SCREEN * 2 / 5,
                            // aspectRatio: 1,
                            overflow: 'hidden',
                            borderRadius: WIDTH_SCREEN * 2 / 10,
                            backgroundColor: configs.colorBorder
                        }}
                        H={WIDTH_SCREEN * 2 / 5 * (dataItem.percent ? dataItem.percent : 0) / 100}
                        waveParams={this.waveParams}
                        animated={true}
                    />

                    <View style={{ flex: 1, }}>
                        <Text style={[styles.styleTitle, { fontSize: 12, marginLeft: 8, color: 'red', textAlign: 'center' }]}>{(dataItem.percent ? dataItem.percent : 0) + "% - phần trăm tiến độ chấm công trong ngày"}</Text>
                        <Text style={[styles.styleTitleTextView, { fontSize: 12, marginLeft: 12, marginTop: 12, fontStyle: 'italic' }]}>{"Ảnh chấm công:"}</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-around', marginTop: 8 }}>
                            <TouchableOpacity onPress={() => {this.showImage(1)}}>
                                <Image
                                    source={dataItem.image_in ? { uri: dataItem.image_in } : null} style={[{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 40 / 2,
                                        marginLeft: 12,
                                    }]}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {this.showImage(2)}}>
                                <Image
                                    source={dataItem.image_out ? { uri: dataItem.image_out } : null} style={[{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 40 / 2,
                                        marginLeft: 12,
                                    }]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                <Text style={[styles.styleTitleTextView, { marginHorizontal: 12 }]}>{"Các đơn xin phép trong ngày"}</Text>
                <View style={{ flexDirection: 'row', marginHorizontal: 12 }}>
                    {/* {dataItem.state.map((item) => { */}
                        {/* return ( */}
                            <View style={{
                                paddingVertical: 4, paddingHorizontal: 12,
                                backgroundColor: configs.colorMain,
                                borderRadius: 12,
                                marginVertical: 8,
                                alignSelf: 'baseline',
                            }}>
                                <Text style={{
                                    marginVertical: 4,
                                    color: 'white'
                                }}>{dataItem.name}</Text>
                            </View>
                        {/* ) */}
                    {/* })} */}
                </View>

                <ScrollView>
                    <View style={{ flex: 1 }}>
                        <TextView
                            style={styles.viewRow}
                            stylesTextContent={styles.viewContentRow}
                            styleValue={styles.styleValueTextView}
                            styleTitle={styles.styleTitleTextView}
                            title={'Ngày'}
                            value={dataItem.date ? dataItem.date + '' : ""}
                            iconLeft='calendar-time'
                            iconColor={configs.colorText}
                            iconSize={configs.sizeIcon14}
                        />

                        <TextView
                            style={styles.viewRow}
                            stylesTextContent={styles.viewContentRow}
                            styleValue={styles.styleValueTextView}
                            styleTitle={styles.styleTitleTextView}
                            title={'Người dùng'}
                            value={dataItem.name ? dataItem.name : ""}
                            iconLeft='ic-user'
                            iconColor={configs.colorText}
                            iconSize={configs.sizeIcon14}
                        />

                        <TextView
                            style={styles.viewRow}
                            stylesTextContent={styles.viewContentRow}
                            styleValue={styles.styleValueTextView}
                            styleTitle={styles.styleTitleTextView}
                            title={'Phòng'}
                            value={dataItem.department ? dataItem.department : ""}
                            iconLeft='home-address'
                            iconColor={configs.colorText}
                            iconSize={configs.sizeIcon14}
                        />

                        <TextView
                            style={styles.viewRow}
                            stylesTextContent={styles.viewContentRow}
                            styleValue={styles.styleValueTextView}
                            styleTitle={styles.styleTitleTextView}
                            title={'Giờ chấm công vào'}
                            value={dataItem.time_start_timestamp ? configs.timeConverter(dataItem.time_start_timestamp, 6) + '' : ""}
                            iconLeft='customer-check'
                            iconColor={configs.colorText}
                            iconSize={configs.sizeIcon14}
                        />

                        <TextView
                            style={styles.viewRow}
                            stylesTextContent={styles.viewContentRow}
                            styleValue={styles.styleValueTextView}
                            styleTitle={styles.styleTitleTextView}
                            title={'Giờ chấm công về'}
                            value={ dataItem.time_end_timestamp ? configs.timeConverter(dataItem.time_end_timestamp, 6) + '' : ""}
                            iconLeft='logout'
                            iconColor={configs.colorText}
                            iconSize={configs.sizeIcon14}
                        />

                        <TextView
                            style={styles.viewRow}
                            stylesTextContent={styles.viewContentRow}
                            styleValue={styles.styleValueTextView}
                            styleTitle={styles.styleTitleTextView}
                            title={'Số phút đi muộn'}
                            value={ dataItem.late !== undefined ? dataItem.late + 'p' : ""}
                            iconLeft='info'
                            iconColor={configs.colorText}
                            iconSize={configs.sizeIcon14}
                        />

                        <TextView
                            style={styles.viewRow}
                            stylesTextContent={styles.viewContentRow}
                            styleValue={styles.styleValueTextView}
                            styleTitle={styles.styleTitleTextView}
                            title={'Số phút về sớm'}
                            value={ dataItem.soon !== undefined ? dataItem.soon + 'p' : ""}
                            iconLeft='info'
                            iconColor={configs.colorText}
                            iconSize={configs.sizeIcon14}
                        />

                        {/* <TextView
                            style={styles.viewRow}
                            stylesTextContent={styles.viewContentRow}
                            styleValue={styles.styleValueTextView}
                            styleTitle={styles.styleTitleTextView}
                            title={'Số giờ thực tế làm'}
                            value={dataItem.attendance && dataItem.attendance.time_real !== undefined ? dataItem.attendance.time_real + '' : ""}
                            iconLeft='parcel-type'
                            iconColor={configs.colorText}
                            iconSize={configs.sizeIcon14}
                        /> */}

                        <TextView
                            style={styles.viewRow}
                            stylesTextContent={styles.viewContentRow}
                            styleValue={styles.styleValueTextView}
                            styleTitle={styles.styleTitleTextView}
                            title={'Device máy khi chấm công vào'}
                            value={ dataItem.device_start ? dataItem.device_start + '' : ""}
                            iconLeft='collect-type'
                            iconColor={configs.colorText}
                            iconSize={configs.sizeIcon14}
                        />

                        <TextView
                            style={styles.viewRow}
                            stylesTextContent={styles.viewContentRow}
                            styleValue={styles.styleValueTextView}
                            styleTitle={styles.styleTitleTextView}
                            title={'Device máy khi chấm công về'}
                            value={ dataItem.device_end ? dataItem.device_end + '' : ""}
                            iconLeft='collect-type'
                            iconColor={configs.colorText}
                            iconSize={configs.sizeIcon14}
                        />
                    </View>
                </ScrollView>
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
        flex: 1, width: WIDTH_SCREEN * 0.8, 
        height: WIDTH_SCREEN * 0.9, 
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
        height: WIDTH_SCREEN * 0.1, 
        paddingLeft: 10
    },
    textName: {
        flex: 1,
        color: configs.backgroudCardView, 
        alignSelf: 'center'
    },
    imageshow :{
        width: WIDTH_SCREEN * 0.7, 
        height: WIDTH_SCREEN * 0.7,
        borderRadius: WIDTH_SCREEN * 0.7 / 2
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
    viewContentRow: {
        flexDirection: 'row',
        flex: 1,
        height: '100%',
        alignItems: 'center',
        marginLeft: 5,

    },
    viewRow: {
        backgroundColor: 'white',
        paddingHorizontal: configs.padding15,
        borderBottomColor: configs.colorBorder,
        borderBottomWidth: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    styleTitleTextView: {
        fontStyle: 'normal',
        fontSize: 12,
        color: configs.colorText,
        minWidth: 40,
        fontFamily: 'Lato-Regular',
    },
    styleValueTextView: {
        fontFamily: 'Lato-Regular',
        fontSize: 14,
        color: "#323B45",
        flex: 1,
        textAlign: 'right'
    },
})
export default ItemBottomTimekeeping