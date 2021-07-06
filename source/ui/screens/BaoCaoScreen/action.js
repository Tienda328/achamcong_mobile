import { ActionsType } from '../../../commons/action/index'

export function getBaoCaoTongQuan(data) {
  return {
    type: ActionsType.GET_BAO_CAO_TONG_QUAN,
    data: data,
  }
}