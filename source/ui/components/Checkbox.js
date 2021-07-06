import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Alert, Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
// import Image from 'react-native-remote-svg';
import { commonsConfigs } from '../../commons';
import _ from 'lodash'
import Popup from '../components/Dialog';
import Root from '../components/Root';

const checked = require('../../assets/image/checked.png');
const uncheck = require('../../assets/image/uncheck.png');

export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCheck: this.props.isSelected,
            containerStyle: [styles.containerStyle, this.props.containerStyle],
            labelPosition: this.props.labelPosition ? this.props.labelPosition : 'after',
            labelStyle: [styles.labelStyle, this.props.labelStyle],
            label: this.props.label,
            numberOfLabelLines: this.props.numberOfLabelLines,
            checkboxStyle: [styles.checkboxStyle, this.props.checkboxStyle],
            imageCheck: [checked, this.props.imageCheck],
            imageUncheck: [uncheck, this.props.imageUncheck],
            imageCheck: checked,
            imageUncheck: uncheck,
        };
        this.toggleCheck = this.toggleCheck.bind(this)
    }

    toggleCheck = () => {
        if (!this.props.disable) {
            var checked = !this.state.isCheck;
            this.setState({ isCheck: checked });
            this.props.onChange && this.props.onChange(this.props.id, checked, this.props.data);
        } else {
            Popup.show({
                type: 'Warning',
                title: 'A Chấm Công',
                textBody:
                    this.props.messageError,
                // button: true,
                buttonCancel: true,
                // callback: () => this.requestLogout(),
                callbackOk: () => Popup.hide(),
            });
            // Alert.alert(
            //     'A Chấm Công',
            //     this.props.messageError,
            //     [
            //         {
            //             text: "Đóng",
            //             onPress: () => { },
            //         },
            //     ],
            //     { cancelable: false },
            // );
        }

    }

    componentDidMount() {
        this.setState(_.extend({}, this.props.style, _.omit(this.props, 'style')))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSelected !== this.props.isSelected) {
            //     Toast.show(JSON.stringify('O day ' + nextProps.isSelected))
            this.setState({ isCheck: nextProps.isSelected });
        }
        this.props = nextProps;
    }

    render() {
        let { stylesContainer, stylesContainerLabel } = this.props
        let labelPosition = this.state.labelPosition
        return (

            <TouchableOpacity
                style={this.state.containerStyle}
                onPress={this.toggleCheck}>

                <View style={(labelPosition === 'after' || labelPosition === 'before') ? styles.containerRowStyle : styles.containerColumnStyle}>
                    {labelPosition == 'after' ? (
                        <Image source={(this.state.isCheck ? this.state.imageCheck : this.state.imageUncheck)}
                            style={this.state.checkboxStyle} />
                    )
                        : <View />}
                    <View style={[{ justifyContent: 'center', alignItems: 'center' }, stylesContainerLabel]}>
                        <Text style={this.state.labelStyle} numberOfLines={this.state.numberOfLabelLines}>
                            {this.state.label}
                        </Text>
                    </View>
                    {labelPosition == 'before' ? (
                        <Image source={(this.state.isCheck ? this.state.imageCheck : this.state.imageUncheck)}
                            style={this.state.checkboxStyle} />
                    ) : <View />}
                </View>
            </TouchableOpacity >
        )
    }
}

Checkbox.propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool,
    labelPosition: PropTypes.oneOf([
        'above',
        'below',
        'after',
        'before',

    ]),
    name: PropTypes.string,
}

const styles = StyleSheet.create({

    containerStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    containerRowStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    containerColumnStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    checkboxStyle: {
        width: commonsConfigs.sizeCheckbox,
        height: commonsConfigs.sizeCheckbox,

    },

    labelStyle: {
        marginLeft: commonsConfigs.marginLeft10,
        fontSize: commonsConfigs.fontSize14,
        color: commonsConfigs.colorText,
    },
});

