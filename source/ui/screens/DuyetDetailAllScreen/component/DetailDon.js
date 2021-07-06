import React from 'react';
import {
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  Text,
  BackHandler,
} from 'react-native';
import {
  BaseComponent,
  BaseView,
  CardView,
  IconView,
  TextView,
  InputView,
  DialogSelectItemFromList,
} from '../../../components';
import {connect} from 'react-redux';
import {commonsConfigs as configs} from '../../../../commons';
import {BarChart, PieChart} from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import {ScrollView} from 'react-native-gesture-handler';
import Popover from 'react-native-popover-view';
import {models} from '../../../../commons/model';
import {actions} from '../../../../commons/action';
import {api} from '../../../../commons/api/Api';
import Wave from 'react-native-waveview';

const WIDTH_SCREEN = Dimensions.get('window').width;
class DetailNghiPhepScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isArrowShowCard: true,
      showPopover: false,
      textTitleBieuDo: 'tháng ' + (new Date().getMonth() + 1),
      reRender: false,
      isShowDialog: false,
      viewWave: null,
    };

    this.dataLogin = models.getDataLogin();
    this.dataDetail = {};
    try {
      this.dataDetail = this.props.dataDetail;
      console.log('this.dataDetail:   ' + JSON.stringify(this.dataDetail));
      //1 nghỉ phép, 2 xinddi muộn về sớm, 3 xin quen cham cong
      this.type = this.props.type;
    } catch (error) {}

    this.textLyDoTuChoi = '';
    this.dataWave = 0;
    this.waveParams = [
      {A: 20, T: 360, fill: '#22f7e5'},
      {A: 30, T: 360, fill: '#08d4c4'},
      {A: 40, T: 360, fill: '#047b71'},
    ];
  }

  componentDidMount() {
    let params = {
      id: this.dataLogin.id ? this.dataLogin.id : '',
    };
    console.log('Params' + JSON.stringify(params));
    this.props.getDetailTimeSheet(params);
  }

  componentWillUnmount() {}

  setShowPopover = (showPopover, indexPickerView) => {
    this.indexPopoverView = indexPickerView;
    this.setState({
      showPopover: showPopover,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DuyetDetailAllReducer) {
      if (
        this.props.DuyetDetailAllReducer.dataDetailTimeSheet &&
        this.props.DuyetDetailAllReducer.dataDetailTimeSheet !==
          prevProps.DuyetDetailAllReducer.dataDetailTimeSheet
      ) {
        let dataDetail = this.props.DuyetDetailAllReducer.dataDetailTimeSheet;
        if (dataDetail && dataDetail[0]) {
          this.dataWave =
            dataDetail[0].month && dataDetail[0].month.precent
              ? dataDetail[0].month.precent
              : 0;
          if (this.dataWave < 30) {
            this.waveParams = [
              {A: 20, T: 360, fill: '#22f7e5'},
              {A: 30, T: 360, fill: '#08d4c4'},
              {A: 40, T: 360, fill: '#047b71'},
            ];
          } else if (this.dataWave < 60) {
            this.waveParams = [
              {A: 20, T: 360, fill: '#b3d1ff'},
              {A: 30, T: 360, fill: '#66a3ff'},
              {A: 40, T: 360, fill: '#1a75ff'},
            ];
          } else {
            this.waveParams = [
              {A: 20, T: 360, fill: '#ffad99'},
              {A: 30, T: 360, fill: '#ff704d'},
              {A: 40, T: 360, fill: '#ff3300'},
            ];
          }
          console.log('this.waveParams:   ' + JSON.stringify(this.waveParams));
          this.setState({
            viewWave: (
              <Wave
                style={{
                  width: (WIDTH_SCREEN * 2) / 5,
                  height: (WIDTH_SCREEN * 2) / 5,
                  // aspectRatio: 1,
                  overflow: 'hidden',
                  borderRadius: (WIDTH_SCREEN * 2) / 10,
                  backgroundColor: configs.colorBorder,
                }}
                H={(((WIDTH_SCREEN * 2) / 5) * this.dataWave) / 100}
                waveParams={this.waveParams}
                animated={true}
              />
            ),
          });
          this.reRender();
        }
      }
    }
  }

  reRender = () => {
    this.setState((prevState) => ({
      reRender: (prevState.reRender = !this.state.reRender),
    }));
  };

  render() {
    let {isArrowShowCard, showPopover, textTitleBieuDo} = this.state;
    return (
      <ScrollView style={{height: '100%', flex: 1}}>
        <LinearGradient
          locations={[0, 0.5, 0.8]}
          colors={['#ccffff', '#99ffff', '#4dffff']}
          style={{
            margin: 12,
            borderRadius: 8,
            elevation: 3,
            marginHorizontal: 6,
            padding: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {this.state.viewWave}

            <Text style={[styles.styleTitle, {fontSize: 12, marginLeft: 8}]}>
              {this.dataWave + '% - phần trăm mức độ nghỉ'}
            </Text>
          </View>

          <Text
            style={[
              styles.styleTitle,
              {
                paddingHorizontal: 12,
                textAlign: 'center',
                marginVertical: 12,
                color: '#cc7a00',
                fontWeight: 'bold',
              },
            ]}>
            {'Biểu đồ thống kê mức độ nghỉ của ' +
              this.dataDetail?.user_request?.name +
              ' trong tất cả các tháng'}
          </Text>
        </LinearGradient>

        <CardView
          styleContainer={{elevation: 0}}
          styleCard={{marginBottom: 20, marginTop: 12}}
          styleTitleCard={{
            fontWeight: 'bold',
            fontSize: 16,
          }}
          styleHeader={{}}
          titleCard={'Chi tiết đơn'}
          nameIcon={isArrowShowCard ? 'arrow-down' : 'arrow-up'}
          stylesBgIcon={{}}
          sizeIcon={configs.sizeIcon24}
          onPressIcon={() => {
            this.setState({isArrowShowCard: !isArrowShowCard});
          }}
          viewRightElement={
            <Image
              source={{uri: this.dataDetail.avatar}}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                marginHorizontal: 12,
              }}
            />
          }>
          {isArrowShowCard ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1}}>
                <TextView
                  style={[styles.viewRow]}
                  stylesTextContent={styles.viewContentRow}
                  styleValue={[
                    styles.styleValueTextView,
                    {
                      color:
                        this.dataDetail.state_request === 0
                          ? configs.colorDiMuon
                          : this.dataDetail.state_request === 1
                          ? configs.colorDongY
                          : 'red',
                    },
                  ]}
                  styleTitle={styles.styleTitleTextView}
                  title={'Tình trạng: '}
                  value={
                    this.dataDetail.state_request === 0
                      ? 'Chưa duyệt'
                      : this.dataDetail.state_request === 1
                      ? 'Đồng ý'
                      : 'Từ chối'
                  }
                  iconLeft={
                    this.dataDetail.state_request === 0
                      ? 'circle-sync'
                      : this.dataDetail.state_request === 1
                      ? 'verified'
                      : 'warning'
                  }
                  iconColor={
                    this.dataDetail.state_request === 0
                      ? configs.colorDiMuon
                      : this.dataDetail.state_request === 1
                      ? configs.colorDongY
                      : 'red'
                  }
                  iconSize={configs.sizeIcon14}
                />

                <TextView
                  style={styles.viewRow}
                  stylesTextContent={styles.viewContentRow}
                  styleValue={styles.styleValueTextView}
                  styleTitle={styles.styleTitleTextView}
                  title={'Người tạo đơn'}
                  value={
                    this.dataDetail?.user_request?.name
                      ? this.dataDetail?.user_request?.name
                      : ''
                  }
                  iconLeft="customer-check"
                  iconColor={configs.colorText}
                  iconSize={configs.sizeIcon14}
                />

                {this.type === 1 ? (
                  <TextView
                    style={styles.viewRow}
                    stylesTextContent={styles.viewContentRow}
                    styleValue={styles.styleValueTextView}
                    styleTitle={styles.styleTitleTextView}
                    title={'Ngày bắt đầu xin: '}
                    value={
                      this.dataDetail.time_start_timestamp
                        ? configs.quyDoiTimeStampToDate(
                            this.dataDetail.time_start_timestamp,
                          )
                        : ''
                    }
                    iconLeft="calendar-time"
                    iconColor={configs.colorText}
                    iconSize={configs.sizeIcon14}
                  />
                ) : (
                  <TextView
                    style={styles.viewRow}
                    stylesTextContent={styles.viewContentRow}
                    styleValue={styles.styleValueTextView}
                    styleTitle={styles.styleTitleTextView}
                    title={'Ngày xin: '}
                    value={
                      this.dataDetail.time_timestamp
                        ? configs.quyDoiTimeStampToDate(
                            this.dataDetail.time_timestamp,
                          )
                        : ''
                    }
                    iconLeft="calendar-time"
                    iconColor={configs.colorText}
                    iconSize={configs.sizeIcon14}
                  />
                )}

                {this.type === 1 ? (
                  <TextView
                    style={[styles.viewRow]}
                    stylesTextContent={styles.viewContentRow}
                    styleValue={styles.styleValueTextView}
                    styleTitle={styles.styleTitleTextView}
                    title={'Đến ngày'}
                    value={
                      this.dataDetail.time_end_timestamp
                        ? configs.quyDoiTimeStampToDate(
                            this.dataDetail.time_end_timestamp,
                          )
                        : ''
                    }
                    iconLeft="calendar-time"
                    iconColor={configs.colorText}
                    iconSize={configs.sizeIcon14}
                  />
                ) : (
                  <TextView
                    style={styles.viewRow}
                    stylesTextContent={styles.viewContentRow}
                    styleValue={styles.styleValueTextView}
                    styleTitle={styles.styleTitleTextView}
                    title={'Giờ xin: '}
                    value={this.dataDetail.time ? this.dataDetail.time : ''}
                    iconLeft="calendar-time"
                    iconColor={configs.colorText}
                    iconSize={configs.sizeIcon14}
                  />
                )}

                <TextView
                  style={[styles.viewRow]}
                  stylesTextContent={styles.viewContentRow}
                  styleValue={styles.styleValueTextView}
                  styleTitle={styles.styleTitleTextView}
                  title={'Loại xin'}
                  value={this.dataDetail?.title ? this.dataDetail.title : ''}
                  iconLeft="parcel-edit"
                  iconColor={configs.colorText}
                  iconSize={configs.sizeIcon14}
                />

                <TextView
                  style={[styles.viewRow]}
                  stylesTextContent={styles.viewContentRow}
                  styleValue={styles.styleValueTextView}
                  styleTitle={styles.styleTitleTextView}
                  title={'Nội dung: '}
                  value={
                    this.dataDetail?.content ? this.dataDetail.content : ''
                  }
                  iconLeft="parcel-edit"
                  iconColor={configs.colorText}
                  iconSize={configs.sizeIcon14}
                />

                <TextView
                  style={[styles.viewRow]}
                  stylesTextContent={styles.viewContentRow}
                  styleValue={styles.styleValueTextView}
                  styleTitle={styles.styleTitleTextView}
                  title={'Lý do duyệt: '}
                  value={this.dataDetail?.note ? this.dataDetail.note : ''}
                  iconLeft="parcel-edit"
                  iconColor={configs.colorText}
                  iconSize={configs.sizeIcon14}
                />

                <TextView
                  style={[styles.viewRow]}
                  stylesTextContent={styles.viewContentRow}
                  styleValue={styles.styleValueTextView}
                  styleTitle={styles.styleTitleTextView}
                  title={'Người duyệt: '}
                  value={
                    this.dataDetail?.user_accept &&
                    this.dataDetail?.user_accept?.name
                      ? this.dataDetail?.user_accept?.name
                      : ''
                  }
                  iconLeft="user-login"
                  iconColor={configs.colorText}
                  iconSize={configs.sizeIcon14}
                />

                <TextView
                  style={[styles.viewRow]}
                  stylesTextContent={styles.viewContentRow}
                  styleValue={styles.styleValueTextView}
                  styleTitle={styles.styleTitleTextView}
                  title={'Ngày duyệt: '}
                  value={
                    this.dataDetail?.created
                      ? configs.quyDoiTimeStampToDate(this.dataDetail.created)
                      : ''
                  }
                  iconLeft="parcel-id"
                  iconColor={configs.colorText}
                  iconSize={configs.sizeIcon14}
                />
              </View>
            </View>
          ) : (
            <View />
          )}
        </CardView>

        {/* {this.dataDetail.state === 0 && <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 12 }}>
                    <TextView
                        onPress={() => this.setShowPopover(true, 1)}
                        style={[styles.styleButton, { flex: 3, marginLeft: 0 }]}
                        styleValue={[styles.styleTextButton, {}]}
                        value={"Duyệt"}
                        iconLeft={'verified'}
                        iconColor={'white'}
                        iconSize={14}
                    />
                    <TextView
                        onPress={() => this.setShowPopover(true, 2)}
                        style={[styles.styleButton, { flex: 2, backgroundColor: configs.colorDiMuon, borderColor: configs.colorTextOrange, }]}
                        styleValue={[styles.styleTextButton, {}]}
                        value={"Từ chối"}
                        iconLeft={'parcel-refuse'}
                        iconColor={'white'}
                        iconSize={14}
                    />
                </View>} */}
      </ScrollView>
    );
  }
}
export const scrollX = new Animated.Value(0);

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
  viewRow: {
    backgroundColor: 'white',
    paddingHorizontal: configs.padding15,
    borderBottomColor: configs.colorBorder,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  viewContentRow: {
    flexDirection: 'row',
    flex: 1,
    height: '100%',
    alignItems: 'center',
    marginLeft: 5,
  },
  styleTextInputElement: {
    flexDirection: 'row',
    height: configs.heightInput40,
    borderColor: configs.colorTitleCard,
    // borderColor: configs.colorBorder,
    borderWidth: 0.5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleTitleTextView: {
    fontStyle: 'normal',
    fontSize: 12,
    color: configs.colorText,
    minWidth: 40,
    fontFamily: 'Lato-Regular',
  },
  styleValueTextView: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: '#323B45',
    flex: 1,
    textAlign: 'right',
  },
  styleTextButton: {
    color: 'white',
    fontSize: configs.fontSize14_5,
    fontFamily: 'Lato-Regular',
  },
  styleButton: {
    backgroundColor: configs.colorMain,
    height: configs.heightInput40,
    borderColor: configs.colorMainDaiMau2,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 12,
    marginLeft: configs.margin15,
  },
  styleButtonSuaToken: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: configs.colorMain,
    borderRadius: 6,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => ({
  DuyetDetailAllReducer: state.DuyetDetailAllReducer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    showLoadding: () => {
      dispatch(actions.showLoading());
    },
    hideLoadding: () => {
      dispatch(actions.hideLoading());
    },
    getDetailTimeSheet: (params) => {
      api.getDetailTimeSheet(dispatch, params);
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailNghiPhepScreen);
