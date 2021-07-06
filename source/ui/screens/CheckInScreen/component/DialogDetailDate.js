import React, { Component } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { commonsConfigs as configs } from '../../../../commons';
import { IconView, InputView, TextView } from '../../../components';
import BaseDialog from '../../../components/BaseDiaLog'
import { models } from "../../../../commons/model";
const DEVICE_HEIGHT = Dimensions.get('window').height;
const checked = require('../../../../assets/image/checked.png')
const uncheck = require('../../../../assets/image/uncheck.png')


const renderItem = ({
    item: {
        checkin,
        checkout,
        late,
        soon,
        shift,
        shift_total,
        name,
        time_start,
    }
}) => {
    late = (late === 0 && checkin > time_start) ? ((checkin - time_start) / 60).toFixed(1) : late;

    let customeColorShift = !checkin || !checkout ? styles.outIsland : null;

    checkin = checkin ? configs.quyDoiTimeStampToTime(checkin) : configs.timeHide;
    checkout = checkout ? configs.quyDoiTimeStampToTime(checkout) : configs.timeHide;

    let customeColor = late || soon ? styles.styleWarning : styles.styleHappy;

    return <View>
        <Text style={[styles.styleHeader, customeColor, customeColorShift]}>{name}</Text>
        <TextView
            style={styles.stylesRow}
            stylesTextContent={styles.stylesTextContent}
            styleTitle={styles.styleLabel}
            styleValue={styles.styleValue}
            title={"- Thời gian check in: "}
            value={checkin}
        />

        <TextView
            style={styles.stylesRow}
            stylesTextContent={styles.stylesTextContent}
            styleTitle={styles.styleLabel}
            styleValue={styles.styleValue}
            title={"- Thời gian check out: "}
            value={checkout}
        />

        <TextView
            style={styles.stylesRow}
            stylesTextContent={styles.stylesTextContent}
            styleTitle={styles.styleLabel}
            styleValue={styles.styleValue}
            title={"- Số phút đi muộn: "}
            value={late + 'p'}
        />

        <TextView
            style={styles.stylesRow}
            stylesTextContent={styles.stylesTextContent}
            styleTitle={styles.styleLabel}
            styleValue={styles.styleValue}
            title={"- Số phút về sớm: "}
            value={soon + 'p'}
        />

        <TextView
            style={[styles.stylesRow, { borderBottomWidth: 0 }]}
            stylesTextContent={styles.stylesTextContent}
            styleTitle={styles.styleLabel}
            styleValue={styles.styleValue}
            title={"- Công / Ca: "}
            value={`${shift}/${shift_total}`}
        />
    </View>
}
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
        let { isShowDialog, data, date } = this.props;
        return (
            <BaseDialog
                visibleModal={isShowDialog}
                styleTextTitle={{ fontSize: 14 }}
                titleDialog={`Chi tiết ngày: ${date}`}
                isIconClosed={true}
                closedDialog={this.closedDialog}
            >
                {
                    Array.isArray(data) && <FlatList
                        keyExtractor={item => item.date}
                        data={data}
                        renderItem={renderItem}
                    />
                }

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
    styleHeader: {
        textAlign: 'center',
        fontWeight: 'bold',
        paddingVertical: 10,
        letterSpacing: 1.2,
        fontSize: configs.fontSize18,
        color: '#333333'
    },
    styleWarning: {
        backgroundColor: '#f5b642',
    },
    styleHappy: {
        backgroundColor: '#41e83f',
    },
    outIsland: {
        backgroundColor: '#fc5c30',

    }

})
export default DialogDetailDate