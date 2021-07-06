import React, { Component } from 'react';
import { View, BackHandler, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import {  BaseView, IconView } from '../../../components';
import { connect } from 'react-redux';
import { api } from '../../../../commons/api/Api';
import { actions } from '../../../../commons/action';
import Timeline from 'react-native-timeline-flatlist';
import { commonsConfigs as configs } from '../../../../commons';
import Popover from 'react-native-popover-view';

const widthScreen = Dimensions.get('window').width 
class ListCheckin extends Component {
    constructor(props) {
        super(props)
        this.data = this.props.dataItem
        this.dataLoadMapSelect = {}
        this.dataListMap = []
        this.state = {
            dataList: [],
            showImg: false,
            uri: null
        }
        this.renderDetail = this.renderDetail.bind(this)
    }
    componentDidMount() {
        try {
            this.dataLoadMapSelect = {
                id_member: this.data.id,
                date: this.data.date,
            }
            this.props.GetListMapCheckin(this.dataLoadMapSelect)
        } catch (error) {

        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.ChartStatisticalReducer) {
            if (this.props.ChartStatisticalReducer.dataListMap && this.props.ChartStatisticalReducer.dataListMap !== prevProps.ChartStatisticalReducer.dataListMap && this.props.ChartStatisticalReducer.dataListMap.data && this.props.ChartStatisticalReducer.dataListMap.data.list_checkin_normal) {
                this.props.ChartStatisticalReducer.dataListMap.data.list_checkin_normal.map((item) => {
                    this.state.dataList.push({
                        time: configs.timeConverter(item.time, 5),
                        title: item.device,
                        description: item.location.replace(",", "\n"),
                        icon: require('../../../../assets/icon/location-icon.jpg'),
                        imageUrl: item.image
                    })
                })
            }
        }
    }
    showImage(uri) {
        this.setState({ uri : uri })
        this.setState({ showImg: true })
    }
    renderDetail(rowData, sectionID, rowID) {
        let title = <Text style={[styles.title]}>{rowData.title}</Text>
        var desc = null
        if (rowData.description && rowData.imageUrl)
            desc = (
                <View style={styles.descriptionContainer}>
                    <TouchableOpacity onPress={() => {this.showImage(rowData.imageUrl)}}>
                        <Image source={{ uri: rowData.imageUrl }} style={styles.image} />
                    </TouchableOpacity>
                    <Text style={[styles.textDescription]}>{rowData.description}</Text>
                </View>
            )
        return (
            <View style={{ flex: 1 }}>
                {title}
                {desc}
            </View>
        )
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={styles.container}>
                    <Timeline
                        style={styles.list}
                        data={this.state.dataList}
                        circleSize={25}
                        circleColor='rgba(0,0,0,0)'
                        lineColor='#feac4d'
                        timeContainerStyle={{ minWidth: widthScreen * 0.1}}
                        timeStyle={{ textAlign: 'center', backgroundColor: configs.colorOrange, color: 'white', padding: 5, borderRadius: 13 }}
                        descriptionStyle={{ color: 'gray' }}
                        options={{
                            style: { paddingTop: 5 }
                        }}
                        detailContainerStyle={{ marginBottom: 20, paddingLeft: 10, paddingRight: 5, backgroundColor: "#BBDAFF", borderRadius: 10 }}
                        innerCircle={'icon'}
                        renderDetail={this.renderDetail}
                    />
                </View>
                <Popover isVisible={this.state.showImg} 
                        onRequestClose={() => { this.setState({ showImg: false }) }} 
                        popoverStyle={{borderRadius: 10}}>
                    <View style={styles.viewImageText}>
                        <View style={styles.nameImage}>
                            <Text style={styles.textName}>{this.data.name}</Text>
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
const mapStateToProps = state => ({
    ChartStatisticalReducer: state.ChartStatisticalReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        GetListMapCheckin: (params) => {
            api.GetListMapCheckin(dispatch, params)
        }
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 0.97,
        paddingHorizontal: 10
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 50
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
    },
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
});
export default connect(mapStateToProps, mapDispatchToProps)(ListCheckin)