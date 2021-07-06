import { AppString } from '.'
import { Dimensions } from 'react-native'
import DeviceInfo from 'react-native-device-info';
export const APP_NAME = 'A Chấm Công';

// export const DOMAIN = 'https://achamcong.net/' 
// export const DOMAIN = 'https://test.achamcong.net/' //server test
export const DOMAIN = 'https://api.achamcong.net/' 
// export const DOMAIN = 'http://192.168.21.110:8000' 
export const VERSION_APP = DeviceInfo.getVersion()

export const AsyncIsCheDoAdmin = "AsyncIsCheDoAdmin"

const { height, width } = Dimensions.get('window');
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 592;

export const FORMAT_HH_MM_DATE_VN = 'HH:mm:ss DD/MM/YYYY'
export const FORMAT_HH_MM = 'HH:mm'
export const FORMAT_HH_MM_SS = 'HH:mm:ss'
export const FORMAT_DATE_YYYY_MM_DD = 'YYYY/MM/DD'
export const FORMAT_DATE_VN = 'DD/MM/YYYY'
export const FORMAT_DATE = 'YYYY-MM-DD'
export const FORMAT_HH_MM_DATE = 'HH:mm:ss YYYY-MM-DD'
export const FORMAT_HH_MM_DATE1 = 'YYYY-MM-DD HH:mm:ss'


const scale = size => width / guidelineBaseWidth * size;
export const verticalScale = size => height / guidelineBaseHeight * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const FILTER_TO_DAY = { index: 0, label: "Hôm nay", value: "1" }
export const FILTER_LAST_7_DAY = { index: 1, label: "7 ngày gần đây", value: "2" }
export const FILTER_LAST_30_DAY = { index: 2, label: "30 ngày gần đây", value: "3" }
export const FILTER_LAST_90_DAY = { index: 3, label: "90 ngày gần đây", value: "4" }
export const FILTER_OPTION = { index: 4, label: "Tùy chọn", value: "5" }

export const DateOptionsFilterData = [
    FILTER_TO_DAY,
    FILTER_LAST_7_DAY,
    FILTER_LAST_30_DAY,
    FILTER_LAST_90_DAY,
    FILTER_OPTION,
]