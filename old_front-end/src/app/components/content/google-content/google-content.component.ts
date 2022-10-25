import { IpcRenderer } from 'electron';
import { AppState } from 'src/app/app.state';
import { FileContent } from 'src/app/models/file-content/file-content.model';
import { Component, HostListener, OnInit, SecurityContext, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeValue } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ElectronService } from 'src/app/services/electron.service';
declare var $:any;

@Component({
  selector: 'app-google-content',
  templateUrl: './google-content.component.html',
  styleUrls: ['./google-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleContentComponent implements OnInit {
  // #region Properties (5)

  private ipc: IpcRenderer;

  content: FileContent;
  pageHeight: number;
  pageWidth: number;
  url: SafeResourceUrl;

  // #endregion Properties (5)

  // #region Constructors (1)

  constructor(
    private store: Store<AppState>, 
    private sanitizer: DomSanitizer,
    private electronService: ElectronService) {
    this.store.select('currentContent').subscribe( res => {
      this.content = res;

      // TODO: Temp fix for switching url in iframe...???
      $("#url").focus();
      $("#url").blur();
      if (this.content){
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.content.content);
      }
    });
    if ((<any>window) != null && (<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
  }

  // #endregion Constructors (1)

  // #region Public Methods (8)

  getHeight(){
    return Math.max(window.innerHeight) - 25;
  }

  getWidth() {
    return Math.max(window.innerWidth) - 308;
  }

  ngOnInit() { 
    this.pageWidth = this.getWidth();
    this.pageHeight = this.getHeight();
    if (this.content){
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.content.content);
    }
  }

  onChange() {
    this.content.hasChanged = true;
    if (this.content){
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.content.content);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.pageWidth = this.getWidth();
    this.pageHeight = this.getHeight();
  }

  openFile(){
/*     if ((<any>window) != null && (<any>window).require) {
      this.ipc.send("openFile", this.content.content);
    } */
    if (this.electronService.isElectron){
      console.log("Opening file.");
      this.electronService.remote.shell.openItem(this.content.content);
    } else {
      console.log("Feature is not available.");
    }
  }

  showDialog(){
    if ((<any>window) != null && (<any>window).require) {
      this.ipc.on('asynchronous-reply', (event, arg) => {
        this.content.content = arg;
      })
      this.ipc.send('asynchronous-message')
    }
  }

  // #endregion Public Methods (8)
}
