import React from 'react';
import {
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from 'react-native';
import {
  BaseComponent,
  BaseView,
  CardView,
  IconView,
  InputView,
  RadioForm,
  TabView,
} from '../../components';
import {connect} from 'react-redux';
import {commonsConfigs as configs} from '../../../commons';
import TabBar from 'react-native-underline-tabbar';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ScrollableTabView, {
  ScrollableTabBar,
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import HistoryXinNghiScreen from './component/HistoryXinNghiScreen';
import {actions} from '../../../commons/action';
import {models} from '../../../commons/model';
import DialogFilter from './component/DialogFilter';
import {api} from '../../../commons/api/Api';
import DialogFilterDate from '../../components/DialogFilterDate';
import {StackActions, NavigationActions} from 'react-navigation';

class HistoryXinPhepScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowDialog: false,
      isShowDialogDate: false,
      reRender: false,
    };

    this.indexPage = 0;
    this.dataChuaDuyet = [];
    this.dataDaDuyet = [];
    this.dataTuChoi = [];
    this.dataNumberOrder = {};

    this.dataLogin = models.getDataLogin();
    this.dataSelect = {index: 0, label: 'Lịch sử nghỉ phép', value: '1'};

    this.currentPage = this.currentPage.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.applyFilterXinNghi = this.applyFilterXinNghi.bind(this);
    this.showFilterXinNghi = this.showFilterXinNghi.bind(this);
    this.applyFilterXinNghiDate = this.applyFilterXinNghiDate.bind(this);
  }

  componentDidMount() {
    let params = configs.getDataEndStartOfMounth();
    params.type = 3;
    params.indexLoaiNghi = this.dataSelect.value;
    this.fromDate = params.date_start;
    this.toDate = params.date_end;
    this.props.getDataNumberOrder(params);
  }

  currentPage = (currentpage) => {
    // this.props.setIndexTabParcel(currentpage.i)
    this.indexPage = currentpage.i;
  };

  handleMenu = () => {
    this.indexPage = 0;
    if (Platform.OS === 'android') {
      setTimeout(() => {
        this.scrollableTabView.goToPage(0);
        this.props.handleMenu();
      }, 300);
    } else {
      this.props.handleMenu();
    }
  };

  showFilterXinNghi = (id, showSearch) => {
    if (id == 1) {
      this.setState((prevState) => ({
        isShowDialog: (prevState.isShowDialog = showSearch),
      }));
    } else {
      this.setState((prevState) => ({
        isShowDialogDate: (prevState.isShowDialogDate = showSearch),
      }));
    }
  };

  applyFilterXinNghi = (dataSelect) => {
    this.dataSelect = dataSelect;
    //     { index: 0, label: "Lịch sử nghỉ phép", value: "1" },
    // { index: 1, label: "Lịch sử đi muộn, về sớm", value: "2" },
    // { index: 2, label: "Lịch sử quên chấm công", value: "3" }

    // let params = configs.getDataEndStartOfMounth()
    let params = {
      date_start: this.fromDate,
      date_end: this.toDate,
    };
    params.type = 3;
    params.isResetDate = true;
    params.indexLoaiNghi = dataSelect.value;
    this.props.getDataNumberOrder(params);

    try {
      this.refChuaDuyet.onData(params);
    } catch (error) {}

    try {
      this.refDaDuyet.onData(params);
    } catch (error) {}

    try {
      this.refTuChoi.onData(params);
    } catch (error) {}
  };

  applyFilterXinNghiDate = (toDate, fromDate) => {
    this.fromDate = configs.convertTimeDate(fromDate, configs.FORMAT_DATE);
    this.toDate = configs.convertTimeDate(toDate, configs.FORMAT_DATE);
    let params = {
      date_start: this.fromDate,
      date_end: this.toDate,
    };

    // params.type = 3
    params.isResetDate = true;
    params.indexLoaiNghi = this.dataSelect.value;
    this.props.getDataNumberOrder(params);
    try {
      params.type = 0;
      this.refChuaDuyet.onData(params);
    } catch (error) {}

    try {
      params.type = 1;
      this.refDaDuyet.onData(params);
    } catch (error) {}

    try {
      params.type = 2;
      this.refTuChoi.onData(params);
    } catch (error) {}
    // this.getDataHistory(params)
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.HistoryXinPhepReducer) {
      if (
        this.props.HistoryXinPhepReducer.dataNumberOrder !==
        prevProps.HistoryXinPhepReducer.dataNumberOrder
      ) {
        // console.log(
        //   'this.props.HistoryXinPhepReducer.dataNumberOrder:     ',
        //   this.props.HistoryXinPhepReducer.dataNumberOrder,
        // );
        this.dataNumberOrder = this.props.HistoryXinPhepReducer.dataNumberOrder?.data;
        this.reRender();
      }
    }
  }

  reRender = () => {
    this.setState((prevState) => ({
      reRender: (prevState.reRender = !this.state.reRender),
    }));
  };

  render() {
    return (
      <BaseView
        stylesView={{flex: 1, backgroundColor: 'white'}}
        titleScreen={this.dataSelect.label}
        isShowSubTitle={true}
        subTitle={this.fromDate + ' -> ' + this.toDate}
        isBorderBottomWidth={false}
        styleToolbar={{height: 45}}
        styleTitle={[styles.styleTitle, {flex: 1}]}
        styleTitleToolbarBase={styles.styleTitleToolbarBase}
        drawIconLeft={
          <TouchableOpacity
            style={[styles.styleViewIconLeftBase]}
            onPress={() => {
              this.props.navigation.dispatch(
                StackActions.reset({
                  index: 0,
                  key: null,
                  actions: [
                    NavigationActions.navigate({routeName: 'TrangChuScreen'}),
                  ],
                }),
              );
            }}>
            <IconView
              style={{justifyContent: 'center', alignItems: 'center'}}
              color="black"
              name={'left-arrow'}
              size={configs.sizeIcon20}
              height={configs.sizeIcon20}
            />
          </TouchableOpacity>
        }
        drawIconRight={
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={[styles.styleViewIconLeftBase]}
              onPress={() => {
                this.showFilterXinNghi(2, true);
              }}>
              <IconView
                style={{justifyContent: 'center', alignItems: 'center'}}
                color="black"
                name={'calendar-time'}
                size={configs.sizeIcon20}
                height={configs.sizeIcon20}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.styleViewIconLeftBase]}
              onPress={() => {
                this.showFilterXinNghi(1, true);
              }}>
              <IconView
                style={{justifyContent: 'center', alignItems: 'center'}}
                color="black"
                name={'filter'}
                size={configs.sizeIcon20}
                height={configs.sizeIcon20}
              />
            </TouchableOpacity>
          </View>
        }
        isShowIconRight={true}
        // nameIconRight={'filter'}
        // colorIconRight={'black'}
        // fontSizeIconRight={configs.fontSize24}
        // // onClickIconRight={() => { this.showFilterXinNghi(1, true) }}
        // onClickIconRight={() => { this.showFilterXinNghi(2, true) }}
      >
        <ScrollableTabView
          keyboardShouldPersistTaps="handled"
          ref={(ref) => {
            this.scrollableTabView = ref;
          }}
          // locked={isIphoneX()}
          renderTabBar={() => (
            <TabBar
              underlineColor={'transparent'}
              tabBarStyle={styles.tabBarStyle}
              prerenderingSiblingsNumber={Infinity}
              renderTab={(
                tab,
                page,
                isTabActive,
                onPressHandler,
                onTabLayout,
              ) => (
                <TabView
                  key={page}
                  stylesSub={interpolators[page]}
                  tab={tab}
                  page={page}
                  isTabActive={isTabActive}
                  onPressHandler={onPressHandler}
                  onTabLayout={onTabLayout}
                />
              )}
            />
          )}
          onScroll={(x) => scrollX.setValue(x)}
          // page={0}
          initialPage={this.indexPage}
          onChangeTab={this.currentPage}>
          <HistoryXinNghiScreen
            tabLabel={{
              tabName: 'Đơn chưa duyệt',
              totalItem: this.dataNumberOrder.waiting,
            }}
            // dataItem={this.dataChuaDuyet}
            onRef={(ref) => {
              this.refChuaDuyet = ref;
            }}
            type={0}
            indexLoaiNghi={this.dataSelect.value}
          />
          <HistoryXinNghiScreen
            tabLabel={{
              tabName: 'Đơn được chấp nhận',
              totalItem: this.dataNumberOrder.accept,
            }}
            // dataItem={this.dataDaDuyet}
            onRef={(ref) => {
              this.refDaDuyet = ref;
            }}
            type={1}
            indexLoaiNghi={this.dataSelect.value}
          />
          <HistoryXinNghiScreen
            tabLabel={{
              tabName: 'Đơn bị từ chối',
              totalItem: this.dataNumberOrder.reject,
            }}
            // dataItem={this.dataTuChoi}
            onRef={(ref) => {
              this.refTuChoi = ref;
            }}
            type={2}
            indexLoaiNghi={this.dataSelect.value}
          />
        </ScrollableTabView>

        <DialogFilter
          dataSelect={this.dataSelect}
          isShowDialog={this.state.isShowDialog}
          closedDialog={this.showFilterXinNghi}
          applyResponses={this.applyFilterXinNghi}
        />
        <DialogFilterDate
          isShowDialog={this.state.isShowDialogDate}
          closedDialog={this.showFilterXinNghi}
          isSSDate={true}
          applyResponses={this.applyFilterXinNghiDate}
        />
      </BaseView>
    );
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
    padding: 10,
    // width: configs.heightToolBar,
    justifyContent: 'center',
    alignItems: 'flex-start',
    // left: configs.marginLeft10,
  },
  tabBarStyle: {
    backgroundColor: '#ffffff',
    borderTopColor: configs.colorDivide,
    width: '100%',
    borderTopWidth: 0,
    paddingLeft: 5,
    marginTop: 0,
  },
});

export const scrollX = new Animated.Value(0);
export const interpolators = Array.from({length: 3}, (_, i) => i).map(
  (idx) => ({
    scale: scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp',
    }),
    opacity: scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    }),
    textColor: scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['black', 'white', 'black'],
    }),
    fontSize: scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [
        configs.fontSizeTextNormalItemTab,
        configs.fontSizeTextSelectedItemTab,
        configs.fontSizeTextNormalItemTab,
      ],
    }),
    backgroundColor: scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['transparent', configs.colorMain, 'transparent'],
      extrapolate: 'clamp',
    }),
  }),
);

const mapStateToProps = (state) => ({
  HistoryXinPhepReducer: state.HistoryXinPhepReducer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    showLoadding: () => {
      dispatch(actions.showLoading());
    },
    hideLoadding: () => {
      dispatch(actions.hideLoading());
    },
    getDataNumberOrder: (params) => {
      api.getDataNumberOrder(dispatch, params);
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryXinPhepScreen);
