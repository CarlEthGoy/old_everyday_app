import { Action } from '@ngrx/store'
import { File } from '../models/file/file.model';

export const CHANGE_FILE = "CHANGE_FILE";
export const FILE_HAS_CHANGED = "FILE_HAS_CHANGED";
export const CHANGE_ROOT = "CHANGE_ROOT";
export const DELETE_FILE = "DELETE_FILE";
export const ADD_TO_DELETE_FILE = "ADD_TO_DELETE_FILE";
export const FILE_TO_CREATE = "ADD_FILE_TO_CREATE"

export class ChangeFile implements Action {
  readonly type = CHANGE_FILE;
  constructor(public payload: File){}
}

export class FileHasChanged implements Action{
  readonly type = FILE_HAS_CHANGED;
  constructor(public payload: File){}
}

export class ChangeRoot implements Action{
  readonly type = CHANGE_ROOT;
  constructor(public payload: File[]){}
}


export class DeleteFile implements Action{
  readonly type = DELETE_FILE;
  constructor(public payload: File){}
}

export class AddToDeleteFile implements Action{
  readonly type = ADD_TO_DELETE_FILE;
  constructor(public payload: File[]){}
}


export type Actions = ChangeFile | FileHasChanged | ChangeRoot | DeleteFile | AddToDeleteFile ;