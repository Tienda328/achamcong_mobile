import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, BackHandler, Dimensions } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons'
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import { api } from '../../../commons/api/Api';
import { actions } from '../../../commons/action';
import { StackActions, NavigationActions } from 'react-navigation'
import { models } from '../../../commons/model';
import { resetAlert } from '../ChamCongScreen/action';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const SLIDER_1_FIRST_ITEM = 0;
const icon_camera = require('../../../assets/image/icon_camera.png')
class BaoCaoScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            dataTakePhoto: '',
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        }

        this.dataLogin = models.getDataLogin()
        this.backPressed = this.backPressed.bind(this)
        this._renderItem = this._renderItem.bind(this)
        this.removeItemImage = this.removeItemImage.bind(this)
        this.uploadImageOrder = this.uploadImageOrder.bind(this)
        this.responsesResetData = this.responsesResetData.bind(this)
        this.adminPermission = models.getStatusAdmin()
    }

    componentDidMount() {
        let token = models.getToken();
        // console.log('token chen image', token);
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        this.props.navigation.goBack();
        return true;
    }

    removeItemImage = (data) => {
        let dataResponse = this.state.dataTakePhoto
        let index = dataResponse.indexOf(data)
        if (index > -1) {
            dataResponse.splice(index, 1);
        }
        this.setState({
            dataTakePhoto: dataResponse,
        })
    }

    responsesResetData = (data) => {
        this.setState({
            dataTakePhoto: data,
        })
    }

    selectPhotoTapped() {
        this.props.navigation.navigate('AddImageScreen', { responsesResetData: this.responsesResetData })
    }

    uploadImageOrder = () => {
        let { dataTakePhoto } = this.state
        if (!dataTakePhoto) {
            configs.showAlert('Bạn cần có hình ảnh để tạo dữ liệu hình ảnh.')
        } else {
            this.props.createFolderImage({ "photo": dataTakePhoto })
        }
    }

    convertToArray(objectsArray) {
        let copyOfJsonArray = Array.from(objectsArray);
        let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
        return jsonArray;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.ChenImageReducer) {
            if (this.props.ChenImageReducer.dataCreateFolderImage && this.props.ChenImageReducer.dataCreateFolderImage.message && this.props.ChenImageReducer.dataCreateFolderImage.status) {
                if (this.props.ChenImageReducer.dataCreateFolderImage.status === 200) {
                    setTimeout(() => {
                        Alert.alert(
                            configs.NAME_APP,
                            this.props.ChenImageReducer.dataCreateFolderImage.message,
                            [
                                {
                                    text: configs.DONG_Y, onPress: () => {
                                        this.props.resetCreateFolderImage()
                                        if (this.dataLogin.permission === 1) {
                                            if (!this.adminPermission) {
                                                this.props.navigation.dispatch(
                                                    StackActions.reset({
                                                        index: 0,
                                                        key: null,
                                                        actions: [NavigationActions.navigate({ routeName: 'HomeAdminScreen' })]
                                                    })
                                                )
                                            } else {
                                                this.props.navigation.dispatch(
                                                    StackActions.reset({
                                                        index: 0,
                                                        key: null,
                                                        actions: [NavigationActions.navigate({ routeName: 'TrangChuScreen' })]
                                                    })
                                                )
                                            }
                                        } else {
                                            this.props.navigation.dispatch(
                                                StackActions.reset({
                                                    index: 0,
                                                    key: null,
                                                    actions: [NavigationActions.navigate({ routeName: 'TrangChuScreen' })]
                                                })
                                            )
                                        }
                                    }
                                }
                            ],
                        );
                    }, 700);
                } else {
                    setTimeout(() => {
                        Alert.alert(
                            configs.NAME_APP,
                            this.props.ChenImageReducer.dataCreateFolderImage.message,
                            [
                                {
                                    text: configs.DONG_Y, onPress: () => {
                                        this.props.resetCreateFolderImage()
                                    }
                                }
                            ],
                        );
                    }, 700);
                }
            }
        }
    }

    _renderItem({ item, index }) {
        return (
            <View style={{
                flex: 1,
                position: 'relative'
            }}>
                <Image
                    style={{
                        width: DEVICE_WIDTH - 40,
                        height: '100%',
                        resizeMode: 'cover',
                        borderRadius: 6
                    }}
                    source={{ uri: item }}
                />

                <View style={{
                    flexDirection: 'row', justifyContent: 'center',
                    position: 'absolute', top: 12, left: 12,
                    alignItems: 'center'
                }}>
                    <IconView
                        onPress={() => {
                            this.removeItemImage(item)
                        }}
                        style={{ width: 30, justifyContent: 'center', alignItems: 'center', }}
                        name={'cancel'}
                        size={configs.sizeIcon24}
                        color={'#F79600'}
                    />
                </View>
            </View>
        );
    }

    render() {
        let { slider1ActiveSlide } = this.state
        return (
            <BaseView stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={"Cập nhật hình ảnh"}
                // subTitle={'havantam.it@gmail.com'}
                styleToolbar={{ height: 45 }}
                styleTitle={[styles.styleTitle]}
                styleTitleToolbarBase={[styles.styleTitleToolbarBase]}
                isShowIconRight={true}
                drawIconRight={
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{
                                padding: 20,
                                marginTop: -30,
                            }}
                            onPress={() => {
                                this.selectPhotoTapped()
                            }}>
                            <Image source={icon_camera} style={{
                                width: configs.sizeIcon24,
                                height: configs.sizeIcon24,
                                tintColor: 'blue'
                            }} />
                        </TouchableOpacity>
                    </View>
                }
            >
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <View style={{
                        flex: 1,
                        position: 'relative'
                    }}>
                        <Image
                            style={{
                                width: DEVICE_WIDTH - 40,
                                height: '100%',
                                resizeMode: 'cover',
                                borderRadius: 6
                            }}
                            source={{ uri: this.state.dataTakePhoto }}
                        />
                    </View>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center', width: '50%',
                            marginVertical: 12, height: 45,
                            justifyContent: 'center',
                            backgroundColor: configs.colorMain,
                            borderRadius: 6,
                            alignItems: 'center'
                        }}
                        onPress={this.uploadImageOrder}>
                        <Text style={{
                            color: 'white'
                        }}>{'Cập nhật hình ảnh'}</Text>
                    </TouchableOpacity>
                </View>
            </BaseView>
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
})

const mapStateToProps = state => ({
    ChenImageReducer: state.ChenImageReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        createFolderImage: (params) => {
            api.createFolderImage(dispatch, params)
        },
        resetCreateFolderImage: () => {
            dispatch(actions.requestIsCreateFolderImage(null))
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(BaoCaoScreen)