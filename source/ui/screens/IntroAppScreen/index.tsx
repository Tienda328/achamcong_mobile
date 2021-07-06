

import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import IconView from '../../components/IconView'
import { models } from '../../../commons/model';
import * as schema from '../../../commons/model/entity/Schema';
import { StackActions, NavigationActions } from 'react-navigation'

const data = [
    {
        title: 'Chấm công dễ dàng',
        image: require('../../../assets/image/intro01.png'),
        bg: ['#9dd6eb', '#aadcee', '#c0e5f2'],
        content: "Tự động chấm công (Check in - check out) ngay trên smartphone. Chỉ mất 01 giây chụp ảnh selfie gương mặt kết hợp hệ thống wifi và bật định vị GPS khai báo vị trí và thời gian làm việc. Tiện lợi - tiết kiệm thời gian"
    },
    {
        title: 'Quản lý tiện lợi',
        image: require('../../../assets/image/intro02.png'),
        bg: ['#41b0d8', '#56b8dc', '#6bc1e1'],
        content: "Tích hợp hệ thống đơn từ điện tử: Đi muộn, về sớm, nghỉ phép, làm thêm, tăng ca, công tác... được cấu hình sẵn trên phần mềm dễ dàng thao tác, lưu trữ."
    },
    {
        title: 'Chủ động theo dõi quỹ nghỉ phép',
        image: require('../../../assets/image/intro03.png'),
        bg: ['#99ccff', '#62b7b0', '#85c7c1'],
        content: "dễ dàng soạn, gửi, quản lý đơn xin nghỉ phép ngay trên di động không mất thời gian viết tay, trình ký. Nhận ngay kết quả trả về phê duyệt hoặc từ chối đơn nghỉ từ cấp quản lý"
    },
    {
        title: 'Tự động hóa bảng chấm công nhân sự',
        image: require('../../../assets/image/intro04.png'),
        bg: ['#33ccff', '#b3d9ff', '#cce6ff'],
        content: "Xuất dữ liệu bảng chấm công chính xác tuyệt đối: tự động tính toán ngày công, cập nhật bảng công Realtime ngay sau khi chấm công thành công, tự động trừ phép, phép được tính công, phép không được tính công,..."
    },
    {
        title: 'Lọc báo cáo, nhận thông báo nhanh chóng',
        image: require('../../../assets/image/intro05.png'),
        bg: ['#33cccc', '#5cd6d6', '#85e0e0'],
        content: "Các thông báo nội bộ được gửi về app nhanh chóng, giúp cập nhật thông tin kịp thời. Lọc chính xác dữ liệu, Lịch sử chấm công theo tùy chọn"
    },
];

const logo = require('../../../assets/image/logo.png')

type Item = typeof data[0];

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: Dimensions.get('window').height / 2,
        marginVertical: 12,
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Lato-Regular',
        color: 'black',
        marginHorizontal: 24
    },
    title: {
        fontSize: 22,
        color: 'red',
        textAlign: 'center',
    },
    buttonCircle: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default class App extends React.Component {
    _renderItem = ({ item }: { item: Item }) => {
        return (
            <LinearGradient
                colors={item.bg}
                start={{ x: 0, y: 0.25 }}
                end={{ x: 0.5, y: 1 }}
                style={[styles.slide, {
                    flex: 1
                }]}>
                <Image
                    source={logo}
                    style={{
                        position: 'absolute',
                        top: 25,
                        left: 12,
                        width: 40, height: 40,
                    }}
                />

                <TouchableOpacity style={{
                    position: 'absolute',
                    top: 35,
                    right: 0,
                    minHeight: 30
                }} onPress={this.closeIntroApp}>
                    <Text style={[styles.text, { color: 'white', textDecorationLine: 'underline', }]}>{'Bỏ qua >>>>'}</Text>
                </TouchableOpacity>

                <Text style={[styles.title, { fontFamily: Platform.OS === 'ios' ? 'Lato-Regular' : 'victoria', fontSize: 30, paddingHorizontal: 12 }]}>{item.title}</Text>
                <Image source={item.image} style={[styles.image, { resizeMode: 'contain' }]} />
                <Text style={styles.text}>{item.content}</Text>
            </LinearGradient>
        );
    };

    closeIntroApp = () => {
        let params = {
            id: schema.ID_INTRO_APP_SETTING,
            content: "1"
        }
        models.insertSetting(params)

        this.props.navigation.dispatch(
            StackActions.reset({
                index: 0,
                key: null,
                actions: [NavigationActions.navigate({ routeName: 'SplashScreen' })]
            })
        )
    }

    _keyExtractor = (item: Item) => item.title;

    _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <IconView
                    style={{ justifyContent: 'center', alignItems: 'center', }}
                    color='white'
                    name={"arrow-right"}
                    size={20}
                    height={20}
                />
            </View>
        );
    };

    _renderDoneButton = () => {
        return (
            <TouchableOpacity style={styles.buttonCircle} onPress={this.closeIntroApp}>
                <IconView
                    style={{ justifyContent: 'center', alignItems: 'center', }}
                    color='white'
                    name={"check-mark"}
                    size={20}
                    height={20}
                />
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar translucent backgroundColor="transparent" />
                <AppIntroSlider
                    keyExtractor={this._keyExtractor}
                    renderDoneButton={this._renderDoneButton}
                    renderNextButton={this._renderNextButton}
                    renderItem={this._renderItem}
                    data={data}
                />
            </View>
        );
    }
}