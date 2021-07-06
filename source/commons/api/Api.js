import * as APIClient from './instanceService';
import { Alert } from 'react-native';
import { actions } from '../../commons/action/index';
import { commonsConfigs as configs } from '../../commons';
import { models } from '../../commons/model/index';
import Toast from 'react-native-simple-toast';

const api = {
  setUpLogin,
  getLogout,
  getUserInfo,
  apiCheckVersion,
  createFolderImage,
  requestChamCong,
  requestChamCongFaceId,
  requestChamCongFaceIdApi,
  requestDataHistory,
  requestDataHistoryBaoCao,
  requestDataHistoryLocBaoCao,
  requestChangePassword,
  requestUpdateThongTinNguoiDung,
  updateLocation,

  // Change shift
  getListBlock,
  getListBlockWithUser,
  createApplicationForChangeShift,
  updateApplicationForChangeShiftByUser,
  // getListApplicationForChangeShift,
  // updateApplicationForChangeShiftByAdmin,
  // deleteApplicationForChangeShiftByAdmin,

  pushNotifiToAdminNghiPhep,
  pushNotifiToAdminDiMuonVeSom,
  requestDataChartStatisAdmin,
  getDetailTimeSheet,
  getAdminShift,
  postAdminShift,
  getTimeSheetDaily,
  GetListMapCheckin,
  createFaceId,
  updateStatusIsCheckFaceId,

  getDataNumberOrder,
  createActions,
  getDataHistoryOrder,
  deleteItemOrder,

  //xin nghi phep
  createRequestOrder,
  getResonSabbatical,

  //duyet nghi phep
  getDataListDuyetNghiPhep,
  deleteDuyetNghiPhep,
  duyetNghiPhep,

  //duyet di muon ve som
  getDataListDuyetDiMuonVeSom,
  responDuyetDiMuonVeSom,
  deleteDuyetDiMuonVeSom,

  //duyet di muon ve som
  getDataListDuyetQuenChamCong,
  responDuyetQuenChamCong,
  deleteDuyetQuenChamCong,

  //duyet di cong tac
  getDataListDuyetDiCongTac,
  responDuyetDiCongTac,
  deleteDuyetDiCongTac,

  // duyet change shift
  getDataListDuyetChangeShift,
  responDuyetChangeShift,
  deleteDuyetChangeShift,

  getDataCheckBusiness,

  getListBlookCa,
  getDetailTime_sheet,
  getBaoCaoTongQuan,
  dangKyTangCa
};

export { api };

// async function isSuccess(statusResponse) {
//     return configs.ERROR_CODE_SUCCESS.indexOf(statusResponse) > -1
// }

function handeResponseError(dispatch, error, message) {
  console.log(error.request);
  let messageError;
  if (error.message === configs.ERROR_CODE_401) {
    messageError = null;
    setTimeout(() => {
      Alert.alert(
        configs.APP_NAME,
        'Phiên đăng nhập đã hết hạn. Vui lòng thoát ứng dụng để đăng nhập lại',
        [
          {
            text: 'Đồng ý',
            onPress: () => {
              // models.deleteAllData()
              // RNExitApp.exitApp();
            },
          },
        ],
      );
    }, 700);
  } else if (error.message === configs.ERROR_CODE_404) {
    messageError = null;
    setTimeout(() => {
      Alert.alert(
        configs.APP_NAME,
        'Có lỗi không xác định xảy ra. Vui lòng thử lại.',
        [
          {
            text: 'Đồng ý',
            onPress: () => { },
          },
        ],
      );
    }, 700);
  } else if (error.message) {
    messageError = error.message;
  } else if (error.request) {
    messageError =
      'Lỗi kết nối với máy chủ. Xin vui lòng kiểm tra lại đường truyền internet';
  }
  if (message) {
    messageError = message;
  }
  if (messageError) {
    showMessage(messageError);
  }
}

function showMessage(msg) {
  setTimeout(() => {
    Alert.alert(
      configs.NAME_APP,
      msg,
      [{ text: configs.DONG_Y, onPress: () => { } }],
      { cancelable: false },
    );
  }, 700);
}

//login
async function setUpLogin(dispatch, params) {
  dispatch(actions.showLoading());
  var dataObject = {};
  let text_token = '';
  let messageError = '';
  let isLogin = false;
  // console.log('login with  param', params);
  await APIClient.login(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // console.log('login response', responsesData);
      // console.log('STATUS', status);
      if (status === 200 && responsesData && responsesData.status === 200) {
        // console.log('login  success', responsesData);
        responsesData.isSavePass = params.isSave;
        dataObject.access_token = responsesData.access_token;
        dataObject.token_type = responsesData.token_type;
        dataObject.expires_at = responsesData.expires_at;
        dataObject.active_location = responsesData.active_location;
        dataObject.isSavePass = true;
        // console.log('dataObject.isSavePass', dataObject.isSavePass);
        //face id
        dataObject.idCheckInFaceId =
          responsesData[0] &&
            responsesData[0].faceid &&
            responsesData[0].faceid.face_id
            ? responsesData[0].faceid.face_id
            : '';
        // console.log('dataObject.idCheckInFaceId', dataObject.idCheckInFaceId);
        dataObject.isCheckinFromFaceId =
          responsesData[0] &&
            responsesData[0].faceid &&
            responsesData[0].faceid.turn_on === 1
            ? true
            : false;
        // console.log('dataObject.isCheckinFromFaceId', dataObject.isCheckinFromFaceId);
        //anh cham face
        dataObject.image_sample =
          responsesData[0] && responsesData[0].image_sample
            ? responsesData[0].image_sample
            : '';
        // console.log('dataObject.image_sample', dataObject.image_sample);
        let dataRes = responsesData[0];
        dataRes.shift = [dataRes.shift];

        dataObject = { ...dataObject, ...dataRes };
        // console.log('dataObject', dataObject);
        if (responsesData.access_token && responsesData.access_token !== '') {
          // console.log('response include token', responsesData.access_token);
          dataObject.access_token = responsesData.access_token;
        } else {
          // console.log('using previous token', models.getToken());
          dataObject.access_token = models.getToken();
        }
        isLogin = true;
      } else {
        console.log('login fail with mess', responsesData.message);
        showMessage(responsesData.message ? responsesData.message : '');
      }
    })
    .catch(function (error) {
      handeResponseError(
        dispatch,
        error,
        'Không thể login. Vui lòng kiểm tra lại',
      );
    });
  // console.log('Vào đây không');
  if (
    !(Object.keys(dataObject).length === 0 && dataObject.constructor === Object)
  ) {
    if (await models.insertOrUpdateDataLogin(dataObject, true)) {
      // console.log('vào đây là biêt');
      dispatch(
        actions.requestIsLogin({
          isLogin: isLogin,
          countImage:
            dataObject.image_sample && dataObject.image_sample !== '' ? 1 : 0,
          permission: JSON.stringify(dataObject.permission),
        }),
      );
    }
  }
  dispatch(actions.hideLoading());
}

async function getUserInfo(dispatch) {
  dispatch(actions.showLoading());
  await APIClient.getUserInfo()
    .then(function (response) {
      let status = response.status;
      let data = response.data;
      if (status && status === 200 && data) {
      } else {
        showMessage(response.message);
      }
    })
    .catch(function (error) {
      console.log('getUserInfo', JSON.stringify(error));
      showMessage('Lấy thông tin người dùng thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function apiCheckVersion(dispatch) {
  // console.log('Api check version');
  dispatch(actions.showLoading());
  await APIClient.checkVersion({ version: configs.VERSION_APP })
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200) {
        dispatch(
          actions.requestCountImage({
            countImage: null,
            messageCheckVersion: responsesData.message,
            isCheckVersion: responsesData.status !== 200,
          }),
        );
      } else {
        showMessage('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    })
    .catch(function (error) {
      let message = error.message;
      if (message === 'Network Error') {
        message = 'Máy của bạn chưa có mạng. Vui lòng kiểm tra lại';
      }
      console.log('Eror :    ' + JSON.stringify(error));
    });
  dispatch(actions.hideLoading());
}

function createFolderImage1(dispatch, params) {
  models.deleteAllData();
}

//createFolderImage
async function createFolderImage(dispatch, params) {
  dispatch(actions.showLoading());
  let dataResponses = [];
  await APIClient.createFolderImage(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        dataResponses = responsesData;
      } else {
        showMessage('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    })
    .catch(function (error) {
      console.log('error:    ', error);
      // handeResponseError(dispatch, error)
    });

  let dataObject = models.getDataLogin();
  dataObject = deepCopyObject(dataObject);
  dataObject = { ...dataObject, ...{ image_sample: dataResponses?.data?.image } };
  if (models.insertOrUpdateDataLogin(dataObject, true)) {
    dispatch(actions.requestIsCreateFolderImage(dataResponses));
  }

  dispatch(actions.hideLoading());
}

function deepCopyObject(objectRaw) {
  if (!objectRaw) {
    return '';
  }
  if (Array.isArray(objectRaw)) {
    let objectArray = Array.from(objectRaw);
    return JSON.parse(JSON.stringify(objectArray));
  }
  return JSON.parse(JSON.stringify(objectRaw));
}

//createFolderImage
async function requestChamCong(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.requestChamCong(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      console.log("requestChamCong", responsesData);

      if (status === 200 && responsesData) {
        dispatch(actions.requestDataChamCong(responsesData.message));
      } else {
        showMessage('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    })
    .catch(function (error) {
      console.log("requestChamCong--error", error)
      handeResponseError(dispatch, error);
    });
  dispatch(actions.hideLoading());
}

async function requestChamCongFaceIdApi(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.requestChamCongFaceIdApi(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // console.log("requestChamCongFaceIdApi", responsesData);

      if (status === 200 && responsesData) {
        if (responsesData.status == 200) {
          requestChamCong(dispatch, params);
        } else {
          //check image_sample
          APIClient.login()
          .then(res => res.data?.["0"])
          .then(user => {
            if (user.image_sample !== "") {
              dispatch(actions.requestDataChamCong(responsesData.message));
              
            } else {
              dispatch(actions.requestDataChamCong({message: responsesData.message}));
              
              }
            })
        }
      } else {
        showMessage('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    })
    .catch(function (error) {
      // console.log("requestChamCongFaceIdApi--error", error)
      handeResponseError(dispatch, error);
    });
  dispatch(actions.hideLoading());
}

//createFolderImage
async function requestChamCongFaceId(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.requestChamCongFaceId(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        dispatch(actions.requestDataChamCongFaceId(responsesData.message));
      } else {
        showMessage('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    })
    .catch(function (error) {
      handeResponseError(dispatch, error);
    });
  dispatch(actions.hideLoading());
}

//createFolderImage
async function updateLocation(dispatch, params) {
  console.log('[Api] update location');
  await APIClient.updateLocation(params)
    .then(function (response) {
      console.log('[Api] update location response', response);
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        console.log('UPDATE LOCATION SUCCESS');
      } else {
        console.log('UPDATE LOCATION FAIL');
      }
    })
    .catch(function (error) {
      console.log('UPDATE LOCATION FAIL');
    });
}

//requestDataHistory
async function requestDataHistory(dispatch, params, isLoadLocation = false) {
  dispatch(actions.showLoading());
  let resultDataFree = {};
  await APIClient.requestGetTimeSheet(params)
    // await APIClient.requestGetTimeSheet(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // console.log({responsesData})
      if (status === 200 && responsesData) {
        resultDataFree = responsesData ? responsesData : {};
      } else {
        resultDataFree = null;
      }
    })
    .catch(function (error) {
      resultDataFree = null;
      handeResponseError(
        dispatch,
        error,
        'Không lấy được số ngày nghỉ và ngày công',
      );
    });

  let dataTimeSetUp = {};
  await APIClient.requestGetTimeSetup()
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        dataTimeSetUp =
          responsesData && responsesData[0] ? responsesData[0] : {};
        dataTimeSetUp = { ...dataTimeSetUp, ...{ isLoadLocation: isLoadLocation } };
      } else {
        dataTimeSetUp = null;
        // showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
      }
    })
    .catch(function (error) {
      dataTimeSetUp = null;
      // handeResponseError(dispatch, error)
    });

  let detailBlockInDate = {};
  await APIClient.requestDetailBlockInDate(params)
    .then(function (response) {
      detailBlockInDate = response.data;
    })
    .catch(function (error) {
      detailBlockInDate = null;
      handeResponseError(dispatch, error);
    });

  let detailDataMonth = {};
  await APIClient.requestDetailDataMonth()
    .then((response) => {
      detailDataMonth = response.data?.data?.total;
    })
    .catch((error) => {
      detailBlockInDate = null;
      handeResponseError(dispatch, error);
    });

  await APIClient.requestDataHistory(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        if (dataTimeSetUp && dataTimeSetUp) {
          dispatch(
            actions.requestDataHistory({
              responsesData: responsesData,
              dataTimeSetUp: dataTimeSetUp,
              resultDataFree: resultDataFree,
              detailBlockInDate: detailBlockInDate,
              detailDataMonth: detailDataMonth,
            }),
          );
        } else {
          dispatch(
            actions.requestDataHistory({
              responsesData: responsesData,
            }),
          );
          showMessage('Không lấy được thời gian setup, vui lòng thử lại');
        }
      } else {
        showMessage('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    })
    .catch(function (error) {
      handeResponseError(dispatch, error);
    });
  dispatch(actions.hideLoading());
}

//requestDataHistory
async function requestDataHistoryBaoCao(dispatch, params, isBaoCao = false) {
  dispatch(actions.showLoading());
  var [dataDateFree, dataHistory] = await Promise.all([
    requestGetDateFree(dispatch, params),
    getDataHistoryBaoCao(dispatch, params),
  ]);
  // const [dataDateFree, dataTimeSheet, dataTimeSetUp, dataHistory] = await Promise.all([
  //     requestGetDateFree(dispatch, params),
  //     requestGetTimeSheetBaoCao(dispatch, params),
  //     requestGetTimeSetupBaoCao(dispatch, params),
  //     getDataHistoryBaoCao(dispatch, params)
  // ])

  if (!dataDateFree) {
    dataDateFree = {};
    showMessage('Lỗi khi lấy số ngày nghỉ và ngày công');
  }

  // if (!dataTimeSheet) {
  //     dataTimeSheet = 0
  //     showMessage("Lỗi khi lấy số ngày phép")
  // }

  // if (!dataTimeSetUp) {
  //     showMessage('Lỗi khi lấy thời gian setup')
  // } else
  if (!dataHistory) {
    showMessage('Không lấy được lịch sử báo cáo');
  } else {
    dispatch(
      actions.requestDataHistoryBaoCao({
        dataDateFree: dataDateFree,
        responsesData: dataHistory,
        // dataTimeSetUp: dataTimeSetUp,
        // dataTimeSheet: dataTimeSheet,
      }),
    );
  }
  dispatch(actions.hideLoading());
}

async function requestGetDateFree(dispatch, params) {
  let result = null;
  await APIClient.requestGetDateFree()
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        result =
          responsesData && responsesData[0] && responsesData[0].date_free
            ? responsesData[0].date_free
            : '0';
      } else {
        result = null;
      }
    })
    .catch(function (error) {
      result = null;
      handeResponseError(
        dispatch,
        error,
        'Không lấy được số ngày nghỉ và ngày công',
      );
    });

  return result;
}
async function requestGetTimeSheetBaoCao(dispatch, params) {
  let result = null;
  console.log('params:   ', params);
  await APIClient.requestGetTimeSheet(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        result = responsesData ? responsesData : {};
      } else {
        result = null;
      }
    })
    .catch(function (error) {
      result = null;
      handeResponseError(
        dispatch,
        error,
        'Không lấy được số ngày nghỉ và ngày công',
      );
    });

  return result;
}

async function requestGetTimeSetupBaoCao(dispatch, params) {
  let result = null;
  await APIClient.requestGetTimeSetup()
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        result = responsesData && responsesData[0] ? responsesData[0] : {};
      } else {
        result = null;
        // showMessage('Lỗi khi lấy thời gian setup')
      }
    })
    .catch(function (error) {
      result = null;
      handeResponseError(dispatch, error, 'Không lấy được thời gian setup');
    });

  return result;
}

async function getDataHistoryBaoCao(dispatch, params) {
  let result = null;
  await APIClient.requestDataHistory(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        result = responsesData;
      } else {
        result = null;
        // showMessage('Không lấy được lịch sử đăng nhập')
      }
    })
    .catch(function (error) {
      result = null;
      handeResponseError(
        dispatch,
        error,
        'Không lấy được thông tin lịch sử chấm công. Vui lòng thử lại',
      );
    });

  return result;
}

//request loc bao cao
async function requestDataHistoryLocBaoCao(dispatch, params) {
  dispatch(actions.showLoading());
  let dataTimeSetUp = {};
  await APIClient.requestGetTimeSetup()
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        dataTimeSetUp =
          responsesData && responsesData[0] ? responsesData[0] : {};
      } else {
        // showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
      }
    })
    .catch(function (error) {
      // handeResponseError(dispatch, error)
    });

  await APIClient.requestDataHistory(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        if (dataTimeSetUp.time_start) {
          dispatch(
            actions.requestDataHistoryLocBaoCao({
              responsesData: responsesData,
              dataTimeSetUp: dataTimeSetUp,
            }),
          );
        } else {
          dispatch(
            actions.requestDataHistoryLocBaoCao({
              responsesData: responsesData,
            }),
          );
          showMessage('Không lấy được thời gian setup, vui lòng thử lại');
        }
      } else {
        showMessage('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    })
    .catch(function (error) {
      handeResponseError(dispatch, error);
    });
  dispatch(actions.hideLoading());
}

//sua doi mat khau
async function requestChangePassword(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.requestChangePassword(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        // if(models.deleteAllData()) {
        dispatch(actions.requestChangePass(responsesData));
      } else {
        showMessage('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    })
    .catch(function (error) {
      handeResponseError(dispatch, error);
    });
  dispatch(actions.hideLoading());
}

//sua thong tin nguoi dung
async function requestUpdateThongTinNguoiDung(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.requestUpdateThongTinNguoiDung(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        dispatch(actions.requestChangeThongTinNguoiDung(params));
      } else {
        showMessage('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    })
    .catch(function (error) {
      handeResponseError(dispatch, error);
    });
  dispatch(actions.hideLoading());
}

async function pushNotifiToAdminNghiPhep(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.pushNotifiToAdminNghiPhep(params)
    .then(function (response) { })
    .catch(function (error) {
      console.log(error);
      showMessage('Có lỗi xảy ra khi bắn thông báo cho admin');
    });
  dispatch(actions.hideLoading());
}

async function pushNotifiToAdminDiMuonVeSom(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.pushNotifiToAdminNghiPhep(params)
    .then(function (response) { })
    .catch(function (error) {
      console.log(error);
      showMessage('Có lỗi xảy ra khi bắn thông báo cho admin');
    });
  dispatch(actions.hideLoading());
}

//requestDataHistory
async function requestDataChartStatisAdmin(dispatch, params) {
  dispatch(actions.showLoading());
  const [dataPhongBan, dataNhanVien, dataChiNhanh] = await Promise.all([
    // getLateSoonAdmin(dispatch),
    getPhongBan(dispatch),
    getNhanVien(dispatch),
    getChiNhanh(dispatch),
  ]);

  dispatch(
    actions.requestDataLateSoon({
      // dataLateSoonAdmin: dataLateSoonAdmin,
      dataLengthPhongBan: dataPhongBan.length,
      dataLengthNhanVien: dataNhanVien.length,
      dataLengthChiNhanh: dataChiNhanh.length,
      dataPhongBan: dataPhongBan,
      dataNhanVien: dataNhanVien,
      dataChiNhanh: dataChiNhanh,
    }),
  );
  dispatch(actions.hideLoading());
}

async function getLateSoonAdmin(dispatch) {
  // dispatch(actions.showLoading())
  let reset = null;
  await APIClient.getLateSoonAdmin()
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        reset = responsesData;
        // dispatch(actions.requestDataLateSoon(responsesData))
      } else {
        reset = [];
        showMessage('Có lỗi xảy ra khi lấy thông tin biểu đồ');
      }
    })
    .catch(function (error) {
      reset = [];
      console.log('error:   ' + JSON.stringify(error));
      showMessage('có lỗi xảy ra khi lấy thông tin biểu đồ');
    });
  return reset;
  // dispatch(actions.hideLoading())
}

async function getPhongBan(dispatch) {
  // dispatch(actions.showLoading())
  let reset = 0;
  await APIClient.getPhongBan()
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        reset = responsesData;
      } else {
        reset = 0;
        showMessage('Có lỗi xảy ra khi lấy thông tin phòng ban');
      }
    })
    .catch(function (error) {
      reset = 0;
      console.log('error:   ' + JSON.stringify(error));
      showMessage('có lỗi xảy ra khi lấy thông tin phòng ban');
    });
  return reset;
  // dispatch(actions.hideLoading())
}

async function getChiNhanh(dispatch) {
  // dispatch(actions.showLoading())
  let reset = 0;
  await APIClient.getChiNhanh()
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        reset = responsesData;
      } else {
        reset = 0;
        showMessage('Có lỗi xảy ra khi lấy thông tin chi nhánh');
      }
    })
    .catch(function (error) {
      reset = 0;
      console.log('error:   ' + JSON.stringify(error));
      showMessage('có lỗi xảy ra khi lấy thông tin chi nhánh');
    });
  return reset;
  // dispatch(actions.hideLoading())
}

async function getNhanVien(dispatch) {
  // dispatch(actions.showLoading())
  let reset = 0;
  await APIClient.getNhanVien()
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (status === 200 && responsesData) {
        reset = responsesData;
      } else {
        reset = 0;
        showMessage('Có lỗi xảy ra khi lấy thông tin nhân viên');
      }
    })
    .catch(function (error) {
      reset = 0;
      console.log('error:   ' + JSON.stringify(error));
      showMessage('có lỗi xảy ra khi lấy thông tin nhân viên');
    });
  return reset;
  // dispatch(actions.hideLoading())
}

async function getDetailTimeSheet(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.getDetailTimeSheet(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // dispatch(actions.requestDetailTimeSheet(responsesData))
      dispatch(actions.requestDetailAllTimeSheet(responsesData));
    })
    .catch(function (error) {
      showMessage('Có lỗi xảy ra khi lấy thông tin người dùng .');
    });
  dispatch(actions.hideLoading());
}

async function getAdminShift(dispatch) {
  dispatch(actions.showLoading());
  await APIClient.getAdminShift()
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (responsesData) {
        dispatch(actions.requertDataAdminShift(responsesData));
      }
    })
    .catch(function (error) {
      showMessage('Có lỗi xảy ra khi lấy thông tin người dùng  .');
    });
  dispatch(actions.hideLoading());
}

async function postAdminShift(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.postAdminShift(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (responsesData && responsesData.message) {
        showMessage(responsesData.message);
      }
    })
    .catch(function (error) {
      showMessage('Có lỗi xảy ra khi lấy thông tin người dùng   .');
    });
  dispatch(actions.hideLoading());
}

async function getTimeSheetDaily(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.getTimeSheetDaily(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;

      // if (responsesData && responsesData.status === 200) {
      if (responsesData) {
        dispatch(actions.requestDataTimekeepingDay(responsesData));
      } else {
        showMessage('Có lỗi xảy ra khi lấy thông tin.');
      }
    })
    .catch(function (error) {
      console.log(error);
      showMessage('Có lỗi xảy ra khi lấy thông tin chấm công.');
    });
  dispatch(actions.hideLoading());
}
async function GetListMapCheckin(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.GetListMapCheckin(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // if (responsesData && responsesData.status === 200) {
      if (responsesData) {
        dispatch(actions.requestDataListMap(responsesData));
      } else {
        showMessage('Có lỗi xảy ra khi lấy thông tin.');
      }
    })
    .catch(function (error) {
      console.log(error);
      showMessage('Có lỗi xảy ra khi lấy thông tin chấm công.');
    });
  dispatch(actions.hideLoading());
}

async function createFaceId(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.apiCreateFaceId(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;

      showMessage(responsesData.message);
      if (responsesData && responsesData.status === 200) {
        models.changeDataIdCheckInFaceId(params.face_id);
        models.changeIsCheckInFaceId(true);
        dispatch(actions.requertIsCreateFaceId(true));
      } else {
        models.changeDataIdCheckInFaceId('');
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Có lỗi xảy ra khi tạo id face id.');
    });
  dispatch(actions.hideLoading());
}

async function updateStatusIsCheckFaceId(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.updateStatusIsCheckFaceId(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;

      showMessage(responsesData.message);
      if (responsesData && responsesData.status === 200) {
        dispatch(actions.requertIsUpdateStatus(true));
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Thay đổi trạng thái chấm công không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function createActions(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.apiCreateActions(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;

      showMessage(responsesData.message);
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Tạo đơn đi muộn về sớm không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function deleteItemOrder(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.deleteItemOrder(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;

      if (responsesData && responsesData.status === 200) {
        dispatch(actions.requestDeleteItemOrder(responsesData));
      } else {
        showMessage(responsesData.message);
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Xóa đơn không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function getDataHistoryOrder(dispatch, params) {
  dispatch(actions.showLoading());
  // console.log('getDataHistoryOrder param', params);
  await APIClient.getDataHistoryOrder(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;

      if (responsesData && responsesData.status === 200) {
        if (params.type === 0) {
          dispatch(actions.requestDataListChuaDuyet(responsesData));
        } else if (params.type === 1) {
          dispatch(actions.requestDataListDaDuyet(responsesData));
        } else if (params.type === 2) {
          dispatch(actions.requestDataListTuChoi(responsesData));
        }
      }
    })
    .catch(function (error) {
      console.log(error);
      showMessage('Lấy danh sách lịch sử đơn không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function getDataNumberOrder(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.getDataNumberOrder(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;

      if (responsesData && responsesData.status === 200) {
        dispatch(actions.requestDataNumberOrder(responsesData));
      } else {
        showMessage(responsesData.message);
      }
    })
    .catch(function (error) {
      console.log(error);
      showMessage('Lấy danh sách lịch sử đơn không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function getResonSabbatical(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.getResonSabbatical(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (responsesData && responsesData.status === 200) {
        dispatch(actions.requestDataReason(responsesData));
      } else {
        showMessage(responsesData.message);
      }
    })
    .catch(function (error) {
      console.log(error);
      showMessage('Lấy danh sách lịch sử đơn không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function createRequestOrder(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.createRequestOrder(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      showMessage(responsesData.message);
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Tạo đơn xin phép thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function duyetNghiPhep(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.duyetNghiPhep(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // showMessage(responsesData.message)
      if (responsesData && responsesData.status === 200) {
        dispatch(actions.requestMessageDuyetNghiPhep(responsesData));
      } else {
        showMessage(responsesData.message);
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Thực hiện thao tác duyệt nghỉ phép thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function getDataListDuyetNghiPhep(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.getDataListDuyetNghiPhep(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // showMessage(responsesData.message)
      if (responsesData && responsesData.status === 200) {
        if (params.type == '0') {
          dispatch(actions.requestDataDuyetNghiPhep(responsesData));
        } else if (params.type == '1') {
          console.log('đã duyệt:    ', responsesData);
          dispatch(actions.requestDataDuyetNghiPhepDaDuyet(responsesData));
        } else if (params.type == '2') {
          dispatch(actions.requestDataDuyetNghiPhepTuChoi(responsesData));
        }
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Lấy đơn duyệt nghỉ phép không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function deleteDuyetNghiPhep(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.deleteDuyetNghiPhep(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // showMessage(responsesData.message)
      if (responsesData && responsesData.status === 200) {
        if (params.idPage == '0') {
          dispatch(actions.requestDeleteDuyetNghiPhepChuaDuyet(responsesData));
        } else {
          dispatch(actions.requestDeleteDuyetNghiPhep(responsesData));
        }
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Xóa đơn không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function deleteDuyetDiMuonVeSom(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.deleteDuyetDiMuonVeSom(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (responsesData && responsesData.status === 200) {
        if (params.idPage == '0') {
          dispatch(
            actions.requestDeleteDuyetDiMuonVeSomChuaDuyet(responsesData),
          );
        } else {
          dispatch(actions.requestDeleteDuyetDiMuonVeSom(responsesData));
        }
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Xóa đơn không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function getDataListDuyetDiMuonVeSom(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.getDataListDuyetDiMuonVeSom(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // showMessage(responsesData.message)
      if (responsesData && responsesData.status === 200) {
        if (params.type == '0') {
          dispatch(actions.requestDataDuyetDiMuonVeSom(responsesData));
        } else if (params.type == '1') {
          dispatch(actions.requestDataDuyetDiMuonVeSomDaDuyet(responsesData));
        } else if (params.type == '2') {
          dispatch(actions.requestDataDuyetDiMuonVeSomTuChoi(responsesData));
        }
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Lấy đơn duyệt đi muộn về sớm không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function responDuyetDiMuonVeSom(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.responDuyetDiMuonVeSom(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // showMessage(responsesData.message)
      if (responsesData && responsesData.status === 200) {
        dispatch(actions.reponDuyetDiMuonVeSom(responsesData));
      } else {
        showMessage(responsesData.message);
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Thao tác đi muộn về sớm thất bại.');
    });
  dispatch(actions.hideLoading());
}

//quen cham cong
async function deleteDuyetQuenChamCong(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.deleteDuyetQuenChamCong(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (responsesData && responsesData.status === 200) {
        if (params.idPage == '0') {
          dispatch(
            actions.requestDeleteDuyetQuenChamCongChuaDuyet(responsesData),
          );
        } else {
          dispatch(actions.requestDeleteDuyetQuenChamCong(responsesData));
        }
      } else {
        showMessage(responsesData.message);
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Xóa đơn không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function getDataListDuyetQuenChamCong(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.getDataListDuyetQuenChamCong(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // showMessage(responsesData.message)
      if (responsesData && status === 200) {
        if (params.type == '0') {
          console.log(
            '___________________________________________',
            params.type,
          );
          console.log(
            '___________________________________________',
            responsesData,
          );
          dispatch(actions.requestDataDuyetQuenChamCong(responsesData));
        } else if (params.type == '1') {
          dispatch(actions.requestDataDuyetQuenChamCongDaDuyet(responsesData));
        } else if (params.type == '2') {
          dispatch(actions.requestDataDuyetQuenChamCongTuChoi(responsesData));
        }
      }
    })
    .catch(function (error) {
      showMessage('Lấy đơn duyệt quên chấm công không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function responDuyetQuenChamCong(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.responDuyetQuenChamCong(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // showMessage(responsesData.message)
      if (responsesData && responsesData.status === 200) {
        dispatch(actions.reponDuyetQuenChamCong(responsesData));
      } else {
        showMessage(responsesData.message);
      }
    })
    .catch(function (error) {
      showMessage('Thao tác quên chấm công thất bại.');
    });
  dispatch(actions.hideLoading());
}

//di cong tac
async function deleteDuyetDiCongTac(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.deleteDuyetDiCongTac(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (responsesData && responsesData.status === 200) {
        if (params.idPage == '0') {
          dispatch(actions.requestDeleteDuyetDiCongTacChuaDuyet(responsesData));
        } else {
          dispatch(actions.requestDeleteDuyetDiCongTac(responsesData));
        }
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Xóa đơn không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function getDataListDuyetDiCongTac(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.getDataListDuyetDiCongTac(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // showMessage(responsesData.message)
      if (responsesData && responsesData.status === 200) {
        if (params.type == '0') {
          dispatch(actions.requestDataDuyetDiCongTac(responsesData));
        } else if (params.type == '1') {
          dispatch(actions.requestDataDuyetDiCongTacDaDuyet(responsesData));
        } else if (params.type == '2') {
          dispatch(actions.requestDataDuyetDiCongTacTuChoi(responsesData));
        }
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Lấy đơn duyệt đi công tác không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function responDuyetDiCongTac(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.responDuyetDiCongTac(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // showMessage(responsesData.message)
      if (responsesData && responsesData.status === 200) {
        dispatch(actions.reponDuyetDiCongTac(responsesData));
      } else {
        showMessage(responsesData.message);
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Thao tác duyệt đi công tác thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function getDataListDuyetChangeShift(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.getDataListDuyetChangeShift(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (responsesData && status == 200) {
        if (params.type == '0') {
          dispatch(actions.requestDataDuyetChangeShift(responsesData));
        } else if (params.type == '1') {
          dispatch(actions.requestDataDuyetChangeShiftDaDuyet(responsesData));
        } else if (params.type == '2') {
          dispatch(actions.requestDataDuyetChangeShiftTuChoi(responsesData));
        }
      }
    })
    .catch(function (error) {
      showMessage('Lấy đơn duyệt đổi ca không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function responDuyetChangeShift(dispatch, params) {
  dispatch(actions.showLoading());
  console.log('API duyet change shift param', params);
  await APIClient.responDuyetChangeShift(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // showMessage(responsesData.message)
      if (responsesData && responsesData.status === 200) {
        dispatch(actions.reponDuyetChangeShift(responsesData));
      } else {
        showMessage(responsesData.message);
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Thao tác duyệt đổi ca thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function deleteDuyetChangeShift(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.deleteDuyetChangeShift(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      if (responsesData && responsesData.status === 200) {
        if (params.idPage == '0') {
          dispatch(
            actions.requestDeleteDuyetChangeShiftChuaDuyet(responsesData),
          );
        } else {
          dispatch(actions.requestDeleteDuyetChangeShift(responsesData));
        }
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Xóa đơn không thành công.');
    });
  dispatch(actions.hideLoading());
}

async function responDataCreatetrial(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.responDataCreatetrial(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
      // showMessage(responsesData.message)
      if (responsesData && responsesData.status === 200) {
        dispatch(actions.requestCreateTrial(responsesData));
      } else {
        showMessage(responsesData.message);
      }
    })
    .catch(function (error) {
      console.log(error.response);
      showMessage('Tạo tài khoản thử nghiệm thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function getDataCheckBusiness(dispatch, params) {
  // dispatch(actions.showLoading())
  // await APIClient.getDataCheckBusiness(params)
  //     .then(function (response) {
  //         let status = response.status;
  //         let responsesData = response.data;
  //         console.log("responsesData:    ", responsesData)
  //         return responsesData
  //         if (responsesData && responsesData.status === 200) {
  //             // dispatch(actions.requestCreateTrial(responsesData))
  //         } else {
  //             showMessage(responsesData.message)
  //         }
  //     })
  //     .catch(function (error) {
  //         console.log(error.response)
  //         showMessage('Tạo tài khoản thử nghiệm thất bại.')
  //     })
  // dispatch(actions.hideLoading())
}

async function getBaoCaoTongQuan(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.getDetailTime_sheet(params)
    .then(function (response) {
      let status = response.status;
      let data = response.data.data;
      // console.log('---------> status getBaoCaoTongQuan', {params}, data);
      if (status && status === 200 && data) {
        dispatch(actions.getBaoCaoTongQuan(data));
      } else {
        showMessage(response.message);
      }
    })
    .catch(function (error) {
      showMessage('Lấy danh sách block thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function getDetailTime_sheet(dispatch, params) {
  // console.log('________________________getDetailTime_sheet',);
  dispatch(actions.showLoading());
  await APIClient.getDetailTime_sheet(params)
    .then(function (response) {
      let status = response.status;
      // console.log('status V3', status);
      let data = response.data.data;
      // console.log("------++++", data)
      if (status && status === 200 && data) {
        dispatch(actions.getDetailTime_sheet(data));
      } else {
        showMessage(response.message);
      }
    })
    .catch(function (error) {
      showMessage('Lấy danh sách block thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function getListBlookCa(dispatch, params) {
  // console.log('________________________getListBlookCa',);
  dispatch(actions.showLoading());
  await APIClient.getListBlookCa(params)
    .then(function (response) {
      let status = response.status;
      let data = response.data.data;
      if (status && status === 200 && data) {
        dispatch(actions.getListBlookCa(data));
      } else {
        showMessage(response.message);
      }
    })
    .catch(function (error) {
      showMessage('Lấy danh sách block thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function getListBlock(dispatch, params) {
  dispatch(actions.showLoading());
  console.log('API get list block params', params);
  await APIClient.getListBlock(params)
    .then(function (response) {
      let status = response.status;
      let data = response.data.data;
      console.log('API get list block data', params);
      if (status && status === 200 && data) {
        dispatch(actions.getListBlock(data));
      } else {
        showMessage(response.message);
      }
    })
    .catch(function (error) {
      console.log('getListBlock', JSON.stringify(error));
      showMessage('Lấy danh sách block thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function getListBlockWithUser(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.getListBlockWithUser(params)
    .then(function (response) {
      let status = response.status;
      let data = response.data;
      if (status && status === 200 && data) {
        dispatch(actions.getListBlockWithUser(data));
      } else {
        showMessage(response.message);
      }
    })
    .catch(function (error) {
      console.log('getListBlockWithUser', JSON.stringify(error));
      showMessage('Lấy danh sách block thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function createApplicationForChangeShift(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.createApplicationForChangeShift(params)
    .then(function (response) {
      let status = response.status;
      let data = response.data;
      if (status && status === 200 && data) {
        console.log('data', data);
        Toast.show('Tạo đơn xin chuyển đổi ca thành công', 3000);
        dispatch(actions.createApplicationForChangeShift(true));
      } else {
        showMessage(response.message);
      }
    })
    .catch(function (error) {
      console.log('createApplicationForChangeShift', JSON.stringify(error));
      showMessage('Tạo đơn xin chuyển ca thất bại.');
    });
  dispatch(actions.hideLoading());
}

async function updateApplicationForChangeShiftByUser(dispatch, params) {
  dispatch(actions.showLoading());
  await APIClient.updateApplicationForChangeShiftByUser(params)
    .then(function (response) {
      let status = response.status;
      let data = response.data;
      if (status && status === 200 && data) {
        Toast.show('Cập nhật đơn xin chuyển đổi ca thành công', 3000);
        dispatch(actions.updateApplicationForChangeShiftByUser(data));
      } else {
        showMessage(response.message);
      }
    })
    .catch(function (error) {
      console.log(
        'updateApplicationForChangeShiftByUser',
        JSON.stringify(error),
      );
      showMessage('Cập nhật đơn xin chuyển ca thất bại.');
    });
  dispatch(actions.hideLoading());
}

// Admin actions
// async function getListApplicationForChangeShift(dispatch, params) {
//   dispatch(actions.showLoading());
//   await APIClient.getListApplicationForChangeShift(params)
//     .then(function (response) {
//       let status = response.status;
//       let data = response.data;
//       if (status && status === 200 && data) {
//         dispatch(actions.getListApplicationForChangeShift(data));
//       } else {
//         showMessage(response.message);
//       }
//     })
//     .catch(function (error) {
//       console.log('getListApplicationForChangeShift', JSON.stringify(error));
//       showMessage('Lấy danh sách đơn xin chuyển ca thất bại.');
//     });
//   dispatch(actions.hideLoading());
// }

// async function updateApplicationForChangeShiftByAdmin(dispatch, params) {
//   dispatch(actions.showLoading());
//   await APIClient.updateApplicationForChangeShiftByAdmin(params)
//     .then(function (response) {
//       let status = response.status;
//       let data = response.data;
//       if (status && status === 200 && data) {
//         dispatch(actions.updateApplicationForChangeShiftByAdmin(data));
//       } else {
//         showMessage(response.message);
//       }
//     })
//     .catch(function (error) {
//       console.log(
//         'updateApplicationForChangeShiftByAdmin',
//         JSON.stringify(error),
//       );
//       showMessage('Cập nhật đơn xin chuyển ca thất bại.');
//     });
//   dispatch(actions.hideLoading());
// }

// async function deleteApplicationForChangeShiftByAdmin(dispatch, params) {
//   dispatch(actions.showLoading());
//   await APIClient.deleteApplicationForChangeShiftByAdmin(params)
//     .then(function (response) {
//       console.log('getListApplicationForChangeShift Response', response);
//       let status = response.status;
//       let data = response.data;
//       if (status && status === 200 && data) {
//         dispatch(actions.deleteApplicationForChangeShiftByAdmin(data));
//       } else {
//         showMessage(response.message);
//       }
//     })
//     .catch(function (error) {
//       console.log(
//         'deleteApplicationForChangeShiftByAdmin',
//         JSON.stringify(error),
//       );
//       showMessage('Xoá đơn xin chuyển ca thất bại.');
//     });
//   dispatch(actions.hideLoading());
// }

async function getLogout(dispatch, params) {
  // dispatch(actions.showLoading())
  await APIClient.getLogout(params)
    .then(function (response) {
      let status = response.status;
      let responsesData = response.data;
    })
    .catch(function (error) {
      console.log(error.response);
      // showMessage('Tạo tài khoản thử nghiệm thất bại.')
    });
  // dispatch(actions.hideLoading())
}

function dangKyTangCa(dispatch, params) {
  return APIClient.dangKyTangCa(params);
}