import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, View, ViewPropTypes, TouchableOpacity } from 'react-native';
import IconView from './IconView';
import { commonsConfigs as configs } from '../../commons'
class TextView extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.onPress = this.onPress.bind(this)
    }

    onPress = () => {
        this.props.onPress && this.props.onPress(this.props.value, this.props.id)
    }

    static propTypes = {
        title: PropTypes.string,
        iconColor: PropTypes.string,
    };

    render() {
        const {
            style,
            iconLeft,
            iconColor,
            iconSize,
            iconLeftStyle,
            iconRight,
            iconColorRight,
            iconRightSize,
            iconRightStyle,
            stylesTextContent,
            title,
            styleTitle,
            value,
            styleValue,
            onPress,
            sourceLeft,
            sourceRight
        } = this.props;
        let disabledOnPress = onPress ? false : true
        let styleContainer = [styles.containerStyle, style]
        let styleIconLeft = [styles.iconLeftStyle, iconLeftStyle]
        let styleIconRight = [styles.iconRightStyle, iconRightStyle]
        let titleStyle = [styles.styleTitle, styleTitle]
        let valueStyle = [styles.styleValue, styleValue]
        return (
            <TouchableOpacity style={styleContainer} disabled={disabledOnPress} onPress={this.onPress}>
                {iconLeft &&
                    <IconView
                        style={styleIconLeft}
                        name={iconLeft}
                        size={iconSize}
                        color={iconColor}
                    />}
                <View style={stylesTextContent}>
                    {title ? <Text style={titleStyle}>{title}</Text> : <View />}
                    {value ? <Text style={valueStyle}>{value}</Text> : <View />}
                </View>
                {iconRight &&
                    <IconView
                        style={styleIconRight}
                        name={iconRight}
                        size={iconRightSize}
                        color={iconColorRight}
                    />}
            </TouchableOpacity>
        )
    }
}

TextView.defaultProps = {
    iconSize: configs.sizeIcon14,
    iconRightSize: configs.sizeIcon14,
    iconColor: configs.colorIcon,
    iconColorRight: configs.colorIcon,
};

const styles = StyleSheet.create({
    containerStyle: {
        paddingTop: configs.paddingTop,
        paddingBottom: configs.paddingBottom,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    iconLeftStyle: {
        marginRight: configs.marginRight,
    },
    iconRightStyle: {
    },

    styleTitle: {
        fontFamily: 'Lato-Regular',
        fontSize: configs.fontSize8,
        color: "gray",
        fontStyle: "italic",
    },

    styleValue: {
        fontFamily: 'Lato-Regular',
        fontSize: configs.fontSize14,
        color: configs.colorText,
    },

})

export default TextView;