import React, {PureComponent} from 'react';
import {StyleSheet, Alert, View, Text, RefreshControl} from 'react-native';
import {BaseComponent, IconView} from '../../../components';
import {connect} from 'react-redux';
import {commonsConfigs as configs} from '../../../../commons';
import {FlatList} from 'react-native-gesture-handler';
import RenderItemDuyetChangeShift from './RenderItemDuyetChangeShift';
import {models} from '../../../../commons/model';
import {actions} from '../../../../commons/action';
import {api} from '../../../../commons/api/Api';

class DuyetChangeShift extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      reRender: false,
      isReloadData: false,
      dataAll: [],
    };

    this.dataLogin = models.getDataLogin();
    this.pageIndex = 1;

    this.renderItemLSNghi = this.renderItemLSNghi.bind(this);
    this.deleteDuyetChangeShift = this.deleteDuyetChangeShift.bind(this);
    this.duyetChangeShift = this.duyetChangeShift.bind(this);
    this.navigateDetailDuyet = this.navigateDetailDuyet.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData = (page = this.pageIndex) => {
    let date = {};
    let params = {
      ...{
        type: '0',
        page: page,
        id_member: '',
      },
      ...date,
    };
    params.date_start = '';
    params.date_end = '';
    this.props.getDataListDuyetChangeShift(params);
  };

  reRender = () => {
    this.setState((prevState) => ({
      reRender: (prevState.reRender = !this.state.reRender),
    }));
  };

  deleteDuyetChangeShift = (dataItem) => {
    let params = dataItem;
    params.state = 1;
    params.idPage = 0;
    console.log('param xoa change shift', params);
    this.props.deleteDuyetChangeShift(params);
  };

  duyetChangeShift = (dataItem, isDuyet) => {
    dataItem.state_request = isDuyet ? 1 : 2;
    let timeStart = dataItem.date + ' ' + dataItem.time_start;
    let timeEnd = dataItem.date + ' ' + dataItem.time_end;
    dataItem.time_start = timeStart;
    dataItem.time_end = timeEnd;
    console.log('param duyet change shift', dataItem);
    this.props.responDuyetChangeShift(dataItem);
  };

  navigateDetailDuyet = (item) => {
    this.props.navigation.navigate('DuyetDetailAllScreen', {
      params: item,
      type: 2,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.DuyetChangeShiftReducer) {
      if (
        this.props.DuyetChangeShiftReducer.dataList !==
        prevProps.DuyetChangeShiftReducer.dataList
      ) {
        this.setState({
          dataAll: this.props.DuyetChangeShiftReducer.dataList?.data,
        });
      }
      if (
        this.props.DuyetChangeShiftReducer.messageDeleteChuaDuyet &&
        this.props.DuyetChangeShiftReducer.messageDeleteChuaDuyet !==
          prevProps.DuyetChangeShiftReducer.messageDeleteChuaDuyet
      ) {
        setTimeout(() => {
          Alert.alert(
            configs.NAME_APP,
            this.props.DuyetChangeShiftReducer.messageDeleteChuaDuyet.message,
            [
              {
                text: 'Đồng ý',
                onPress: () => {
                  this.props.requestDeleteDuyetChangeShiftChuaDuyet(null);
                  this.getData(1);
                },
              },
            ],
          );
        }, 700);
      }
      if (
        this.props.DuyetChangeShiftReducer.messageReponChangeShift &&
        this.props.DuyetChangeShiftReducer.messageReponChangeShift !==
          prevProps.DuyetChangeShiftReducer.messageReponChangeShift
      ) {
        console.log(
          'this.props.DuyetChangeShiftReducer.messageReponChangeShift:    ',
          this.props.DuyetChangeShiftReducer.messageReponChangeShift,
        );
        setTimeout(() => {
          Alert.alert(
            configs.NAME_APP,
            this.props.DuyetChangeShiftReducer.messageReponChangeShift.message,
            [
              {
                text: 'Đồng ý',
                onPress: () => {
                  this.props.reponDuyetChangeShift(null);
                  this.getData(1);
                },
              },
            ],
          );
        }, 700);
      }
    }
  }

  renderItemLSNghi = ({item}) => {
    return (
      <RenderItemDuyetChangeShift
        dataItem={item}
        deleteDuyetChangeShift={this.deleteDuyetChangeShift}
        duyetChangeShift={this.duyetChangeShift}
        onClickItem={this.navigateDetailDuyet}
      />
    );
  };

  render() {
    console.log('data DuyetChangeShift', this.state.dataAll);
    let {isReloadData, dataAll} = this.state;
    return (
      <View style={{backgroundColor: configs.bgNen, flex: 1}}>
        <FlatList
          style={{backgroundColor: configs.bgNen}}
          data={dataAll?.data}
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderItemLSNghi}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isReloadData}
              onRefresh={() => {
                this.getData(1);
              }}
            />
          }
        />

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#f2f2f2',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            borderWidth: 1,
            borderColor: 'gray',
          }}>
          <IconView
            name={'left-arrow'}
            size={20}
            color={this.pageIndex !== 1 ? 'black' : 'gray'}
            style={{paddingHorizontal: 12}}
            onPress={() => {
              if (this.pageIndex !== 1) {
                this.nextPageList(false);
              }
            }}
          />
          <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
            {(this.pageIndex || '1') +
              '/' +
              (this.state.dataAll?.last_page || '0')}{' '}
          </Text>
          <IconView
            name={'right-arrow'}
            size={20}
            color={
              this.pageIndex !== this.state.dataAll?.last_page
                ? 'black'
                : 'gray'
            }
            style={{paddingHorizontal: 12}}
            onPress={() => {
              if (this.pageIndex !== this.state.dataAll?.last_page) {
                this.nextPageList(true);
              }
            }}
          />

          <View style={{position: 'absolute', right: 12}}>
            <Text style={[styles.styleTitle, {fontSize: 10}]}>
              {(this.state.dataAll?.to || '0') +
                '/' +
                (this.state.dataAll?.total || '0')}
            </Text>
          </View>
        </View>
      </View>
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
    padding: configs.padding,
    width: configs.heightToolBar,
    justifyContent: 'center',
    alignItems: 'flex-start',
    left: configs.marginLeft10,
  },
});

const mapStateToProps = (state) => ({
  DuyetChangeShiftReducer: state.DuyetChangeShiftReducer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    showLoadding: () => {
      dispatch(actions.showLoading());
    },
    hideLoadding: () => {
      dispatch(actions.hideLoading());
    },
    responDuyetChangeShift: (params) => {
      api.responDuyetChangeShift(dispatch, params);
    },
    reponDuyetChangeShift: () => {
      dispatch(actions.reponDuyetChangeShift());
    },
    getDataListDuyetChangeShift: (params) => {
      api.getDataListDuyetChangeShift(dispatch, params);
    },
    deleteDuyetChangeShift: (params) => {
      api.deleteDuyetChangeShift(dispatch, params);
    },
    requestDeleteDuyetChangeShiftChuaDuyet: () => {
      dispatch(actions.requestDeleteDuyetChangeShiftChuaDuyet());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DuyetChangeShift);
