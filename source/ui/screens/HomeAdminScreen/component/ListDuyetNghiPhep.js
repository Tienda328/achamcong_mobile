import React from 'react';
import { StatusBar, StyleSheet, View, Dimensions } from 'react-native';
import { BaseComponent, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import BaseViewAdmin from './BaseViewAdmin'
import IdSelect from '../IdSelect'

const AppStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[{ backgroundColor, height: configs.heightStatusbar, }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

const widthViewIcon = Dimensions.get('window').width / 3 - 5
const logo_app = require('../../../../assets/image/logo.png')
class ListDuyetNghiPhep extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.handleOnClickView = this.handleOnClickView.bind(this)
    }

    handleOnClickView = (value, id,) => {
        switch (id) {
            case IdSelect.idNghiPhep:
                this.props.navigation.navigate('DuyetNghiPhepScreen')
                break;
            case IdSelect.idDiMuonVeSom:
                this.props.navigation.navigate('DuyetDiMuonVeSomScreen')
                break;
            case IdSelect.idQuenChamCong:
                this.props.navigation.navigate('DuyetQuenChamCongScreen')
                break;
            case IdSelect.idDiCongTac:
                this.props.navigation.navigate('DuyetDiCongTacScreen')
                break;
            case IdSelect.idChangeShift:
                this.props.navigation.navigate('DuyetChangeShiftScreen')
                break;
            case IdSelect.idDiGapKhachHang:
                break;
        }
    }

    render() {
        return (
            <BaseViewAdmin stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={"Duyệt nghỉ phép"}
                subTitle={'havantam.it@gmail.com'}
                styleToolbar={{ height: 45 }}
                isBorderBottomWidth={false}
                styleTitle={[styles.styleTitle]}
                styleTitleToolbarBase={[styles.styleTitleToolbarBase, { color: 'white' }]}
            >

                <TextView
                    id={IdSelect.idNghiPhep}
                    onPress={this.handleOnClickView}
                    style={[styles.viewRow, {}]}
                    stylesTextContent={styles.viewContentRow}
                    styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45", flex: 1 }}
                    value={'Duyệt nghỉ phép'}
                    iconLeft='parcel-code'
                    iconColor={configs.colorOrange}
                    iconSize={configs.sizeIcon18}
                    iconRight={'right-arrow1'}
                    iconRightSize={configs.sizeIcon18}
                />
                <TextView
                    id={IdSelect.idDiMuonVeSom}
                    onPress={this.handleOnClickView}
                    style={[styles.viewRow, {}]}
                    stylesTextContent={styles.viewContentRow}
                    styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45", flex: 1 }}
                    value={'Duyệt đi muộn về sớm'}
                    iconLeft='circle-sync'
                    iconColor={configs.colorOrange}
                    iconSize={configs.sizeIcon18}
                    iconRight={'right-arrow1'}
                    iconRightSize={configs.sizeIcon18}
                />
                <TextView
                    id={IdSelect.idQuenChamCong}
                    onPress={this.handleOnClickView}
                    style={[styles.viewRow, {}]}
                    stylesTextContent={styles.viewContentRow}
                    styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45", flex: 1 }}
                    value={'Duyệt quên chấm công'}
                    iconLeft='data-sync'
                    iconColor={configs.colorOrange}
                    iconSize={configs.sizeIcon18}
                    iconRight={'right-arrow1'}
                    iconRightSize={configs.sizeIcon18}
                />
                <TextView
                    id={IdSelect.idDiCongTac}
                    onPress={this.handleOnClickView}
                    style={[styles.viewRow, {}]}
                    stylesTextContent={styles.viewContentRow}
                    styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45", flex: 1 }}
                    value={'Duyệt đi gặp khách hàng'}
                    iconLeft='customer-info'
                    iconColor={configs.colorOrange}
                    iconSize={configs.sizeIcon18}
                    iconRight={'right-arrow1'}
                    iconRightSize={configs.sizeIcon18}
                />
                <TextView
                    id={IdSelect.idChangeShift}
                    onPress={this.handleOnClickView}
                    style={[styles.viewRow]}
                    stylesTextContent={styles.viewContentRow}
                    styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45", flex: 1 }}
                    value={'Duyệt xin chuyển đổi ca'}
                    iconLeft='circle-sync'
                    iconColor={configs.colorOrange}
                    iconSize={configs.sizeIcon18}
                    iconRight={'right-arrow1'}
                    iconRightSize={configs.sizeIcon18}
                />
            </BaseViewAdmin>
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
    styleTitleViewIcon: {
        fontSize: configs.fontSize14,
        fontFamily: 'Lato-Regular',
        color: 'black',
        textAlign: 'center',
    },
    styleViewToolbarBase: {
        backgroundColor: 'transparent',
        height: configs.heightToolBar,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    stylesubTitle: {
        fontFamily: 'Lato-Regular',
        color: configs.colorText,
        fontSize: 12,
        marginTop: -2
    },
    viewContentRow: {
        flexDirection: 'row',
        flex: 1,
        height: '100%',
        alignItems: 'center',
        marginLeft: configs.marginLeft10,
    },
    styleValue: {
        marginLeft: 12
    },
    styleTextView: {
        borderBottomWidth: 0.5,
        borderColor: 'gray',
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 12
    },
    viewRow: {
        backgroundColor: 'white',
        height: 50,
        paddingHorizontal: configs.padding15,
        borderBottomColor: configs.colorBorder,
        borderBottomWidth: 1
    },
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ListDuyetNghiPhep)