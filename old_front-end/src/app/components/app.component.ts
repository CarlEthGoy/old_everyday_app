import { Component, OnInit, HostListener } from '@angular/core';
import { AppState } from '../app.state';
import { Store } from '@ngrx/store';
import { File } from 'src/app/models/file/file.model'
import { FilesApiService } from '../services/api/files.api.service';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

const STYLES = (theme: ThemeVariables) => ({
  '@global': {
    body: {
      backgroundColor: theme.background.default,
      color: theme.text.default,
      fontFamily: theme.typography.fontFamily,
      margin: 0,
      direction: theme.direction
    }
  }
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);

  // #region Properties (3)
  @HostListener('window:dragleave', ['$event']) public onDragLeave(event) {
    event.target.style = '';
  }

  interval;
  root: File[];
  filesToDelete: File[];
  ticks = 0;

  // #endregion Properties (3)

  // #region Constructors (1)

  constructor(private theme: LyTheme2,
              private store: Store<AppState>,
              private filesApiService: FilesApiService){
    this.store.select('root').subscribe( res =>{
      this.root = res;
    });
    this.store.select('filesToDelete').subscribe( res =>{
      this.filesToDelete = res;
    });
  }

  // #endregion Constructors (1)

  // #region Public Methods (2)

  ngOnInit(){
    this.interval = setInterval(() => {
      this.ticks++;
      if (this.ticks % 30 == 0 && this.root){
        this.verifyChildsHasChangeAndUpdate(this.root[0]);
        this.deleteFilesInToDeleteQueue(this.filesToDelete);
      }
    }, 1000)
  }

  async deleteFilesInToDeleteQueue(filesToDelete: File[]){
     if (filesToDelete && filesToDelete.length > 0){
      filesToDelete.forEach( async ( file, index ) => {
        if (file.childs && file.childs.length >= 0){
          this.deleteFilesInToDeleteQueue(file.childs);
        }

        await this.filesApiService.deleteFiles(file).then( () =>{
        });
        await this.filesApiService.deleteFilesParent(file).then( () =>{
        });
        let indexToDelete = filesToDelete.findIndex(f => f.id == file.id);
        filesToDelete.splice(indexToDelete, 1);
      });
    } 
  }

  async verifyChildsHasChangeAndUpdate(file: File){
    if (file && (file.id == -2 || file.id == undefined)){ // new file to create
      file.id = undefined;
      await this.filesApiService.postFile(file).then(async (response) => {
        file.hasChanged = response.error;
        file.id = response.data.id;
        await this.filesApiService.postFilesParent(file).then((response) => { // Adjust link between file and his parent
          file.linkId = response != null ? response.data.id : null;
        });
      });
    }

    else if (file && file.hasChanged && file.type != "root"){ // file has changed and need to be updated
      await this.filesApiService.putFile(file).then(async (response) => {
        file.hasChanged = response.error;
        await this.filesApiService.putFilesParent(file); // Adjust link between file and his parent
      });
    }

    else if (file && file.content && file.content.hasChanged){ // file content has changed and need to be updated
      file.content.hasChanged = false;
      await this.filesApiService.putFile(file).then(async (response) => {
        file.content.hasChanged = response.error;
      });
    }

    if (file && file.childs && file.childs.length > 0){
      file.childs.forEach( (file) =>{
        this.verifyChildsHasChangeAndUpdate(file);
      });
    } 
  }

  // #endregion Public Methods (2)
}