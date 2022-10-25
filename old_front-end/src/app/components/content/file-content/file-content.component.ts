import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FileContent } from "src/app/models/file-content/file-content.model";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as Editor from 'src/ckeditor.js';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { createTypeLiteralNode } from 'typescript';

@Component({
  selector: 'app-file-content',
  templateUrl: './file-content.component.html',
  styleUrls: ['./file-content.component.scss']
})
export class FileContentComponent implements OnInit {
  // #region Properties (4)

  Editor = Editor;
  content: FileContent;
  @ViewChild('editor', {static: false}) editorComponent: CKEditorComponent;
  isFirst: boolean = true;
  
  // #endregion Properties (4)

  // #region Constructors (1)

  constructor(private store: Store<AppState>) {
    store.select('currentContent').subscribe( res => {
      this.content = res;
      this.isFirst = true;
    });
   }

  // #endregion Constructors (1)

  // #region Public Methods (6)

  getEditor() {
    return this.editorComponent.editorInstance;
  }

  ngOnInit() {
  }

  onChange( { editor }: ChangeEvent ) {
    this.content.hasChanged = true && !this.isFirst;
    this.isFirst = false;
  }

  @HostListener('document:keydown.tab', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    let editor = this.getEditor();
    editor.execute('indentBlock');
    event.preventDefault();
  }

  @HostListener('document:keydown.shift.backspace', ['$event']) onKeydownHandler2(event: KeyboardEvent) {
    let editor = this.getEditor();
    if (document.activeElement.tagName == 'DIV'){
      editor.execute('outdentBlock');
    }
    event.preventDefault();
  }

  @HostListener('document:keydown.shift.tab', ['$event']) onKeydownHandler3(event: KeyboardEvent) {
    let editor = this.getEditor();
    if (document.activeElement.tagName == 'DIV'){
      editor.execute('outdentBlock');
    }
    event.preventDefault();
  }

  // #endregion Public Methods (6)
}
