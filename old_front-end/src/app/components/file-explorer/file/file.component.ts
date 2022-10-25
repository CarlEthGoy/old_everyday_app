import { ContextMenuComponent } from 'ngx-contextmenu';
import * as ContentActions from 'src/app//actions/content.actions';
import * as FileActions from 'src/app//actions/file.actions';
import { AppState } from 'src/app/app.state';
import { File } from 'src/app/models/file/file.model';
import { FilesApiService } from 'src/app/services/api/files.api.service';
import { UiHelperService } from 'src/app/services/ui-helper.service';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FileContent } from 'src/app/models/file-content/file-content.model';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  // #region Properties (3)

  currentFile: File;
  @Input() file: File;
  @ViewChild(ContextMenuComponent, null) public folderMenu: ContextMenuComponent;

  // #endregion Properties (3)

  // #region Constructors (1)

  constructor(
    private store: Store<AppState>,
    private uiHelper: UiHelperService,
    private filesApiService: FilesApiService,
  ) {
    this.store.select('currentFile').subscribe(res => {
      this.currentFile = res;
    });
  }

  // #endregion Constructors (1)

  // #region Public Methods (14)

  activateRenaming(target: any) {
    target.removeAttribute('readonly');
    target.select();
  }

  addExternalFile(item: File) {
    item.addFile("google");
  }

  addFile(item: File) {
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

  addFolder(item: File) {
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

  async changeFileAndContent(){
    await this.changeFile();
    await this.updateContent();
  }

  changeFile() {
    this.store.dispatch(new FileActions.ChangeFile(this.file));
  }

  clearContent() {
    this.store.dispatch(new ContentActions.ClearContent());
  }

  copyMessage(val: File) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val.content.content;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  deactivateRenaming(target: any) {
    target.readOnly = true;
    this.file.changeTitle(target.value);
  }

  delete(item: File) {
    if (item) {
      item.deleteItSelf();
    }
  }

  dragDrop(event) {
    let position = this.uiHelper.determinePosition(event, this.file.type);
    this.currentFile.moveTo(this.file, position);
    this.uiHelper.dragDrop(event);
  }

  dragOver(event) {
    this.uiHelper.dragOver(event, this.file.type);
  }

  dragStart(event) {
    this.store.dispatch(new FileActions.ChangeFile(this.file));
    event.dataTransfer.setData("text/plain", "");
  }

  ngOnInit() {}

  updateContent() {
    this.store.dispatch(new ContentActions.ChangeContent(this.file.content));
  }

  // #endregion Public Methods (14)
}
