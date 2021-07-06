import React, { Component } from "react";
import { StyleSheet } from 'react-native';
import { commonsConfigs as configs } from '../../../../commons';
import { BaseDiaLog, RadioForm, TextView } from '../../../components';

const DataRadio = [
    { index: 0, label: "Lịch sử nghỉ phép", value: "1" },
    { index: 1, label: "Lịch sử đi muộn, về sớm", value: "2" },
    { index: 2, label: "Lịch sử quên chấm công", value: "3" },
    { index: 3, label: "Lịch sử đi công tác", value: "4" },
    { index: 4, label: "Lịch sử xin chuyển đổi ca", value: "5" }
]

export default class DialogFilterDate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
        }
        this.indexSelected = this.props.dataSelect && this.props.dataSelect.index ? this.props.dataSelect.index : 0
        // console.log("this.props.dataSelect:    " + JSON.stringify(this.props.dataSelect))
        this.handleSelectedDateFileter = this.handleSelectedDateFileter.bind(this)
        this.applyFilterParcel = this.applyFilterParcel.bind(this)

        this.dataRadioSelect = DataRadio[this.indexSelected]
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    handleSelectedDateFileter = (index, itemSelected) => {
        this.dataRadioSelect = itemSelected
    }

    applyFilterParcel = () => {
        this.props.closedDialog(1, false)
        this.props.applyResponses(this.dataRadioSelect)
    }

    render() {
        let { isShowDialog, closedDialog, requestOrder } = this.props
        return (
            <BaseDiaLog
                //truyền true để hiển thị dialog, và ngược lại
                isIconClosed
                visibleModal={isShowDialog}
                closedDialog={() => closedDialog(1, false)}
                titleDialog={"Bộ lọc tìm kiếm"}
            >
                <RadioForm
                    radio_props={DataRadio}
                    initial={this.props.dataSelect.index}
                    borderWidth={0}
                    labelStyle={{
                        flex: 1,
                        marginRight: 25,
                        fontSize: configs.fontSize14,
                    }}
                    radioWrap={{
                        alignContent: 'center',
                        justifyContent: 'center',
                        marginLeft: 25,
                        marginBottom: 5,
                        paddingVertical: 5,
                    }}
                    style={{
                        marginTop: configs.marginTop10,
                    }}
                    onPress={this.handleSelectedDateFileter}
                />

                <TextView
                    onPress={() => this.applyFilterParcel()}
                    style={styles.styleButton}
                    styleValue={{ color: 'white', fontWeight: '500', fontSize: configs.fontSize14 }}
                    value={"Áp Dụng"}
                />
            </BaseDiaLog>
        )
    }

}

const styles = StyleSheet.create({
    styleButton: {
        backgroundColor: configs.colorMain,
        height: configs.heightInput40,
        borderColor: configs.colorMainDaiMau2,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        paddingVertical: 12,
        margin: configs.margin15
    },
})
