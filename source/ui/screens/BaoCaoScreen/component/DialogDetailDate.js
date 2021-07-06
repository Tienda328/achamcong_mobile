import React, { Component } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { commonsConfigs as configs } from '../../../../commons';
import { IconView, InputView, TextView } from '../../../components';
import BaseDialog from '../../../components/BaseDiaLog'
import { models } from "../../../../commons/model";
const DEVICE_HEIGHT = Dimensions.get('window').height;
const checked = require('../../../../assets/image/checked.png')
const uncheck = require('../../../../assets/image/uncheck.png')
class DialogDetailDate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
        }
        this.closedDialog = this.closedDialog.bind(this)

    }

    closedDialog = () => {
        this.props.showDialog(false)
    }


    render() {
        let { isShowDialog, data } = this.props
        // let dataItem = data ? data : {}
        // console.log("dataItem:   ", JSON.stringify(dataItem))
        // console.log('__________________data dialog', data);

        return (
            <BaseDialog
                visibleModal={isShowDialog}
                styleTextTitle={{ fontSize: 14 }}
                titleDialog={'Chi tiết ngày ' + data.date}
                isIconClosed={true}
                closedDialog={this.closedDialog}
            >


                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"- Số phút đi muộn: "}
                    value={data.late ? data.late + 'p' : "0p"}
                />

                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"- Số phút về sớm: "}
                    value={data.soon ? data.soon + 'p' : '0p'}
                />

                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"- Thời gian làm việc: "}
                    value={data.time_real ? data.time_real : configs.timeHide}
                />

                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"- Thời gian thực tế: "}
                    value={data.time_official ? data.time_official : configs.timeHide}
                />

                <TextView
                    style={[styles.stylesRow, { borderBottomWidth: 0 }]}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={"- Công / Ngày: "}
                    value={data.shift ? data.shift : '0'}
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
        paddingVertical: 12
    },

    stylesTextContent: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 4
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
export default DialogDetailDate