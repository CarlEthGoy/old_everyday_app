import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { File } from 'src/app/models/file/file.model';
import * as FileActions from 'src/app/actions/file.actions'
import * as ContentActions from 'src/app/actions/content.actions'

const STYLES = (_theme: ThemeVariables) => ({
  container: {
    maxWidth: '320px'
  }
});

@Component({
  selector: 'app-create-file',
  templateUrl: './create-file.component.html',
  styleUrls: ['./create-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFileComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  currentFile: File;
  isCreated: boolean = false;
  profileForm = new FormGroup({
    filename: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(16)
    ]),
    type: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required)
  });

  get formFilename() {
    return this.profileForm.get('filename');
  }

  get formType(){
    return this.profileForm.get('type');
  }

  get formColor(){
    return this.profileForm.get('color');
  }


  constructor(
    private store: Store<AppState>,
    private theme: LyTheme2,
    ) {
      this.store.select('currentFile').subscribe(res => {
        this.currentFile = res;
      });
     }

  onSubmit() {
    try {
      if (this.profileForm.valid){
        if (this.currentFile != null){
          this.isCreated = true;
          if (this.currentFile != null && this.currentFile.type === "file"){
            this.currentFile.addFile(this.formType.value, this.formFilename.value, this.formColor.value);
          } else {
            this.currentFile.addChildFile(this.formType.value, this.formFilename.value, this.formColor.value);
          }
          this.store.dispatch(new FileActions.ChangeFile(this.currentFile));
          this.store.dispatch(new ContentActions.ChangeContent(this.currentFile.content));
        }
      }
    } catch {
      
    }

  }

  ngOnInit() {
  }
}
