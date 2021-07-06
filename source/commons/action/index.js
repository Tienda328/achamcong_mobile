import * as ActionsType from './ActionsType';
import * as LoadingAction from '../../ui/components/loading/action';
import * as LoginActisons from '../../ui/screens/LoginScreen/action';
import * as SplashActisons from '../../ui/screens/SplashScreen/action';
import * as ChenImageActisons from '../../ui/screens/ChenImageScreen/action';
import * as CheckInActisons from '../../ui/screens/CheckInScreen/action';
import * as BaoCaoActisons from '../../ui/screens/BaoCaoScreen/action';
import * as LocBaoCaoActisons from '../../ui/screens/LocBaoCaoScreen/action';
import * as ChamCongActisons from '../../ui/screens/ChamCongScreen/action';
import * as DoiMatKhauActisons from '../../ui/screens/DoiMatKhauScreen/action';
import * as ThongTinNguoiDungActisons from '../../ui/screens/ThongTinNguoiDungScreen/action';
import * as ChartStatisticalActisons from '../../ui/screens/ChartStatisticalScreen/action';
import * as SettingActisons from '../../ui/screens/SettingScreen/actions';
import * as DuyetDetailAllActisons from '../../ui/screens/DuyetDetailAllScreen/actions';
import * as HistoryXinPhepActisons from '../../ui/screens/HistoryXinPhepScreen/actions';
import * as XinPhepActisons from '../../ui/screens/XinPhepScreen/action';
import * as DuyetNghiPhepActisons from '../../ui/screens/DuyetNghiPhepScreen/actions';
import * as DuyetDiMuonVeSomActisons from '../../ui/screens/DuyetDiMuonVeSom/actions';
import * as DuyetDiCongTacActisons from '../../ui/screens/DuyetDiCongTacScreen/actions';
import * as DuyetChangeShiftActions from '../../ui/screens/DuyetChangeShiftScreen/actions';
import * as DuyetQuenChamCongActions from '../../ui/screens/DuyetQuenChamCongScreen/action';

const actions = {
  ...LoginActisons,
  ...LoadingAction,
  ...SplashActisons,
  ...ChenImageActisons,
  ...CheckInActisons,
  ...BaoCaoActisons,
  ...LocBaoCaoActisons,
  ...ChamCongActisons,
  ...DoiMatKhauActisons,
  ...ThongTinNguoiDungActisons,
  ...ChartStatisticalActisons,
  ...SettingActisons,
  ...DuyetDetailAllActisons,
  ...HistoryXinPhepActisons,
  ...XinPhepActisons,
  ...DuyetNghiPhepActisons,
  ...DuyetDiMuonVeSomActisons,
  ...DuyetDiCongTacActisons,
  ...DuyetChangeShiftActions,
  ...DuyetQuenChamCongActions,
};

export {actions, ActionsType};
