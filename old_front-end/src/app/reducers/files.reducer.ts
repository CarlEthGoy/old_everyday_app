import * as FileActions from '../actions/file.actions'
import { File } from '../models/file/file.model'


export function currentFileReducer(state: File, action: FileActions.Actions) {
  switch (action.type) {
    case FileActions.CHANGE_FILE:
      state = action.payload;
      return state;
    case FileActions.DELETE_FILE:
      state = null;
      return state;
    case FileActions.FILE_HAS_CHANGED:
      action.payload.hasChanged = true;
      state = action.payload;
      return state;
    default:
      return state;
  }
}


export function rootReducer(state: File[], action: FileActions.Actions) {
  switch (action.type) {
    case FileActions.CHANGE_ROOT:
      state = action.payload;
      return state;
    default:
      return state;
  }
}

export function filesToDeleteReducer(state: File[], action: FileActions.Actions) {
  switch (action.type) {
    case FileActions.ADD_TO_DELETE_FILE:
      if (state == null || state == undefined){
        state = [];
      }
      state = [...state, ...action.payload];
      return state;
    default:
      return state;
  }
}