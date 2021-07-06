import { ActionsType } from '../../../commons/action/index'

export function reponDuyetChangeShift(data) {
    return {
        type: ActionsType.RESPONSE_DUYET_CHANGE_SHIFT,
        data: data,
    }
}

export function requestDataDuyetChangeShift(data) {
    return {
        type: ActionsType.REQUESET_DATA_DUYET_CHANGE_SHIFT,
        data: data,
    }
}

export function requestDataDuyetChangeShiftDaDuyet(data) {
    return {
        type: ActionsType.REQUESET_DATA_DUYET_CHANGE_SHIFT_DA_DUYET,
        data: data,
    }
}

export function requestDataDuyetChangeShiftTuChoi(data) {
    return {
        type: ActionsType.REQUESET_DATA_DUYET_CHANGE_SHIFT_TU_CHOI,
        data: data,
    }
}

export function requestDeleteDuyetChangeShift(data) {
    return {
        type: ActionsType.REQUESET_DELETE_DUYET_CHANGE_SHIFT,
        data: data,
    }
}

export function requestDeleteDuyetChangeShiftChuaDuyet(data) {
    return {
        type: ActionsType.REQUESET_DELETE_DUYET_CHANGE_SHIFT_CHUA_DUYET,
        data: data,
    }
}