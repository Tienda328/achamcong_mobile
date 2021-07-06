import React from 'react';
import { StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { BaseComponent, BaseView, IconView, TabView } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons';
import TabBar from 'react-native-underline-tabbar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import XinNghiPhepScreen from './component/XinNghiPhepScreen';
import XinDiMuonVeSomScreen from './component/XinDiMuonVeSomScreen';
import QuenChamCongScreen from './component/QuenChamCongScreen';
import XinDiCongTac from './component/XinDiCongTac';
import ShiftChangeTab from './component/ShiftChangeTab';
import DonTangCa from './component/DonTangCa';
import DangKyCaLamViec from './component/DangKyCaLamViec';

class XinPhepScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkNgayNghiDate: 0,
      isShowPickerDate: false,
      isShowDialog: false,
      reRender: false,
    };
    this.toDate = '';
    this.dateNgayNghi = '';
    this.fromDate = '';
    this.indexPickerDate = 0;

    this.dataSeleLoaiNghi = {};
    this.indexPage = 0;

    this.currentPage = this.currentPage.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
  }

  currentPage = (currentpage) => {
    // this.props.setIndexTabParcel(currentpage.i)
    this.indexPage = currentpage.i;
  };

  handleMenu = () => {
    if (this.props.handleMenu) {
      this.props.handleMenu()
    } else {
      this.props.navigation.goBack();
      return true
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
        stylesView={{ flex: 1, backgroundColor: 'white' }}
        titleScreen={'Xin phép'}
        subTitle={'havantam.it@gmail.com'}
        isBorderBottomWidth={false}
        styleToolbar={{ height: 45 }}
        styleTitle={[styles.styleTitle]}
        styleTitleToolbarBase={styles.styleTitleToolbarBase}
        drawIconLeft={
          <TouchableOpacity
            style={[styles.styleViewIconLeftBase]}
            onPress={this.handleMenu}>
            {/* <Image
                            source={icon_menu}
                            style={{ justifyContent: 'center', alignItems: 'center', width: 30, height: 30, tintColor: 'black' }}
                        /> */}

            <IconView
              style={{ justifyContent: 'center', alignItems: 'center' }}
              color="black"
              name={'left-arrow'}
              size={configs.sizeIcon20}
              height={configs.sizeIcon20}
            />
          </TouchableOpacity>
        }>
        <ScrollableTabView
          // ref={(ref) => { this.scrollableTabView = ref; }}
          keyboardShouldPersistTaps="handled"
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
          <XinNghiPhepScreen tabLabel={{ tabName: 'Xin nghỉ phép' }} />
          <XinDiMuonVeSomScreen tabLabel={{ tabName: 'Xin đi muộn, về sớm' }} />
          <ShiftChangeTab tabLabel={{ tabName: 'Xin chuyển đổi ca' }} />
          <DonTangCa tabLabel={{ tabName: 'Đơn tăng ca' }} />
          <DangKyCaLamViec tabLabel={{ tabName: 'Đăng ký ca làm việc' }} />
          <QuenChamCongScreen tabLabel={{ tabName: 'Xin quên chấm công' }} />
          <XinDiCongTac tabLabel={{ tabName: 'Xin đi gặp khách hàng' }} />
        </ScrollableTabView>
      </BaseView>
    );
  }
}

export const scrollX = new Animated.Value(0);
export const interpolators = Array.from({ length: 7 }, (_, i) => i).map(
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
  styleInput: {
    marginTop: configs.margin10,
  },
  styleTextInputElement: {
    flexDirection: 'row',
    height: configs.heightInput40,
    borderColor: configs.colorTitleCard,
    // borderColor: configs.colorBorder,
    borderWidth: 0.5,
    borderRadius: 8,
  },
  tabBarStyle: {
    backgroundColor: configs.colorMain,
    borderTopColor: configs.colorDivide,
    width: '100%',
    borderTopWidth: 0,
    paddingLeft: 5,
    marginTop: 0,
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    getListBlock: () => {
      api.getListBlock(dispatch);
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(XinPhepScreen);
