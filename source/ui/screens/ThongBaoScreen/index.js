import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, BackHandler, RefreshControl } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import RenderItemThongBao from './component/RenderItemThongBao'
import { models } from '../../../commons/model';
import { actions } from '../../../commons/action';
class ThongBaoScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
            isReloadData: false
        }

        this.dataLogin = models.getDataLogin()

        this.dataList = []
        this.dataListChuaLoc = []

        this.renderItemThongBao = this.renderItemThongBao.bind(this)
        this.getDataFromFirebase = this.getDataFromFirebase.bind(this)
        this.updateReadThongBao = this.updateReadThongBao.bind(this)
        this.handleMenu = this.handleMenu.bind(this)
    }

    componentDidMount() {
        this.getDataFromFirebase(this)
        BackHandler.addEventListener('hardwareBackPress', this.handleMenu);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    getDataFromFirebase = (that) => {

    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    updateReadThongBao = (dataItem) => {
    }

    handleMenu = () => {
        if (this.props.handleMenu) {
            this.props.handleMenu()
        } else {
            this.props.navigation.goBack();
            return true
        }
    }

    renderItemThongBao = ({ item }) => {
        return (
            <RenderItemThongBao
                dataItem={item}
                updateReadThongBao={(dataItem) => { this.updateReadThongBao(dataItem) }}
            />
        )
    }

    render() {
        let { isReloadData } = this.state
        return (
            <BaseView stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={"Thông báo"}
                subTitle={'havantam.it@gmail.com'}
                // isBorderBottomWidth={false}
                styleToolbar={{ height: 45 }}
                styleTitle={[styles.styleTitle]}
                styleTitleToolbarBase={styles.styleTitleToolbarBase}
                drawIconLeft={
                    <TouchableOpacity style={[styles.styleViewIconLeftBase]}
                        onPress={this.handleMenu}>
                        {/* <Image
                            source={icon_menu}
                            style={{ justifyContent: 'center', alignItems: 'center', width: 30, height: 30, tintColor: 'black' }}
                        /> */}

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

                <FlatList
                    style={{ backgroundColor: '#f2f2f2' }}
                    data={this.dataListChuaLoc}
                    // ItemSeparatorComponent={this.viewSeparator}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.renderItemThongBao}
                    keyExtractor={item => item.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={isReloadData}
                            onRefresh={() => { this.getDataFromFirebase(this) }}
                        />
                    }
                />
            </BaseView>
        )
    }
}

const styles = StyleSheet.create({
    styleTitle: {
        fontSize: configs.fontSize14_5,
        fontFamily: 'Lato-Regular',
        color: 'black',
    },
    styleTitleToolbarBase: {
        color: 'black',
        fontSize: 18,
    },
    styleViewIconLeftBase: {
        padding: configs.padding,
        width: configs.heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: configs.marginLeft10,
    },
})

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
export default connect(mapStateToProps, mapDispatchToProps)(ThongBaoScreen)