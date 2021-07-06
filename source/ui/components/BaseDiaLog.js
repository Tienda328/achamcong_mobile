/**
 * Example usage of react-native-modal
 * @format
 */

import React, { Component } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback,
    Dimensions
} from "react-native";
import Modal from "react-native-modal";
import { IconView, TextView } from '../components'
import { commonsConfigs as configs } from '../../commons'
import Popover from 'react-native-popover-view';

export default class BaseDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: this.props.visibleModal,
        };
    }
    componentWillUnmount() {
        this.setState({ visibleModal: null })
    }
    // renderModalContent = () => (
    //     <View style={{
    //         backgroundColor: "white",
    //         borderRadius: 8,
    //         borderColor: "rgba(0, 0, 0, 0.1)"
    //     }}>
    //         {/* {this.props.viewTitle} */}
    //         <View style={styles.stylesHeader}>
    //             <Text style={[styles.stylesTitleDialog, this.props.stylesTitleDialog]}>
    //                 {this.props.titleDialog}
    //             </Text>
    //             {this.props.isIconClosed && <IconView
    //                 style={{
    //                     height: configs.heightHeader,
    //                     width: configs.heightHeader,
    //                     borderTopRightRadius: configs.borderRadius4,
    //                     position: 'absolute',
    //                     right: 0,
    //                     height: '100%',
    //                 }}
    //                 onPress={() => this.props.closedDialog()}
    //                 name={'cancel'}
    //                 size={configs.sizeIcon20}
    //                 color={configs.colorMain}
    //             />}
    //         </View>
    //         {this.props.children}
    //     </View>
    // );

    handleOnScroll = event => {
        this.setState({
            scrollOffset: event.nativeEvent.contentOffset.y
        });
    };

    handleScrollTo = p => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo(p);
        }
    };

    render() {
        let typeDiglog = this.props.typeDialog
        let { visibleModal, changeVisiable, styleTextTitle } = this.props
        return (
            <View style={styles.container}>
                {/* {typeDiglog == 'onBackdrop' ?
                    <Modal
                        isVisible={visibleModal}
                        onBackdropPress={changeVisiable}
                        animationType={'slide'}
                    >
                        {this.renderModalContent()}
                    </Modal>
                    :
                    <Modal
                        isVisible={visibleModal}
                        animationType={'slide'}
                    >
                        {this.renderModalContent()}
                    </Modal>
                } */}

                <Popover
                    popoverStyle={{ backgroundColor: 'transparent' }}
                    isVisible={visibleModal}
                    onRequestClose={() => this.props.closedDialog()}>
                    <View style={{ width: Dimensions.get('window').width - 80, backgroundColor: 'white', borderRadius: 15 }}>
                        <View style={{
                            height: 45,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            backgroundColor: configs.bgNen,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                            padding: 12
                        }}>
                            <Text style={[styles.styleText, { fontSize: 18, marginLeft: 12, fontWeight: 'bold' }, styleTextTitle]}>{this.props.titleDialog}</Text>
                        </View>

                        {this.props.children}
                    </View>
                </Popover>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
    },
    styleText: {
        fontSize: configs.fontSize14_5,
        fontFamily: 'Lato-Regular',
        color: 'black',

    },

    stylesHeader: {
        marginBottom: configs.marginBottom10,
        backgroundColor: 'white',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: configs.borderRadius4,
    },

    stylesTitleDialog: {
        padding: configs.padding10,
        color: configs.colorMain,
        fontWeight: 'bold',
        fontSize: configs.fontSize15,
    },
});
