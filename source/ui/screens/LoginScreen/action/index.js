import {ActionsType} from '../../../../commons/action/index'

export function requestIsLogin(data) {
  return {
    type: ActionsType.REQUESET_IS_LOGIN,
    data: data,
  }
}

export function requestCreateTrial(data) {
  return {
    type: ActionsType.REQUESET_CREATE_TRIAL,
    data: data,
  }
}