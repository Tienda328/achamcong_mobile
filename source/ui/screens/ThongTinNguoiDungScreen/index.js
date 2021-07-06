import React from 'react';
import { StyleSheet, Dimensions, Image, TouchableOpacity, View, Text, StatusBar, Alert, ScrollView, Platform, BackHandler } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView, DialogSelectItemFromList, InputView } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons'
import { api } from '../../../commons/api/Api';
import LinearGradient from 'react-native-linear-gradient';
import FlipCard from 'react-native-flip-card'
import { models } from '../../../commons/model';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibrary } from 'react-native-image-picker';
const iconUser = require('../../../assets/imageThongTinNguoiDung/iconUser.png')
const icon_user_edit = require('../../../assets/imageThongTinNguoiDung/icon_user_edit.png')
const icon_camera = require('../../../assets/image/icon_camera1.png')
const AppStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: configs.heightStatusbar, }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

const { height, width } = Dimensions.get('window');

class BaoCaoScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            flipCard: false,
            reRender: false,
            dataTakePhoto: null
        }

        this.dataLogin = models.getDataLogin()
        // console.log("this.dataLogin:   ", this.dataLogin)

        this.textName = this.dataLogin.name ? this.dataLogin.name : ''
        this.textPhone = this.dataLogin.phone ? this.dataLogin.phone : ''
        this.textZalo = this.dataLogin.zalo ? this.dataLogin.zalo : ''
        this.textFace = this.dataLogin.facebook ? this.dataLogin.facebook : ''

        this.handleMenu = this.handleMenu.bind(this)
        this.handleChangeUser = this.handleChangeUser.bind(this)
        this.setValueTextInput = this.setValueTextInput.bind(this)
        this.onChangeThongTinNguoiDung = this.onChangeThongTinNguoiDung.bind(this)
        this.selectPhotoTapped = this.selectPhotoTapped.bind(this)
    }

    handleMenu = () => {
        if (this.props.handleMenu) {
            this.props.handleMenu()
        } else {
            this.props.navigation.goBack();
            return true
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleMenu);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleMenu);
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    selectPhotoTapped() {
        let options = {
            title: 'Vui lòng chọn loại bạn muốn',
            takePhotoButtonTitle: 'Chụp ảnh',
            chooseFromLibraryButtonTitle: 'Chọn ảnh từ máy',
            quality: 1.0,
            maxWidth: 600,
            maxHeight: 500,
            cameraType: 'front',
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                // console.log('User cancelled photo picker');
            } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
                if (response.error === 'Camera permissions not granted') {
                    Alert.alert(
                        configs.NAME_APP,
                        'Vui lòng cấp quyền chụp ảnh cho ứng dụng. Vào cài đặt ứng dụng?',
                        [
                            {
                                text: configs.DONG_Y, onPress: () => {
                                    // this.back()
                                    // openSettings().catch(() => configs.showAlert('Không thể mở càu đặt ứng dụng. Vui lòng vào cài đặt để sử dụng tìm kiếm bưu cục'));
                                }
                            },
                            {
                                text: 'Hủy', onPress: () => {
                                }
                            }
                        ],
                    );
                }
            } else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            } else {
                // console.log(JSON.stringify(response.data))
                let dataResponse = response.data
                this.setState({
                    dataTakePhoto: dataResponse,
                })
            }
        });
    }

    handleChangeUser = () => {
        this.setState({ flipCard: !this.state.flipCard })
    }

    setValueTextInput = (id, data) => {
        if (id === 1) {
            this.textName = data
        } else if (id === 2) {
            this.textPhone = data
        } else if (id === 3) {
            this.textZalo = data
        } else if (id === 4) {
            this.textFace = data
        }

        this.reRender()
    }

    onChangeThongTinNguoiDung = () => {
        let { dataTakePhoto } = this.state
        if (!this.textPhone || this.textPhone.trim() === '') {
            configs.showAlert("Bạn cần nhập số phone")
        } else {
            let params = {
                id: this.dataLogin.id,
                email: this.dataLogin.email,
                email_verified_at: this.dataLogin.email_verified_at,
                name: this.dataLogin.name,
                id_department: this.dataLogin.id_department,
                id_branch: this.dataLogin.id_branch,
                role: this.dataLogin.role,
                created_at: this.dataLogin.created_at,
                updated_at: this.dataLogin.updated_at,
                access_token: this.dataLogin.access_token,
                token_type: this.dataLogin.token_type,
                expires_at: this.dataLogin.expires_at,
                isSavePass: this.dataLogin.isSavePass,
                sex: this.dataLogin.sex,
                birth_day: this.dataLogin.birth_day,
                address: this.dataLogin.address,

                "zalo": this.textZalo,
                "facebook": this.textFace,
                "avatar": dataTakePhoto ? "data:image/jpg;base64," + dataTakePhoto : this.dataLogin.avatar,
                "phone": this.textPhone
            }

            // console.log("params:    " + JSON.stringify(params))
            console.log("this.textPhone !== this.dataLogin.phone:    " + (this.textPhone !== this.dataLogin.phone))
            console.log("this.textZalo !== this.dataLogin.zalo:    " + (this.textZalo !== this.dataLogin.zalo))
            console.log("this.textFace !== this.dataLogin.facebook:    " + (this.textFace !== this.dataLogin.facebook))
            console.log("this.textFace !== this.dataLogin.facebook:    " + (this.textFace))
            console.log("this.textFace !== this.dataLogin.facebook:    " + (this.dataLogin.facebook))
            console.log("dataTakePhoto:    " + dataTakePhoto)

            if (this.textPhone !== this.dataLogin.phone || dataTakePhoto || this.textZalo !== this.dataLogin.zalo || this.textFace !== this.dataLogin.facebook) {
                this.props.requestUpdateThongTinNguoiDung(params)
            } else {
                this.handleChangeUser()
            }

        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.ThongTinNguoiDungReducer) {
            if (this.props.ThongTinNguoiDungReducer.dataChangeThongTin && (this.props.ThongTinNguoiDungReducer.dataChangeThongTin !== prevProps.ThongTinNguoiDungReducer.dataChangeThongTin)) {
                console.log(JSON.stringify(this.props.ThongTinNguoiDungReducer.dataChangeThongTin))
                var dataChangeThongTin = this.props.ThongTinNguoiDungReducer.dataChangeThongTin
                setTimeout(() => {
                    Alert.alert(
                        configs.APP_NAME,
                        dataChangeThongTin ? "Thay đổi thông tin thành công" : 'Có lỗi xảy ra vui lòng đăng nhập lại tài khoản.',
                        [
                            {
                                text: configs.DONG_Y,
                                onPress: () => {
                                    if (dataChangeThongTin) {
                                        if (!models.insertOrUpdateDataLogin(dataChangeThongTin, true)) {
                                            configs.showAlert("Không lưu được thông tin tài khoản")
                                        }
                                    }

                                    this.dataLogin = models.getDataLogin()
                                    this.setState({
                                        dataTakePhoto: null,
                                        flipCard: !this.state.flipCard
                                    })
                                },
                            },
                        ],
                        { cancelable: false },
                    );
                }, 700);
            }
        }
    }

    render() {
        let { dataTakePhoto } = this.state;
        // console.log({dataTakePhoto})
        // console.log("avatar", "https://api.achamcong.net/image/" + this.dataLogin.avatar);
        // console.log({props: this.props.ThongTinNguoiDungReducer});
        return (
            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}>

                <View style={{ height: '40%', alignItems: 'center', position: 'relative', justifyContent: 'flex-end' }} >
                    {Platform.OS === 'ios' ? <View /> :
                        <View style={{ position: 'absolute', bottom: -20, elevation: 3, shadowColor: '#000', }}>
                            <Image
                                style={{}}
                                source={!this.state.flipCard ? iconUser : icon_user_edit} style={[{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20
                                }]}
                            />
                        </View>}
                </View>

                <LinearGradient
                    locations={[0, 0.5, 0.8]}
                    colors={['#006bb3', '#0099ff', '#33adff']}
                    style={[styles.linearGradient]}>

                    <AppStatusBar
                        backgroundColor='transparent'
                        style={{ height: configs.heightStatusbar, }}
                    />

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={[styles.styleViewIconLeftBase]}
                            onPress={this.handleMenu}>
                            <IconView
                                style={{ justifyContent: 'center', alignItems: 'center', }}
                                color='white'
                                name={"left-arrow"}
                                size={configs.sizeIcon20}
                                height={configs.sizeIcon20}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.styleButtonEdit, {
                            backgroundColor: !this.state.flipCard ? configs.colorOrange : configs.colorNghiPhep,
                            margin: 8, elevation: 3, shadowColor: '#000', borderWidth: 0.5, borderColor: 'black', flexDirection: 'row'
                        }]}
                            onPress={() => {
                                console.log("vao day ------ ")
                                if (this.state.flipCard) {
                                    this.onChangeThongTinNguoiDung()
                                } else {
                                    this.handleChangeUser()
                                }
                            }}>
                            <IconView
                                style={{ justifyContent: 'center', alignItems: 'center', }}
                                color='white'
                                name={!this.state.flipCard ? "parcel-edit" : 'verified'}
                                size={14}
                                height={14}
                            />
                            <Text style={[styles.styleTitle, { fontSize: 14, color: 'white', marginLeft: 4 }]}>{!this.state.flipCard ? 'Sửa' : 'Xong'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Image
                            source={{ uri: true ? "https://api.achamcong.net/image/" + this.dataLogin.avatar : 'data:image/jpeg;base64,' + dataTakePhoto }} style={[{
                                width: width / 3,
                                height: width / 3,
                                borderRadius: width / 6
                            }]}
                        />

                        {this.state.flipCard ? <TouchableOpacity onPress={this.selectPhotoTapped} style={{ backgroundColor: configs.colorNghiPhep, padding: 8, borderRadius: width / 20 + 4, position: 'absolute', top: -20 }}>
                            <Image
                                source={icon_camera} style={[{
                                    width: width / 20,
                                    height: width / 20,
                                    tintColor: 'white'
                                }]}
                            />
                        </TouchableOpacity> : null}
                        <View />


                        <Text style={[styles.styleTitle, { fontSize: 16, color: 'white' }]}>{this.dataLogin.name}</Text>
                        <Text style={[styles.styleTitle, { fontSize: 12, color: 'white', fontStyle: 'italic' }]}>{this.dataLogin.email ? this.dataLogin.email : ''}</Text>
                    </View>
                </LinearGradient>

                <FlipCard
                    style={{}}
                    friction={6}
                    perspective={1000}
                    flipHorizontal={true}
                    flipVertical={false}
                    flip={this.state.flipCard}
                    clickable={false}
                    onFlipEnd={(isFlipEnd) => { console.log('isFlipEnd', isFlipEnd) }}
                >
                    {/* Face Side */}
                    <View style={[styles.styleViewCardView, { backgroundColor: '#e6eeff' }]}>
                        {!this.state.flipCard ? <ScrollView>
                            <TextView
                                style={styles.stylesRow}
                                stylesTextContent={styles.stylesTextContent}
                                styleTitle={styles.styleLabel}
                                styleValue={styles.styleValue}
                                title={"Tên người dùng: "}
                                value={this.dataLogin.name}
                            />

                            <TextView
                                style={styles.stylesRow}
                                stylesTextContent={styles.stylesTextContent}
                                styleTitle={styles.styleLabel}
                                styleValue={styles.styleValue}
                                title={"Email: "}
                                value={this.dataLogin.email ? this.dataLogin.email : ''}
                            />

                            <TextView
                                style={styles.stylesRow}
                                stylesTextContent={styles.stylesTextContent}
                                styleTitle={styles.styleLabel}
                                styleValue={styles.styleValue}
                                title={"Giới tính: "}
                                value={this.dataLogin.sex ? (this.dataLogin.sex === 1 ? "Nam" : "Nữ") : ''}
                            />

                            <TextView
                                style={styles.stylesRow}
                                stylesTextContent={styles.stylesTextContent}
                                styleTitle={styles.styleLabel}
                                styleValue={styles.styleValue}
                                title={"Số điện thoại: "}
                                value={this.dataLogin.phone ? this.dataLogin.phone : ''}
                            />

                            <TextView
                                style={styles.stylesRow}
                                stylesTextContent={styles.stylesTextContent}
                                styleTitle={styles.styleLabel}
                                styleValue={styles.styleValue}
                                title={"Ngày sinh: "}
                                value={this.dataLogin.birth_day ? this.dataLogin.birth_day : ''}
                            />

                            <TextView
                                style={styles.stylesRow}
                                stylesTextContent={styles.stylesTextContent}
                                styleTitle={styles.styleLabel}
                                styleValue={styles.styleValue}
                                title={"Zalo: "}
                                value={this.dataLogin.zalo ? this.dataLogin.zalo : ''}
                            />

                            <TextView
                                style={styles.stylesRow}
                                stylesTextContent={styles.stylesTextContent}
                                styleTitle={styles.styleLabel}
                                styleValue={styles.styleValue}
                                title={"FaceBook: "}
                                value={this.dataLogin.facebook ? this.dataLogin.facebook : ''}
                            />

                            <TextView
                                style={[styles.stylesRow]}
                                stylesTextContent={styles.stylesTextContent}
                                styleTitle={styles.styleLabel}
                                styleValue={styles.styleValue}
                                title={"Phòng/ban: "}
                                value={this.dataLogin.id_branch ? this.dataLogin.id_branch : ''}
                            />

                            <TextView
                                style={[styles.stylesRow, { borderBottomWidth: 0 }]}
                                stylesTextContent={styles.stylesTextContent}
                                styleTitle={styles.styleLabel}
                                styleValue={styles.styleValue}
                                title={"Địa chỉ: "}
                                value={this.dataLogin.address ? this.dataLogin.address : ''}
                            />
                        </ScrollView> : <View />}
                    </View>
                    <View style={[styles.styleViewCardView, { backgroundColor: '#ebfafa' }]}>
                        {!this.state.flipCard ? <View /> : <ScrollView style={{ paddingBottom: 12 }}>
                            <InputView
                                id={2}
                                isCleared
                                style={[styles.styleInput]}
                                styleTextInputElement={styles.styleTextInputElement}
                                placeholder={"Nhập số điện thoại người dùng ..."}
                                value={this.textPhone}
                                blurOnSubmit={true}
                                iconLeft={'parcel_locate'}
                                textTitle={"Số điện thoại người dùng: "}
                                onChangeText={this.setValueTextInput}
                            />
                            <InputView
                                id={3}
                                isCleared
                                style={[styles.styleInput]}
                                styleTextInputElement={styles.styleTextInputElement}
                                placeholder={"Nhập Zalo ..."}
                                value={this.textZalo}
                                blurOnSubmit={true}
                                iconLeft={'parcel_locate'}
                                textTitle={"Zalo: "}
                                onChangeText={this.setValueTextInput}
                            />
                            <InputView
                                id={4}
                                isCleared
                                style={[styles.styleInput]}
                                styleTextInputElement={styles.styleTextInputElement}
                                placeholder={"Nhập facebook ..."}
                                value={this.textFace}
                                blurOnSubmit={true}
                                iconLeft={'parcel_locate'}
                                textTitle={"Facebook: "}
                                onChangeText={this.setValueTextInput}
                            />
                        </ScrollView>}
                    </View>
                </FlipCard>
            </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    styleTitle: {
        fontSize: configs.fontSize14_5,
        fontFamily: 'Lato-Regular',
        color: 'black',
    },
    styleViewIconLeftBase: {
        padding: configs.padding,
        width: configs.heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: configs.marginLeft10,
    },
    linearGradient: {
        height: '45%',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        // elevation: 3,
        // shadowColor: '#000',
        position: 'absolute',
        top: 0,
        width: '100%'
    },
    styleViewCardView: {
        backgroundColor: 'white',
        height: height / 2,
        width: width * 3 / 4,
        alignSelf: 'center',
        borderRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        borderColor: 'gray',
        borderWidth: 0.5,
        padding: 12
    },
    stylesRow: {
        borderBottomColor: 'white',
        borderBottomWidth: 0.5,
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    stylesTextContent: {
        flex: 1,
        flexDirection: 'row',
    },
    styleLabel: {
        flex: 1,
        fontStyle: 'normal',
        fontSize: configs.fontSize13,
        color: configs.colorText,
        minWidth: 40
    },
    styleValue: {
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        textAlign: 'center',
        fontSize: configs.fontSize13,
        color: 'black',
    },
    styleTextInputElement: {
        flexDirection: 'row',
        height: configs.heightInput40,
        borderColor: configs.colorTitleCard,
        borderWidth: 0.5,
        borderRadius: 8,
    },
    styleButtonEdit: {
        color: 'white',
        paddingVertical: 5,
        borderRadius: 12,
        paddingHorizontal: 12,

    }
})

const mapStateToProps = state => ({
    ThongTinNguoiDungReducer: state.ThongTinNguoiDungReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        requestUpdateThongTinNguoiDung: (params) => {
            api.requestUpdateThongTinNguoiDung(dispatch, params)
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(BaoCaoScreen)