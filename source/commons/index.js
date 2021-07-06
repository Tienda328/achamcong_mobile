import {definedConfig} from './defined'
import {utils} from './utils'



const commonsConfigs = {
    ...definedConfig, 
    ...utils
}


export {
    commonsConfigs,
    utils
}
