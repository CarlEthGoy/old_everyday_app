import { Component, OnInit, HostListener } from '@angular/core';
import { File } from '../../models/file/file.model';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit {
  // #region Properties (3)

  files: File[] = [];
  filesBackup: File[] = [];
  searchText: string = "";
  pageHeight: number;

  // #endregion Properties (3)

  // #region Constructors (1)

  constructor(
    private store: Store<AppState>,
    ) { 
      this.store.select('root').subscribe( res =>{
        this.files = res;
        this.filesBackup = res;
      });
    }

  // #endregion Constructors (1)

  // #region Public Methods (3)

  filterChilds(file: File, searchText: string){
    if (file.childs && file.childs.length > 0){
      file.childs.forEach( (childFile) => {
        this.filterChilds(childFile, searchText);
      });
    }
    if (file.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1){
      this.files.push(file);
    }
  }

  filterFiles(){
    if (this.searchText.length > 3){
      this.files = [];
      this.filterChilds(this.filesBackup[0], this.searchText);
    } else {
      this.files = this.filesBackup;
    }
  }  
  
  getHeight(){
    return Math.max(window.innerHeight) - 25;
  }

  ngOnInit() {
    this.pageHeight = this.getHeight();
  }
  
  @HostListener('window:resize')
  onResize() {
    this.pageHeight = this.getHeight();
  }
  // #endregion Public Methods (3)
}