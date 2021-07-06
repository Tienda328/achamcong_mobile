import {ActionsType} from '../../../commons/action/index'

export function requestChangePass(data) {
  return {
    type: ActionsType.REQUESET_CHANGE_PASSWORD,
    data: data,
  }
}