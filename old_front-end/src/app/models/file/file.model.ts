import { FileContent } from "../file-content/file-content.model";
import { Positions, Over, Under, FirstQuarter, LastQuarter, Center } from 'src/app/services/ui-helper.service';
import * as FileActions from '../../actions/file.actions'
import * as ContentActions from '../../actions/content.actions'
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FocusKeyManager } from '@angular/cdk/a11y';

export class File{
  // #region Properties (15)

  childs?: File[];
  content?: FileContent;
  hasChanged: boolean = false;
  iconColor: string = "#fafafa";
  id: number;
  index: number;
  isFavorite: boolean = false;
  isOpen: boolean = false;
  linkId: number;
  parent?: File;
  project_id: number;
  store?: Store<AppState>;
  title: string;
  titleColor: string = "#fafafa";
  type: string;

  // #endregion Properties (15)

  // #region Constructors (1)

  //userId: number;
  constructor(data){
    this.iconColor = data.iconColor;
    this.id = data.id;
    this.title = data.title.trim();
    this.type = data.type;
    this.parent = data.parent;
    this.childs = data.childs;
    this.content = data.content;
    this.index = data.index;
    this.titleColor = data.titleColor;
    this.isOpen = data.isOpen;
    this.linkId = data.linkId;
    this.project_id = data.project_id;
    this.store = data.store;
    this.hasChanged = data.hasChanged;
    if (data.type === "folder" && this.content){
      this.content = data.childs;
    }
  }

  // #endregion Constructors (1)

  // #region Public Methods (13)

  Serialize(){
    return JSON.stringify(this);
  }

  addChildFile(fileType: string, name?: string, color?: string){
    if (this.type === "root" || this.type === "folder"){
      let lastElement = 0;

      if (this.childs.length > 0){
        lastElement = this.childs.length;
      }

      // Add new element to the end of the current folder
      let newFile = new File({
        id: -2,
        index: lastElement,
        title: name != null ? name : "New" + fileType,
        type: fileType === 'google' ? 'file' : fileType,
        parent: this,
        store: this.store,
        childs: fileType === 'file' || fileType === 'google' ? null : [],
        content: fileType === 'file' || fileType === 'google' ? new FileContent ({title: " ", content: " ", type: fileType, hasChanged: false}) : null,
        hasChanged: false,
        project_id: this.project_id,
        iconColor: color ? color : '#fafafa'
      });
      this.fileHasChanged();
      this.childs.push(newFile);
    }
  }

  addFile(fileType: string, name?: string, color?: string){
    if (this.parent){
      let currentPosition = this.index;
      
      this.parent.increaseParentIndexesGreaterEquals(currentPosition);

      // Add new element to the end of the current folder
      let newFile = new File({
        id: undefined,
        index: currentPosition + 1,
        title: name != null ? name : "New" + fileType,
        type: fileType === 'google' ? 'file' : fileType,
        parent: this.parent,
        store: this.store,
        childs: fileType === 'file' || fileType === 'google' ? null : [],
        content: fileType === 'file' || fileType === 'google' ? new FileContent ({title: " ", content: " ", type: fileType, hasChanged: false}) : null,
        hasChanged: false,
        project_id: this.project_id,
        iconColor: color ? color : '#fafafa'
      });
      this.fileHasChanged();
      this.parent.childs.push(newFile);
    }
  }

  changeTitle(newTitle: string){
    if (this.title != newTitle ){
      this.title = newTitle;
      this.fileHasChanged();
    }
  }

  decreaseParentIndexesGreaterEquals(index: number){
    this.fileHasChanged();
    if (this.parent && this.parent.childs && this.parent.childs.length > 0){
      this.parent.childs.forEach ( (file) => {
        if (file.index >= index){
          file.index--;
          file.hasChanged = true;
        }
      });
    }
  }

  decreaseIndexesGreaterEquals(index: number){
    this.fileHasChanged();
    if (this && this.childs && this.childs.length > 0){
      this.childs.forEach ( (file) => {
        if (file.index >= index){
          file.index--;
          file.hasChanged = true;
        }
      });
    }
  }

  defineNewIndex(isRoot: boolean, position: Positions, destination:File){
    let newIndex = 0;
    // Define the new index to order properly
    if (!isRoot && position == Over || position == FirstQuarter){ // above
      newIndex = destination.index;
    } else if (!isRoot && position == Under || position == LastQuarter){ // under
      newIndex = destination.index + 1;
    } else { // inside
      if (destination && destination.type != "file" && destination.childs){ // inside a folder
        newIndex = destination.childs.length;
      } else {  // inside a file is gonna be under by default since file cant contain another file yet
        newIndex = destination.index + 1;
      }
    }

    return newIndex;
  }

  deleteItSelf(){
    if (this.type !== "root" && this.parent && this.parent){
      // Delete childs
      if (this.childs && this.childs.length > 0){
        this.childs.forEach( (child) =>{
          child.deleteItSelf();
        });
      }

      // Delete itself
      this.fileHasChanged();
      this.increaseParentIndexesGreaterEquals(this.index);
      this.store.dispatch(new FileActions.DeleteFile(this));
      this.store.dispatch(new ContentActions.ClearContent());
      this.store.dispatch(new FileActions.AddToDeleteFile([this]));
      let index = this.parent.childs.findIndex(c => c.id == this.id);
      this.parent.childs.splice(index, 1);
    }
  }

  // Determine if it's trying to move inside a child file/folder. (recursive)
  fileHasChanged(){
    this.hasChanged = true;
    if (this.store){
      this.store.dispatch(new FileActions.FileHasChanged(this));
    }
  }

  findNextChild(){
    if (this.childs && this.childs.length > 0 ){
      let firstChildFile: File;
      for (let i = 0; i < this.childs.length; i++){
        if (this.childs[i].type === "file"){
          firstChildFile = this.childs[i];
          break;
        }
      }
      if (firstChildFile){
        return firstChildFile;
      }
    }
    return null;
  }

  increaseParentIndexesGreaterEquals(index: number){
    this.fileHasChanged();
    if (this.parent && this.parent.childs && this.parent.childs.length > 0){
      this.parent.childs.forEach ( (file) => {
        if (file.index >= index){
          file.index++;
          file.hasChanged = true;
        }
      });
    }
  }

  increaseParentIndexesGreater(index: number){
    this.fileHasChanged();
    if (this.parent && this.parent.childs && this.parent.childs.length > 0){
      this.parent.childs.forEach ( (file) => {
        if (file.index > index){
          file.index++;
          file.hasChanged = true;
        }
      });
    }
  }

  increaseIndexesGreaterEquals(index: number){
    this.fileHasChanged();
    if (this && this.childs && this.childs.length > 0){
      this.childs.forEach ( (file) => {
        if (file.index >= index){
          file.index++;
          file.hasChanged = true;
        }
      });
    }
  }

  isChild(file: File): boolean{
    if (file == this){
      return true 
    } else if (file.parent){
      return this.isChild(file.parent);
    }

    return false;
  }

  // move this to file
  moveTo(file: File, position: Positions): boolean{
    if (file == null || this == null){
      return false;
    }

    let isRoot = file.type === "root";
    let isSame = (file == this || file.parent == this);
    let isChild = this.isChild(file);

    if (isChild){
      return false;
    }

    this.fileHasChanged();
    let newIndex = this.defineNewIndex(isRoot, position, file);
    // take the delete in consideration
    if (file.type !== 'folder' && file.parent == this.parent && this.index < file.index){ 
      newIndex--;
      file.increaseParentIndexesGreater(newIndex);
    } else if (file.type === 'folder') {
      file.increaseIndexesGreaterEquals(newIndex);
    } else {
      file.increaseParentIndexesGreaterEquals(newIndex);
    }

    this.decreaseParentIndexesGreaterEquals(this.index);

    this.index = newIndex;

    if (isRoot) {
      // Remove from source parent
      let index = this.parent.childs.indexOf(this);
      this.parent.childs.splice(index, 1);

      // Add to destination parent
      file.childs.push(this);
      this.parent = file;
    } else if (!isSame) { // Cannot move inside itself or child
      // Remove from source parent
      let index = this.parent.childs.indexOf(this);
      this.parent.childs.splice(index, 1);

      // Add to destination parent
      if (file.type === "folder"){
        if (position == Center){
          this.parent = file;
          file.childs.push(this);
        } else {
          this.parent = file.parent;
          file.parent.childs.push(this);
        }
      } else {
        this.parent = file.parent;
        file.parent.childs.push(this);
      }
    }

    // Sort source parent and destination parent
    if (file.parent){
      file.parent.childs = file.parent.childs.sort( (n1, n2) => n1.index - n2.index);
    }

    this.parent.childs = this.parent.childs.sort( (n1, n2) => n1.index - n2.index);
    
    return true;
  }

  sortChilds(n1: File, n2:File): number{
    if ( n1.index > n2.index){
      return 1;
    }
    if ( n1.index < n2.index ){
      return -1;
    }

    return 0;
  }

  // #endregion Public Methods (13)
}