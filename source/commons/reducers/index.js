import { combineReducers } from 'redux';
import LoadingReducer from '../../ui/components/loading/reducer'
import LoginReducer from '../../ui/screens/LoginScreen/reducer'
import SplashReducer from '../../ui/screens/SplashScreen/reducer'
import ChenImageReducer from '../../ui/screens/ChenImageScreen/reducer.js'
import CheckInHomeReducer from '../../ui/screens/CheckInScreen/reducer.js'
import BaoCaoReducer from '../../ui/screens/BaoCaoScreen/reducer.js'
import LocBaoCaoReducer from '../../ui/screens/LocBaoCaoScreen/reducer.js'
import ChamCongReducer from '../../ui/screens/ChamCongScreen/reducer'
import DoiMatKhauReducer from '../../ui/screens/DoiMatKhauScreen/reducer'
import ThongTinNguoiDungReducer from '../../ui/screens/ThongTinNguoiDungScreen/reducer'
import ChartStatisticalReducer from '../../ui/screens/ChartStatisticalScreen/reducer'
import SettingReducer from '../../ui/screens/SettingScreen/reducer'
import DuyetDetailAllReducer from '../../ui/screens/DuyetDetailAllScreen/reducer'

import HistoryXinPhepReducer from '../../ui/screens/HistoryXinPhepScreen/reducer'
import OrderReducer from '../../ui/screens/XinPhepScreen/reducer'
import DuyetNghiPhepReducer from '../../ui/screens/DuyetNghiPhepScreen/reducer'
import DuyetDiMuonVeSomReducer from '../../ui/screens/DuyetDiMuonVeSom/reducer'
import DuyetQuenChamCongReducer from '../../ui/screens/DuyetQuenChamCongScreen/reducer'
import DuyetDiCongTacReducer from '../../ui/screens/DuyetDiCongTacScreen/reducer'
import DuyetChangeShiftReducer from '../../ui/screens/DuyetChangeShiftScreen/reducer'

const AppReducers = combineReducers({
    ui: LoadingReducer,
    LoginReducer: LoginReducer,
    SplashReducer: SplashReducer,
    ChenImageReducer: ChenImageReducer,
    CheckInHomeReducer: CheckInHomeReducer,
    BaoCaoReducer: BaoCaoReducer,
    LocBaoCaoReducer: LocBaoCaoReducer,
    ChamCongReducer: ChamCongReducer,
    DoiMatKhauReducer: DoiMatKhauReducer,
    ThongTinNguoiDungReducer: ThongTinNguoiDungReducer,
    ChartStatisticalReducer: ChartStatisticalReducer,
    SettingReducer: SettingReducer,
    DuyetDetailAllReducer: DuyetDetailAllReducer,
    HistoryXinPhepReducer: HistoryXinPhepReducer,
    OrderReducer: OrderReducer,
    DuyetNghiPhepReducer: DuyetNghiPhepReducer,
    DuyetDiMuonVeSomReducer: DuyetDiMuonVeSomReducer,
    DuyetQuenChamCongReducer: DuyetQuenChamCongReducer,
    DuyetDiCongTacReducer: DuyetDiCongTacReducer,
    DuyetChangeShiftReducer: DuyetChangeShiftReducer,
});

export default AppReducers