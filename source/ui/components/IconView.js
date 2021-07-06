import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { IconFont } from '../../assets/icon';
import PropTypes from 'prop-types';
import { AppDimensions, AppColors } from '../../commons/defined'

class IconView extends Component {
    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        size: PropTypes.number,
        color: PropTypes.string
    };

    static defaultProps = {
        style: {},
        iconLeftStyle: {},
        size: 14,
        color: AppColors.colorIcon,
    };

    render() {
        const {
            style,
            name,
            size,
            color,
            isRequiredField,
        } = this.props;
        return (
            <View style={[styles.containerStyle, style]} onStartShouldSetResponder={this.props.onPress} >
                <IconFont
                    name={name}
                    size={size}
                    color={color} />
                {isRequiredField ? <View style={{ width: '100%', height: '100%', position: 'absolute', paddingLeft: 2, }}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        marginTop: -(5),
                        width: 24,
                        height: 24,
                        color: 'red',
                    }}>*</Text>
                </View> : <View />}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default IconView

