import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { ContentComponent } from './components/content/content.component';
import { FileComponent } from './components/file-explorer/file/file.component';
import { FolderComponent } from './components/file-explorer/folder/folder.component';
import { StoreModule } from '@ngrx/store';
import { currentContentReducer } from './reducers/content.reducer';
import { currentFileReducer } from './reducers/files.reducer';
import { filesToDeleteReducer } from './reducers/files.reducer';
import { UiHelperService } from './services/ui-helper.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';
import { FileContentComponent } from './components/content/file-content/file-content.component';
import { FolderContentComponent } from './components/content/folder-content/folder-content.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { GoogleContentComponent } from './components/content/google-content/google-content.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { rootReducer } from './reducers/files.reducer';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { Routing } from './routing/routing';
import { LoginComponent } from './components/login/login.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { CreateFolderComponent } from './components/content/create-folder/create-folder.component';
import { CreateFileComponent } from './components/content/create-file/create-file.component';
import { LyThemeModule, LyTheme2, StyleRenderer, LY_THEME, LY_THEME_NAME } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { AlyleImport, CustomMinimaDark } from 'src/style/alyle-import';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateProjectComponent } from './components/content/create-project/create-project.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    FileExplorerComponent,
    ContentComponent,
    FileComponent,
    FolderComponent,
    FileContentComponent,
    FolderContentComponent,
    GoogleContentComponent,
    HomeComponent,
    LoginComponent,
    CreateFolderComponent,
    CreateFileComponent,
    CreateProjectComponent,

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    CKEditorModule,
    StoreModule.forRoot({
      currentContent: currentContentReducer,
      currentFile: currentFileReducer,
      filesToDelete: filesToDeleteReducer,
      root: rootReducer
    }),
    ContextMenuModule.forRoot({
      autoFocus: true,
    }),
    FormsModule,
    HttpClientModule,
    Routing,
    AlyleImport,
    LyThemeModule.setTheme('minima-dark'),
  ],
  providers: [
    AuthGuard,
    UiHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true},
    /** Add themes */
    [ LyTheme2 ],
    [ StyleRenderer ],
    // Theme that will be applied to this module
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: `minima-dark`
    { provide: LY_THEME, useClass: CustomMinimaDark, multi: true }, // name minima-dark
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
