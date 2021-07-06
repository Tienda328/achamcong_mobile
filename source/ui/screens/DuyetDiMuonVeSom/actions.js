import {ActionsType} from '../../../commons/action/index'

export function reponDuyetDiMuonVeSom(data) {
  return {
    type: ActionsType.REPON_DUYET_DI_MUON_VE_SOM,
    data: data,
  }
}

export function requestDataDuyetDiMuonVeSom(data) {
  return {
    type: ActionsType.REQUESET_DATA_DUYET_DI_MUON_VE_SOM,
    data: data,
  }
}

export function requestDataDuyetDiMuonVeSomDaDuyet(data) {
  return {
    type: ActionsType.REQUESET_DATA_DUYET_DI_MUON_VE_SOM_DA_DUYET,
    data: data,
  }
}

export function requestDataDuyetDiMuonVeSomTuChoi(data) {
  return {
    type: ActionsType.REQUESET_DATA_DUYET_DI_MUON_VE_SOM_TU_CHOI,
    data: data,
  }
}

export function requestDeleteDuyetDiMuonVeSom(data) {
  return {
    type: ActionsType.REQUESET_DELETE_DUYET_DI_MUON_VE_SOM,
    data: data,
  }
}

export function requestDeleteDuyetDiMuonVeSomChuaDuyet(data) {
  return {
    type: ActionsType.REQUESET_DELETE_DUYET_DI_MUON_VE_SOM_CHUA_DUYET,
    data: data,
  }
}