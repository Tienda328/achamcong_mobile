import {ActionsType} from '../../../commons/action/index'

export function requestIsCreateFolderImage(data) {
  return {
    type: ActionsType.REQUESET_IS_CREATE_FOLDER_IMAGE,
    data: data,
  }
}