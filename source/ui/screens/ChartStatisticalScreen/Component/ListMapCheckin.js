import React, { Component } from 'react';
import { View, BackHandler, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import {  BaseView, IconView } from '../../../components';
import { connect } from 'react-redux';
import { api } from '../../../../commons/api/Api';
import { actions } from '../../../../commons/action';
import { commonsConfigs as configs } from '../../../../commons';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import ListCheckin from './ListCheckin';
import ListMap from './ListMap';

class ListMapCheckin extends Component {
    constructor(props) {
        super(props)
        this.data = this.props.navigation.state.params.dataItem
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }
    backPressed = () => {
        this.props.navigation.goBack();
        return true;
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }
    
    render() {
        return (
            <BaseView stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={'Địa điểm Check in'}
                subTitle={'havantam.it@gmail.com'}
                isBorderBottomWidth={false}
                styleToolbar={{ height: 45 }}
                styleTitle={[styles.styleTitle, { flex: 1 }]}
                styleTitleToolbarBase={styles.styleTitleToolbarBase}
                drawIconLeft={
                    <TouchableOpacity style={[styles.styleViewIconLeftBase]}
                        onPress={this.backPressed}>
                        <IconView
                            style={{ justifyContent: 'center', alignItems: 'center', }}
                            color='black'
                            name={"left-arrow"}
                            size={configs.sizeIcon20}
                            height={configs.sizeIcon20}
                        />
                    </TouchableOpacity>
                }
            >
                <ScrollableTabView style={{flex : 1}}>
                    <ListCheckin tabLabel="Danh sách" dataItem = {this.data}/>
                    <ListMap tabLabel="Map" />
                </ScrollableTabView>
            </BaseView>
        )
    }
}
const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
    };
}
const styles = StyleSheet.create({
    
});
export default connect(mapStateToProps, mapDispatchToProps)(ListMapCheckin)