import React, { Component } from 'react';
import { View, BackHandler, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { actions } from '../../../../commons/action';
import { commonsConfigs as configs } from '../../../../commons';
import MapView, {Marker} from 'react-native-maps';

class ListMap extends Component {
    constructor(props) {
        super(props)
        this.state={
            dataMap: []
        }
    }
    componentDidMount(){
        if (this.props.ChartStatisticalReducer) {
            if (this.props.ChartStatisticalReducer.dataListMap && this.props.ChartStatisticalReducer.dataListMap.data && this.props.ChartStatisticalReducer.dataListMap.data.list_checkin_normal) {
                let data = []
                this.props.ChartStatisticalReducer.dataListMap.data.list_checkin_normal.map((item) => {
                    data.push({
                        title: item.device,
                        lat: parseFloat(item.location.split(",")[0]),
                        long: parseFloat(item.location.split(",")[1]),
                        imageUrl: item.image,
                        description: configs.timeConverter(item.time, 5),
                    })
                })
                this.setState({ dataMap: data })
            }
        }
    }
    render() {
        return (
            <View style={{flex: 1}}> 
                <MapView style={{flex: 1, margin: 10}}
                    initialRegion={{
                    latitude: 20.998324,
                    longitude: -254.192857,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                    }}
                >
                    {
                        this.state.dataMap.map((element) => {
                            return(
                                <Marker title={element.title} coordinate={{ latitude: element.lat, longitude: element.long }} 
                                description={"A Chấm Công: " + element.description}
                                >
                                    <Image source={{uri: element.imageUrl}} style={{ width:30, height: 30, borderRadius:30, borderColor: 'red', borderWidth:1 }}/>
                                </Marker>
                            )
                        })
                    }
                </MapView>
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
    };
}
const styles = StyleSheet.create({
    
});
export default connect(mapStateToProps, mapDispatchToProps)(ListMap)