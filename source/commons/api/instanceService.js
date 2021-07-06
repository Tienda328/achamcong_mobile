import axios from 'axios';
import {commonsConfigs as configs} from '..';
// import { api } from './Api';
import {models} from '../model';

export const instance = axios.create({
  baseURL: configs.DOMAIN,
  timeout: 80000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    // 'Authorization': 'Bearer ' + models.getToken()
  },
});

instance.interceptors.request.use(async (request) => {
  request.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    Authorization: 'Bearer ' + models.getToken(),
  };
  return request;
});

export function login(params) {
  return instance.post('/api/login', params);
}

export function getCountImage() {
  return instance.get('/api/user/getcountimage');
}

export function checkVersion(params) {
  var instance1 = axios.create({
    baseURL: configs.DOMAIN,
    timeout: 80000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  });
  return instance1.post('api/check_version?version=' + params.version);
}

export function createFolderImage(params) {
  return instance.post(
    '/api/v3/user/face_recognition/upload_image_sample',
    params,
  );
}

export function requestChamCong(params) {
  return instance.post('/api/v3/public/timekeeping_image', params);
}

export function requestChamCongFaceIdApi(params) {
  return instance.post('api/v2/public/compare_image', params);
}

export function requestChamCongFaceId(params) {
  return instance.post('/api/v2/faceid/attdance', params);
}

//api cũ
// export function requestDataHistory(params) {
//     return instance.post('/api/user/history', params)
// }
export function requestDataHistory(params) {
  return instance.post('/api/v2/user/timesheet/get_detail', params);
}

export function requestDetailBlockInDate(params) {
  // console.log("requestDetailBlockInDate", {params})
  return instance.get('/api/v3/user/time_sheet/detail_block_in_date', {params});
}

export function requestDetailDataMonth() {
  let params = {};

  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth();
  let dateMax = new Date(year, month + 1, 0).getDate();

  let date_start = `${year}-${
    month + 1 >= 10 ? month + 1 : `0${month + 1}`
  }-01`;

  let date_end = `${year}-${month + 1 >= 10 ? month + 1 : `0${month + 1}`}-${
    dateMax >= 10 ? dateMax : `0${dateMax}`
  }`;

  params = {
    date_start,
    date_end,
  };

  return instance.get('/api/v3/user/time_sheet/get_detail', {params});
}

export function requestGetTimeSetup() {
  return instance.get('/api/user/getTimeSetup');
}

export function requestGetTimeSheet(params) {
  return instance.post('/api/gettimesheet', params);
}

export function requestGetDateFree() {
  return instance.get('/api/getdatefree');
}

export function requestChangePassword(params) {
  return instance.post('/api/changepass', params);
}

export function requestUpdateThongTinNguoiDung(params) {
  return instance.post('/api/user', params);
}

export function pushNotifiToAdminNghiPhep(params) {
  return instance.post('/api/sendbyuser', params);
}

export function getLateSoonAdmin() {
  return instance.get('/api/accountant/getlatesoon');
}

export function getPhongBan() {
  return instance.get('/api/admin/department');
}

export function getChiNhanh() {
  return instance.get('/api/admin/branch');
}

export function getNhanVien() {
  return instance.get('/api/admin/user');
}

export function getDetailTimeSheet(params) {
  return instance.post('/api/admin/getDetailAction', params);
}

export function getAdminShift() {
  return instance.get('/api/admin/shift');
}

export function postAdminShift(params) {
  return instance.put('/api/admin/shift/' + params.id, params);
}

export function getTimeSheetDaily(params) {
  return instance.post('/api/v2/accountant/timesheet/timesheet_daily', params);
}
export function GetListMapCheckin(params) {
  return instance.post('/api/v2/admin/user/get_history_checkin', params);
}

export function apiCreateFaceId(params) {
  return instance.post('/api/v2/faceid/create', params);
}

export function updateStatusIsCheckFaceId() {
  return instance.get('/api/v2/faceid/update_status');
}

export function apiCreateActions(params) {
  return instance.post('/api/v2/user/request/action/store_action', params);
}

export function updateLocation(params) {
  return instance.post('/api/v3/public/history_location', params);
}

export function getDataHistoryOrder(params) {
  if (params.indexLoaiNghi == '1') {
    // console.log('Lấy danh sách nghỉ phép');
    return instance.post(
      '/api/v2/user/request/sabbatical/get_sabbatical?pages=' + params.page,
      params,
    );
  } else if (params.indexLoaiNghi == '2') {
    return instance.post(
      '/api/v2/user/request/action/get_action?page=' + params.page,
      params,
    );
  } else if (params.indexLoaiNghi == '3') {
    return instance.post(
      '/api/v2/user/request/misscheckin/get_misscheckin?page=' + params.page,
      params,
    );
  } else if (params.indexLoaiNghi == '4') {
    return instance.post(
      '/api/v2/user/request/bussiness/get_bussiness?page=' + params.page,
      params,
    );
  } else if (params.indexLoaiNghi == '5') {
    console.log('Lấy danh sách chuyển đổi ca');
    return instance.post(
      'api/v2/user/request/change_shift/get_change_shift',
      params,
    );
  } else {
  }
}

export function deleteItemOrder(params) {
  if (params.indexLoaiNghi == '1') {
    return instance.post(
      '/api/v2/user/request/sabbatical/delete_sabbatical',
      params,
    );
  } else if (params.indexLoaiNghi == '2') {
    return instance.post('/api/v2/user/request/action/delete_action', params);
  } else if (params.indexLoaiNghi == '3') {
    return instance.post(
      '/api/v2/user/request/misscheckin/delete_misscheckin',
      params,
    );
  } else if (params.indexLoaiNghi == '4') {
    return instance.post(
      '/api/v2/user/request/bussiness/delete_bussiness',
      params,
    );
  } else if (params.indexLoaiNghi == '5') {
    return instance.post(
      '/api/v2/user/request/change_shift/delete_change_shift',
      params,
    );
  }
}

export function getDataNumberOrder(params) {
  if (params.indexLoaiNghi == '1') {
    return instance.post(
      '/api/v2/user/request/sabbatical/get_number_sabbatical',
      {...params, ...{type: 3}},
    );
  } else if (params.indexLoaiNghi == '2') {
    return instance.post('/api/v2/user/request/action/get_number_action', {
      ...params,
      ...{type: 3},
    });
  } else if (params.indexLoaiNghi == '3') {
    return instance.post(
      '/api/v2/user/request/misscheckin/get_number_misscheckin',
      {...params, ...{type: 3}},
    );
  } else if (params.indexLoaiNghi == '4') {
    return instance.post(
      '/api/v2/user/request/bussiness/get_number_bussiness',
      {...params, ...{type: 3}},
    );
  }
}

export function getResonSabbatical() {
  return instance.post('/api/v2/user/request/sabbatical/get_reason');
}

export function createRequestOrder(params) {
  //3 là tao don quen cham cong, 4: di cong tac: 1(null) : xin nghỉ phep
  if (params.typeOrder == 3) {
    return instance.post(
      '/api/v2/user/request/misscheckin/store_misscheckin',
      params,
    );
  } else if (params.typeOrder == 4) {
    return instance.post(
      '/api/v2/user/request/bussiness/store_bussiness',
      params,
    );
  }
  return instance.post(
    '/api/v2/user/request/sabbatical/store_sabbatical',
    params,
  );
}

export function duyetNghiPhep(params) {
  return instance.post(
    '/api/v2/admin/request/sabbatical/update_sabbatical',
    params,
  );
}

export function getDataListDuyetNghiPhep(params) {
  return instance.post(
    '/api/v2/admin/request/sabbatical/get_sabbatical?pages=' + params.pages,
    params,
  );
}

export function deleteDuyetNghiPhep(params) {
  return instance.post(
    '/api/v2/admin/request/sabbatical/delete_sabbatical',
    params,
  );
}

export function deleteDuyetDiMuonVeSom(params) {
  return instance.post('/api/v2/admin/request/action/delete_action', params);
}

export function getDataListDuyetDiMuonVeSom(params) {
  return instance.post(
    '/api/v2/admin/request/action/get_action?pages=' + params.page,
    params,
  );
}

export function responDuyetDiMuonVeSom(params) {
  return instance.post('/api/v2/admin/request/action/update_action', params);
}
//quen cham cong
export function deleteDuyetQuenChamCong(params) {
  if (params.isAdmin) {
    return instance.post(
      '/api/v2/admin/request/misscheckin/delete_misscheckin',
      params,
    );
  }
  return instance.post(
    '/api/v2/user/request/misscheckin/delete_misscheckin',
    params,
  );
}

export function getDataListDuyetQuenChamCong(params) {
  return instance.post(
    '/api/v2/admin/request/misscheckin/get_misscheckin?pages=' + params.page,
    params,
  );
}

export function responDuyetQuenChamCong(params) {
  return instance.post(
    '/api/v2/admin/request/misscheckin/update_misscheckin',
    params,
  );
}
//di cong tac
export function deleteDuyetDiCongTac(params) {
  return instance.post(
    '/api/v2/admin/request/bussiness/delete_bussiness',
    params,
  );
}

export function getDataListDuyetDiCongTac(params) {
  return instance.post(
    '/api/v2/admin/request/bussiness/get_bussiness?pages=' + params.page,
    params,
  );
}

export function responDuyetDiCongTac(params) {
  return instance.post(
    '/api/v2/admin/request/bussiness/update_bussiness',
    params,
  );
}

export function responDataCreatetrial(params) {
  return instance.post('/api/create_trial', params);
}

export function getDataCheckBusiness() {
  return instance.get('/api/v2/public/check_business');
}

// --Feature: Change shift -- //
// Get list blocks
export function getListBlock(params) {
  return instance.post('/api/v2/public/get_block', params);
}

export function getListBlookCa(params) {
  // console.log("getListBlookCa",{params})
  return instance.get(
    `/api/v3/user/time_sheet/detail_block_in_date?date_start=${params.date_start}&date_end=${params.date_end}`,
  );
}
export function getDetailTime_sheet(params) {
  // console.log('Params V3', params);
  return instance.get(
    `/api/v3/user/time_sheet/get_detail?date_start=${params.date_start}&date_end=${params.date_end}`,
  );
}
// Get list blocks base on user id
export function getListBlockWithUser(params) {
  return instance.post('/api/v2/block/user/get_block_in_date', params);
}

// User action: Create application for change shift
export function createApplicationForChangeShift(params) {
  return instance.post(
    '/api/v2/user/request/change_shift/store_change_shift',
    params,
  );
}

// User action: Update application for change shift
export function updateApplicationForChangeShiftByUser(params) {
  return instance.post(
    '/api/v2/user/request/change_shift/update_change_shift',
    params,
  );
}

// Admin action: Get list of application for change shift
export function getDataListDuyetChangeShift(params) {
  return instance.post(
    '/api/v2/admin/request/change_shift/get_change_shift',
    params,
  );
}

// Admin action: Update application for change shift
export function responDuyetChangeShift(params) {
  return instance.post(
    '/api/v2/admin/request/change_shift/update_change_shift',
    params,
  );
}

// Admin action: Update application for change shift
export function deleteDuyetChangeShift(params) {
  return instance.post(
    '/api/v2/admin/request/change_shift/delete_change_shift',
    params,
  );
}

// Logout
export function getLogout() {
  return instance.get('/api/logout');
}

export function dangKyTangCa(params) {
  return instance.post('/api/v3/user/request/overtime/store', params)
}

export function dangKyCaLamViec(params) {
  return instance.post('/api/v3/user/request/ticket_shift_assignment/store', params)
}