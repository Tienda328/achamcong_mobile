import React, { Component } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { commonsConfigs as configs } from '../../../../commons';
import { IconView, InputView, TextView } from '../../../components';
import BaseDialog from '../../../components/BaseDiaLog'
import { models } from "../../../../commons/model";
const DEVICE_HEIGHT = Dimensions.get('window').height;
const checked = require('../../../../assets/image/checked.png')
const uncheck = require('../../../../assets/image/uncheck.png')
class DialogSuaToken extends Component {

    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
            data: models.getDataLogin()
        }
        this.closedDialog = this.closedDialog.bind(this)

    }

    closedDialog = () => {
        this.props.showDialog(false)
    }


    render() {
        let { isShowDialog } = this.props
        let { data } = this.state
        return (
            <BaseDialog
                visibleModal={isShowDialog}
                titleDialog={'Chi tiết người dùng'}
                isIconClosed={true}
                closedDialog={this.closedDialog}
            >
                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"Tên người dùng: "}
                    value={data.name}
                />

                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"Email: "}
                    value={data.email ? data.email : ''}
                />

                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"Giới tính: "}
                    value={data.sex ? (data.sex === 1 ? "Nam" : "Nữ") : ''}
                />

                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"Số điện thoại: "}
                    value={data.phone ? data.phone : ''}
                />

                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"Ngày sinh: "}
                    value={data.birth_day ? data.birth_day : ''}
                />

                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"Zalo: "}
                    value={data.zalo ? data.zalo : ''}
                />

                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"FaceBook: "}
                    value={data.facebook ? data.facebook : ''}
                />

                <TextView
                    style={[styles.stylesRow]}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"Phòng/ban: "}
                    value={data.id_branch ? data.id_branch : ''}
                />

                <TextView
                    style={[styles.stylesRow, {borderBottomWidth: 0}]}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"Địa chỉ: "}
                    value={data.address ? data.address : ''}
                />
            </BaseDialog>
        )
    }
}

const styles = StyleSheet.create({
    styleText: {
        fontSize: configs.fontSize14,
        fontFamily: 'Lato-Regular',
        color: 'white',

    },
    stylesRow: {
        borderBottomColor: configs.colorDivide,
        borderBottomWidth: 0.5,
        paddingHorizontal: 12,
        paddingVertical: 10
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
    },

    styleValue: {
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        textAlign: 'right',
        fontSize: configs.fontSize13,
        color: 'black',
    },
})
export default DialogSuaToken