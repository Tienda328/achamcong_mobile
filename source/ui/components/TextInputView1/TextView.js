import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { commonsConfigs as configs } from '../../../commons';
import  IconView  from '../IconView';

export default class TextView extends PureComponent {
    inputRef = React.createRef()
    constructor(props) {
        super(props)
        eventCount = 0
        this.state = {
            value: props.value,
            isPlaceholder: (props.value && props.value.length > 0) ? false : true
        }
        this.onChangeTextInput = this.onChangeTextInput.bind(this)
        this.onChange = this.onChange.bind(this)

    }

    onChangeTextInput = (event) => {

    }

    onChange = (event) => {
        let text = event.nativeEvent.text
        this.eventCount = event.nativeEvent.eventCount
    }


    componentWillReceiveProps(nextProps) {

    }

    securePasswordEntry = (value) => {
        return value && value.replace(/./g, '*')
    }

    getIconElement = (iconElement, onPressIcon, stylesIcon, isRequiredField) => {
        if (iconElement) {
            let onPress = iconElement.onPress || onPressIcon
            let style = iconElement.style || stylesIcon
            let name = iconElement.name || iconElement
            let size = iconElement.size || stylesIcon.width - 11
            let color = iconElement.color || stylesIcon.color
            return (this.getIcon(style, name, size, color, onPress, isRequiredField))
        }
    }

    getIcon = (style, name, size, color, onPress, isRequiredField) => {
        return (
            <IconView
                isRequiredField={isRequiredField}
                onPress={onPress}
                style={style}
                name={name}
                size={size}
                color={color}
            />
        )
    }

    render() {
        const { style, styleTextInput, placeholderTextColor } = this.props
        const { value } = this.state
        let styleContainer = [styles.style, style]
        let styleInput = [styles.styleTextInput, styleTextInput]
        let colorHintText = [configs.colorHintText, placeholderTextColor]
        return (
            <View style={[styles.style, styleContainer]} >
                <Text></Text>
            </View >
        )
    }
};

TextView.propTypes = {
    iconCleaned: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array
    ]),
    iconLeft: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array
    ]),

    stylesIconLeft: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array
    ]),

    iconRight: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array
    ]),
    iconMessage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array
    ]),
};

TextView.defaultProps = {



};

const styles = StyleSheet.create({

    style: {
        flex: 1,
        backgroundColor: 'white',
        overflow: 'hidden',
        margin: configs.margin,
    },

    styleTextInput: {
        flexDirection: 'row',
        overflow: 'hidden',
        justifyContent: 'center',
        padding: 0.5,
        alignItems: 'center',
        borderColor: configs.colorBorderInput,
        borderWidth: configs.borderWidthInput,
        borderRadius: configs.borderRadius4,
    },


})
