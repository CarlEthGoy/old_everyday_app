import { Action } from '@ngrx/store'
import { FileContent } from "../models/file-content/file-content.model";

export const CHANGE_CONTENT = "CHANGE_CONTENT";
export const CLEAR_CONTENT = "CLEAR_CONTENT";

export class ChangeContent implements Action {
  readonly type = CHANGE_CONTENT;
  constructor(public payload: FileContent){}
}

export class ClearContent implements Action {
  readonly type = CLEAR_CONTENT;
  constructor(){}
}

export type Actions = ChangeContent | ClearContent ;