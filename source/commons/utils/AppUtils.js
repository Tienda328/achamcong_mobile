import {commonsConfigs as configs} from '../../commons';
import {Alert, Linking} from 'react-native';
import Moment from 'moment';
import moment from 'moment';
import {models} from '../../commons/model/index';
import {Dimensions} from 'react-native';
const WINDOW_WIDTH = Dimensions.get('window').width;

export const scale = (size) => (size * WINDOW_WIDTH) / 375;

export function showAlert(title, contentAlert, action = () => {}) {
  Alert.alert(title ? title : configs.NAME_APP, contentAlert, [
    {
      text: 'Đồng ý',
      onPress: action,
    },
  ]);
}

export function jumpToAppStore() {
  Linking.openURL(
    'https://apps.apple.com/us/app/a-ch%E1%BA%A5m-c%C3%B4ng/id1532369664',
  );
}

export function jumToGoogleStore() {
  Linking.openURL(
    'https://play.google.com/store/apps/details?id=com.checkinproject&hl=vi',
  );
}

export const jumToRegisterPage = () => {
  Linking.openURL('https://achamcong.net/user/register');
};

export function convertDateToThu(date) {
  let indexThu = moment(date).day();
  let weekday = [
    'Chủ nhật',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
  ];
  return weekday[indexThu];
}

export function quyDoiNgayThangSangThu(day1, month1, year1) {
  if (JSON.stringify(month1).length === 1) {
    month1 = '0' + month1;
  }
  if (JSON.stringify(day1).length === 1) {
    day1 = '0' + day1;
  }
  let date = new Date(year1 + '-' + month1 + '-' + day1 + 'T00:00:00');
  let indexThu = moment(date).day();
  let weekday = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return weekday[indexThu];
}

export function quyDoiNgayThangSangThu1(date) {
  let indexThu = moment(date * 1000).day();
  let weekday = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return weekday[indexThu];
}

export function quyDoiNgayThangSangThu3(date) {
  let indexThu = moment(date * 1000).day();
  let weekday = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return weekday[indexThu];
}

export function quyDoiNgayThangSangThu4(date) {
  let indexThu = moment(date * 1000).day();
  let weekday = [
    'Chủ nhật',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
  ];
  return weekday[indexThu];
}

export function quyDoiTimeStampToDate(date) {
  return moment(date * 1000).format(configs.FORMAT_HH_MM_DATE1);
}

export function quyDoiTimeStampToTime(date) {
  return moment(date * 1000).format(configs.FORMAT_HH_MM_SS);
}

export function quyDoiTimStampToGio(date) {
  return moment(date * 1000).format(configs.FORMAT_HH_MM);
}

export function quyDoiNgayThangSangThu2(date) {
  if (date) {
    date = date.split(' ');
    date = date && date.length > 1 ? date[1] : '';
    let indexThu = moment(date).day();
    let weekday = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return weekday[indexThu];
  }
  return '';
}

export function getStartEndDayMount() {
  let startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  let endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  return {
    date_start: startOfMonth,
    date_end: endOfMonth,
  };
}

export function openWebUid(uid) {
  Linking.openURL('https://www.facebook.com/' + uid).then((supported) => {
    if (supported) {
      // Linking.openURL(this.props.url);
    } else {
      showAlert('không thể mở link: ' + 'https://www.facebook.com/' + uid);
    }
  });
}

export function getEmailInRealm() {
  let dataLogin = models.getDataLogin();
  return dataLogin.email ? dataLogin.email : '';
}

export const convertStringToDate = (format) => {
  let newDate = Moment(new Date(format * 1000)).format('MM/DD/YYYY hh:MM');
  return newDate;
};

export const convertDateNgayFromDateToDate = (valueDate) => {
  let date = new Date(valueDate);
  return convertDateFormatDateToDate(date);
};

export const convertTruGio = (time1, time2) => {
  let s = new Date(convertTimeDate1(time1)) - new Date(convertTimeDate1(time2));
  if (s > 0) {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;
    let date =
      (hrs < 10 ? '0' + hrs : hrs) +
      ':' +
      (mins < 10 ? '0' + mins : mins) +
      ':' +
      (secs < 10 ? '0' + secs : secs);
    return date;
  } else {
    return configs.timeHideOp;
  }
};
export const convertTruGio1 = (time1, time2) => {
  let s = time1 - time2;
  if (s > 0) {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;
    let date =
      (hrs < 10 ? '0' + hrs : hrs) +
      ':' +
      (mins < 10 ? '0' + mins : mins) +
      ':' +
      (secs < 10 ? '0' + secs : secs);
    return date;
  } else {
    return configs.timeHideOp;
  }
};

export const valueDate = (valueDate) => {
  let date = valueDate ? new Date(valueDate) : new Date();
  return convertDateFormatDateToDate(date);
};

export const convertDateFormatDateToDate = (valueDate) => {
  return moment(valueDate, configs.FORMAT_DATE_VN).format(configs.FORMAT_DATE);
};

export const convertTimeDate = (valueDate, format) => {
  return Moment(valueDate).format(format);
};
export const convertTimeDate1 = (string1, string2) => {
  return Moment(string1, 'hh:mm:ss');
};

export const checkDateAfterDateNow = (valueDate) => {
  return checkDateAfterDate(
    valueDate,
    dateTimeNowFormat(configs.FORMAT_DATE_VN),
    configs.FORMAT_DATE,
    configs.FORMAT_DATE_VN,
  );
};

export const dateTimeNowFormat = (format) => {
  return convertTimeDate(new Date(), format);
};

export const dateTimeLast7DayFormat = (format) => {
  return Moment().subtract(6, 'days').format(format);
};
export const dateTimeLast30DayFormat = (format) => {
  return Moment().subtract(29, 'days').format(format);
};
export const dateTimeLast90DayFormat = (format) => {
  return Moment().subtract(89, 'days').format(format);
};

export const getDateTimeLast7Day = (format = "'DD/MM/YYYY'") => {
  let day1 = Moment().subtract(1, 'days').format(format);
  let day2 = Moment().subtract(2, 'days').format(format);
  let day3 = Moment().subtract(3, 'days').format(format);
  let day4 = Moment().subtract(4, 'days').format(format);
  let day5 = Moment().subtract(5, 'days').format(format);
  let day6 = Moment().subtract(6, 'days').format(format);
  let day7 = Moment().subtract(7, 'days').format(format);

  return [day1, day2, day3, day4, day5, day6, day7];
};

export const getColorChart = () => {
  return [
    'red',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(75, 192, 192)',
    'gray',
    '#66ff33',
    '#993399',
  ];
};

export const loaiXinNghiPhep = () => {
  return [
    {
      id: 1,
      title: 'Bệnh tật, ốm đau',
      value: 1,
    },
    {
      id: 2,
      title: 'Thai sản',
      value: 2,
    },
    {
      id: 3,
      title: 'Phép năm',
      value: 3,
    },
    {
      id: 4,
      title: 'Nghỉ bù',
      value: 4,
    },
    {
      id: 5,
      title: 'Khác',
      value: 5,
    },
  ];
};

export const getDataEndStartOfMounth = () => {
  let endMount = moment(new Date()).endOf('month').format('YYYY-MM-DD');
  let startMount = moment(new Date()).startOf('month').format('YYYY-MM-DD');

  return {
    date_start: startMount,
    date_end: endMount,
  };
};

export const checkDateAfterDate = (
  valueDate1,
  valueDate2,
  formatDate1,
  formarDate2,
) => {
  var momentA = Moment(valueDate1, formatDate1, true).format();
  var momentB = Moment(valueDate2, formarDate2, true).format();
  if (momentA > momentB) {
    return 1;
  } else if (momentA < momentB) {
    return -1;
  } else {
    return 0;
  }
};

export const checkDateAfterDate1 = (
  valueDate1,
  valueDate2,
  formatDate1,
  formarDate2,
) => {
  var momentA = convertTimeDate(valueDate1, formatDate1);
  var momentB = convertTimeDate(valueDate2, formarDate2);
  if (momentA >= momentB) {
    return 1;
  } else if (momentA < momentB) {
    return -1;
  } else {
    return 1;
  }
};

export function convertToArray(objectsArray) {
  let copyOfJsonArray = Array.from(objectsArray);
  let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
  return jsonArray;
}

export function check_time(number) {
  number = parseInt(number);
  var string = '';
  if (number < 10) {
    string = '0' + number;
  } else {
    string = number;
  }
  return string;
}

export function timeConverter(UNIX_timestamp, type) {
  type = type || 0;
  if (UNIX_timestamp == 0) {
    time = 0;
  } else {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = check_time(a.getDate());
    var hours = check_time(a.getHours());
    var minus = check_time(a.getMinutes());
    var seconds = check_time(a.getSeconds());
    if (type == 0) {
      var time = date + '/' + month + '/' + year + ' ' + hours + ':' + minus;
    } else if (type == 1) {
      var time =
        date +
        '/' +
        month +
        '/' +
        year +
        ' ' +
        hours +
        ':' +
        minus +
        ':' +
        seconds;
    } else if (type == 5) {
      var time = hours + ':' + minus;
    } else if (type == 6) {
      var time = hours + ':' + minus + ':' + seconds;
    } else {
      var time = date + '/' + month + '/' + year;
    }
  }
  return time;
}
