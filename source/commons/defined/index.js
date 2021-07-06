import * as AppDefines from './AppDefines'
import * as AppColors from './AppColors'
import * as AppString from './AppString'
import * as AppDimensions from './AppDimensions'

const definedConfig = {
    ...AppDefines,
    ...AppColors,
    ...AppString,
    ...AppDimensions,
};

export {
    definedConfig,
    AppColors,
    AppDimensions,
}