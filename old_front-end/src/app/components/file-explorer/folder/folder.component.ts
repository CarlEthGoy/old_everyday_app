import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as FileActions from 'src/app/actions/file.actions'
import * as ContentActions from 'src/app/actions/content.actions'

import { File } from 'src/app/models/file/file.model';
import { UiHelperService } from 'src/app/services/ui-helper.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { FileContent } from 'src/app/models/file-content/file-content.model';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  // #region Properties (5)

  currentFile: File;
  @Input() file: File;
  @Input() files: File[];
  @ViewChild(ContextMenuComponent, null) public folderMenu: ContextMenuComponent;
  isRoot: boolean;

  // #endregion Properties (5)

  // #region Constructors (1)

  constructor(
    private store: Store<AppState>,
    private uiHelper: UiHelperService) { 
      store.select('currentFile').subscribe( res =>{
        this.currentFile = res;
      });
    }

  // #endregion Constructors (1)

  // #region Public Methods (14)

  activateRenaming(target: any){
    target.removeAttribute('readonly');
    target.select();
  }

  addChildFile(item: File){
    let createFileContent = new FileContent({   
      title: "",
      content: "",
      type: "create-file",
      hasChanged: false,
      isExecutable: false,
      parentId: item.id 
    });
    this.store.dispatch(new FileActions.ChangeFile(item));
    this.store.dispatch(new ContentActions.ChangeContent(createFileContent));
  }

  addChildFolder(item: File){
    let createFileContent = new FileContent({   
      title: "",
      content: "",
      type: "create-folder",
      hasChanged: false,
      isExecutable: false,
      parentId: item.id 
    });
    this.store.dispatch(new FileActions.ChangeFile(item));
    this.store.dispatch(new ContentActions.ChangeContent(createFileContent));
  }

/*   addFile(item: File){
    item.addFile("file");
  } */

  addExternalFile(item: File) {
    item.addChildFile("google");
  }

/*   addFolder(item: File){
    item.addFile("folder");
  } */

  changeFile(){
    if (this.file.isOpen && this.file.childs && this.file.childs.length > 0){
      // Open first file of folder
      let nextChildFile = this.file.findNextChild();
      this.store.dispatch(new FileActions.ChangeFile(nextChildFile));
      if (nextChildFile){
        this.store.dispatch(new ContentActions.ChangeContent(nextChildFile.content));
      }
    } else if (!this.file.isOpen){
      this.store.dispatch(new FileActions.ChangeFile(null));
      this.store.dispatch(new ContentActions.ClearContent());
    }
  }

  deactivateRenaming(target: any){
    target.readOnly = true;
    if (this.file.title != target.value){
      this.file.fileHasChanged();
      this.file.title = target.value;
    }
  }

  delete(item: File){
    item.deleteItSelf();
  }

  dragDrop(event){
    let position = this.uiHelper.determinePosition(event, this.file.type);
    if (this.currentFile.moveTo(this.file, position)){
      this.fileHasChanged();
    }
    this.uiHelper.dragDrop(event);
  }

  dragOver(event){
    this.uiHelper.dragOver(event, this.file.type);
  }

  dragStart(event){
    this.store.dispatch(new FileActions.ChangeFile(this.file));
    event.dataTransfer.setData("text/plain", "");
  }

  fileHasChanged(){
    this.store.dispatch(new FileActions.FileHasChanged(this.file));
  }

  ngOnInit() {
    this.isRoot = this.file.type == "root";
  }

  openFolder(){
    this.file.isOpen = !this.file.isOpen;
  }

  // #endregion Public Methods (14)
}
