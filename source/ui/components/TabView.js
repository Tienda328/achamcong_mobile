import React, { Component } from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import { commonsConfigs as configs } from '../../commons'
// 6 is a quantity of tabs

const TabView = ({ style, stylesSub, tab, page, isTabActive, onPressHandler, onTabLayout }) => {
  const { tabName, totalItem } = tab;
  const styleTab = [{
    marginHorizontal: 0,
    paddingVertical: 5,
  }, style];
  const containerStyle = {
    paddingHorizontal: 10,
    paddingVertical: configs.padding,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: stylesSub.backgroundColor,
    opacity: stylesSub.opacity,
    transform: [{ scale: stylesSub.opacity }],
  };
  const textStyle = {
    color: stylesSub.textColor,
    fontSize: stylesSub.fontSize,
    fontWeight: '600',
  };
  const iconStyle = {
    tintColor: stylesSub.textColor,
    resizeMode: 'contain',
    width: 22,
    height: 22,
    marginLeft: configs.marginLeft,
  };
  let namePage = tabName + (totalItem ? " (" + totalItem + ")" : "")
  return (
    <TouchableOpacity style={styleTab} onPress={onPressHandler} onLayout={onTabLayout} key={page}>
      <Animated.View style={containerStyle}>
        <Animated.Text style={textStyle}>{namePage}</Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default TabView