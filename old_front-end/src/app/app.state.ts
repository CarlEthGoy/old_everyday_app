import { FileContent } from "./models/file-content/file-content.model"
import { File } from './models/file/file.model'

export interface AppState{
  readonly currentContent: FileContent;
  readonly currentFile: File;
  readonly root: File[];
  readonly filesToDelete: File[];
}