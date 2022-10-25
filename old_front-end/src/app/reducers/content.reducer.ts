import { FileContent } from "../models/file-content/file-content.model";
import * as ContentActions from '../actions/content.actions'

export function currentContentReducer(state: FileContent, action: ContentActions.Actions) {
  switch (action.type) {
    case ContentActions.CHANGE_CONTENT:
      state = action.payload;
      return state;
    case ContentActions.CLEAR_CONTENT:
      state = null;
    default:
      return state;
  }
}