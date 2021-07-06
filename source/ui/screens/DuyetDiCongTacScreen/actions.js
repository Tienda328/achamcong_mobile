import { ActionsType } from '../../../commons/action/index'

export function reponDuyetDiCongTac(data) {
    return {
        type: ActionsType.REPON_DUYET_DI_CONG_TAC,
        data: data,
    }
}

export function requestDataDuyetDiCongTac(data) {
    return {
        type: ActionsType.REQUESET_DATA_DUYET_DI_CONG_TAC,
        data: data,
    }
}

export function requestDataDuyetDiCongTacDaDuyet(data) {
    return {
        type: ActionsType.REQUESET_DATA_DUYET_DI_CONG_TAC_DA_DUYET,
        data: data,
    }
}

export function requestDataDuyetDiCongTacTuChoi(data) {
    return {
        type: ActionsType.REQUESET_DATA_DUYET_DI_CONG_TAC_TU_CHOI,
        data: data,
    }
}

export function requestDeleteDuyetDiCongTac(data) {
    return {
        type: ActionsType.REQUESET_DELETE_DUYET_DI_CONG_TAC,
        data: data,
    }
}

export function requestDeleteDuyetDiCongTacChuaDuyet(data) {
    return {
        type: ActionsType.REQUESET_DELETE_DUYET_DI_CONG_TAC_CHUA_DUYET,
        data: data,
    }
}