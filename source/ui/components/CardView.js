import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { commonsConfigs } from '../../commons'
import IconView from './IconView'

class CardView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            styleContainerCard: [styles.styleContainer, this.props.styleCard],
            titleCard: this.props.titleCard,
            styleTitle: [styles.styleTitle, this.props.styleTitleCard],
            styleHeader: [styles.styleHeader, this.props.styleHeader],
            nameIcon: this.props.nameIcon,
            isArrowShow: this.props.isArrowShow || false,
            styleButtonIcon: [styles.iconRightContainerStyle, this.props.styleButtonIcon],
            stylesBgIcon: [styles.stylesBgIcon, this.props.stylesBgIcon],
            stylesIcon: [styles.stylesIcon, this.props.stylesIcon],

        };
        this.toggleView = this.toggleView.bind(this)
    }

    toggleView() {
        this.props.onPressIcon && this.props.onPressIcon(!this.props.isArrowShow, this.props.id);
    }

    render() {
        let { viewLeftElement, viewRightElement } = this.props
        return (
            <View style={this.state.styleContainerCard}>
                <View style={this.state.styleHeader}>
                    {viewLeftElement}
                    <Text style={this.state.styleTitle}> {this.props.titleCard}</Text>
                    {viewRightElement}
                    {this.state.nameIcon &&
                        <IconView
                            onPress={this.toggleView}
                            color={this.props.colorIcon}
                            style={this.state.stylesBgIcon}
                            name={this.props.nameIcon}
                            size={this.props.sizeIcon}
                        />
                    }
                </View>
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styleContainer: {
        flexDirection: 'column',
        backgroundColor: commonsConfigs.backgroudCardView,
        // margin: commonsConfigs.margin10,
        borderRadius: 8,
        shadowRadius: commonsConfigs.borderRadiusCard,
        shadowColor: 'gray',
        elevation: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },

    stylesIconContainer: {
        width: commonsConfigs.widthIconInput,
        height: commonsConfigs.heightIconInput,
        backgroundColor: commonsConfigs.bgIconInput,
        justifyContent: 'center',
        alignItems: 'center',

    },

    styleHeader: {
        height: commonsConfigs.heightHeader,
        padding: commonsConfigs.padding,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: commonsConfigs.colorBgCardVIew,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },

    styleTitle: {
        flex: 1,
        color: commonsConfigs.colorTitleCard,
    },

    iconRightContainerStyle: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: commonsConfigs.padding,
        flex: 1
    },

    stylesIcon: {
        width: commonsConfigs.widthIcon16,
        height: commonsConfigs.heightIcon16,
    },

    stylesBgIcon: {
        width: commonsConfigs.sizeIcon24,
        height: commonsConfigs.sizeIcon24,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',

    },
});

export default CardView;
