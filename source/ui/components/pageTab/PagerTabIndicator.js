'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, ViewPropTypes, Image, Text, TouchableOpacity } from 'react-native'
import { IndicatorViewPager } from 'rn-viewpager';

const backgroundColor = '#d6d6c2'
const backgroundColorSelect = '#999966'

export default class PagerTabIndicator extends Component {
    static propTypes = {
        ...ViewPropTypes,
        initialPage: PropTypes.number,
        pager: PropTypes.instanceOf(IndicatorViewPager),
        tabs: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string,
            numberCount: PropTypes.number,
            iconSource: Image.propTypes.source,
            selectedIconSource: Image.propTypes.source
        })).isRequired,
        itemStyle: ViewPropTypes.style,
        selectedItemStyle: ViewPropTypes.style,
        iconStyle: Image.propTypes.style,
        selectedIconStyle: Image.propTypes.style,
        textStyle: Text.propTypes.style,
        selectedTextStyle: Text.propTypes.style,
        changePageWithAnimation: PropTypes.bool,
    }

    static defaultProps = {
        tabs: [],
        changePageWithAnimation: true
    }

    state = {
        selectedIndex: this.props.initialPage
    }

    render() {
        let {
            tabs, pager, style, itemStyle, selectedItemStyle, iconStyle,
            selectedIconStyle, textStyle, selectedTextStyle, changePageWithAnimation,
        } = this.props
        if (!tabs || tabs.length === 0) return null

        let tabsView = tabs.map((tab, index) => {
            let isSelected = this.state.selectedIndex === index
            return (
                <TouchableOpacity
                    style={[styles.itemContainer, isSelected ? selectedItemStyle : itemStyle]}
                    activeOpacity={0.5}
                    key={index}
                    onPress={() => {
                        if (!isSelected) {
                            if (this.props.changePageWithAnimation)
                                pager.setPage(index);
                            else pager.setPageWithoutAnimation(index);
                        }
                    }}
                >
                    <View style={styles.styleContentIcon}>
                        {(tab.iconSource || tab.selectedIconSource)? <Image
                            style={[styles.image, isSelected ? selectedIconStyle : iconStyle]}
                            source={isSelected ? tab.selectedIconSource : tab.iconSource}
                        /> : null}
                        {(tab.numberCount && tab.numberCount > 0) ? <View style={styles.styleContentTextCount}>
                            <Text style={styles.styleTextCount}>{tab.numberCount}</Text>
                        </View> : null}
                    </View>
                    <Text
                        style={[isSelected ? styles.textSelected : styles.text, isSelected ? selectedTextStyle : textStyle]}
                    >
                        {tab.text}
                    </Text>
                </TouchableOpacity>
            )
        })
        return (
            <View style={[styles.container, style]} >
                {tabsView}
            </View>
        )
    }

    onPageSelected(e) {
        this.setState({ selectedIndex: e.position })
    }
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderTopColor: '#E0E0E0',
        backgroundColor: '#F7F7F7',
    },
    styleContentIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    styleContentTextCount: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: 'red',
        height: 18,
        minWidth: 14,
        padding: 3,
        borderRadius: 18,
        top: -5,
        right: -20,
        position: 'absolute',
    },

    styleTextCount: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        color: 'white',
        fontSize: 12,
    },
    itemContainer: {
        alignItems: 'center',
        flex: 1,
    },
    image: {
    },
    text: {
        marginTop: 4,
        marginBottom: 4,
        fontSize: 11,
        color: 'gray'
    },
    textSelected: {
        marginTop: 4,
        marginBottom: 4,
        fontSize: 12,
        color: 'blue',
        fontFamily: 'Lato-Bold',
    }
})