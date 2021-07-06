import React, {Component} from 'react';
import { Image } from 'react-native';
import { StyleSheet } from 'react-native';


const layout = ({source, defaultSource}) => {
    return <Image style={styles.fullScreen} 
    source={source}
    defaultSource= {defaultSource}
    />;
};

export default layout;

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    }
});