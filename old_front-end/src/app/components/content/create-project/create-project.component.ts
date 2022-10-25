import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Project } from 'src/app/models/project/project.model';
import { ProjectsApiService } from 'src/app/services/api/project.api.service';
import { IpcRenderer } from 'electron';
import { Router } from '@angular/router';
import { ElectronService } from 'src/app/services/electron.service';
import * as FileActions from 'src/app/actions/file.actions'

const STYLES = (_theme: ThemeVariables) => ({
  container: {
    maxWidth: '320px'
  }
});

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  private ipc: IpcRenderer;
  isCreated: boolean = false;
  readonly classes = this.theme.addStyleSheet(STYLES);
  profileForm = new FormGroup({
    projectname: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(16)
    ]),
    imageBase64: new FormControl('', Validators.required)
  });

  get formProjectName() {
    return this.profileForm.get('projectname');
  }

  get formImageBase64() {
    return this.profileForm.get('imageBase64');
  }

  constructor(
    private store: Store<AppState>,
    private theme: LyTheme2,
    private projectService: ProjectsApiService,
    private router: Router,
    private electronService: ElectronService,
    ) {
     }

  onSubmit() {
    try {
      if (this.profileForm.valid){
        this.isCreated = true;
          let newProject = new Project({
            id: undefined,
            title: this.formProjectName.value,
            type: "project",
            icon: this.formImageBase64.value,
            active: true,
            File: File,
          });
    
          this.projectService.postProject(newProject).then( (response) => {
            this.store.dispatch(new FileActions.ChangeRoot([response.File]));
          });
        }
    } catch { 
    }
  }

  openBase64ImageLink(){
    this.electronService.remote.shell.openExternal("https://www.base64-image.de/");
  }

  ngOnInit() {
  }
}
