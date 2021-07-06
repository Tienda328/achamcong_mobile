import React, { PureComponent, Component } from 'react';
import { Dimensions, Image, StyleSheet, Text, View, Platform } from 'react-native';
import Modal from "react-native-modal";
import { connect } from 'react-redux';
var Spinner = require('react-native-spinkit');
const image = require('../../assets/image/logo.png')
class LoadingView extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            timer: null,
            isShowLoading: false
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isShowLoading !== prevState.isShowLoading) {
            return {
                isShowLoading: nextProps.isShowLoading,
            };
        }
        return null;
    }

    render() {
        let { isShowLoading = false } = this.state
        return (
            <View style={{ flexDirection: 'column' }}>
                <Modal
                    transparent={true}
                    animationIn={"fadeIn"}
                    animationOut={"fadeOut"}
                    isVisible={isShowLoading}
                    // animationInTiming = {10}
                    // animationOutTiming = {10}
                    style={{ margin: 0, flex: 1 }}
                    backdropOpacity={0.10}
                    backdropColor={"gray"}
                >
                    <View style={[styles.modalBackground, {}]}>
                        <View style={styles.activityIndicatorWrapper}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ position: 'relative', justifyContent: "center", alignItems: 'center' }}>
                                    <Spinner size={100} type={'Bounce'} color={'#66ccff'} />
                                    <Image
                                        style={{ width: 70, height: 70, position: 'absolute', borderRadius: 35 }}
                                        source={image}
                                    />
                                </View>
                                <Text style={[{ color: '#FFFFFF', fontSize: 20, }]}>Vui lòng chờ...</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
    },
    activityIndicatorWrapper: {
        backgroundColor: 'transparent',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});


const mapStateToProps = state => ({
    isShowLoading: state.ui.showLoading
});

export default connect(mapStateToProps)(LoadingView)
