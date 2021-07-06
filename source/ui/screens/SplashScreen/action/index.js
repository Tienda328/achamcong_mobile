import {ActionsType} from '../../../../commons/action/index'

export function requestCountImage(data) {
  // console.log("requestCountImage:   " + JSON.stringify(data))
  return {
    type: ActionsType.REQUESET_GET_COUNT_IMAGE,
    data: data,
  }
}