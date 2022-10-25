import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings'
import { File } from 'src/app/models/file/file.model';

@Injectable({
  providedIn: 'root'
})
export class FilesApiService {
  // #region Constructors (1)

  constructor(
    private http: HttpClient) { }

  // #endregion Constructors (1)

  // #region Public Methods (8)

  deleteFiles(file: File): Promise<boolean>{
      return new Promise( (resolve) => {
        if (file && file.id){
        this.http.delete<any>(AppSettings.API_URL + "files/" + file.id).subscribe( (response) => {
          resolve(response.Error);
        });
      } else {
        resolve(false);
      }
      });
    }

  deleteFilesParent(file: File): Promise<boolean>{
      return new Promise( (resolve) => {
        if (file && file.parent && file.id){
        this.http.delete<any>(AppSettings.API_URL + "files-parents/" + file.linkId).subscribe( (response) => {
          resolve(response.Error);
        });
      } else {
        resolve(false);
      }
      });
    }

  getFiles(): Promise<File[]> {
    return new Promise( (resolve) => {
      this.http.get<any[]>(AppSettings.API_URL + "files/").subscribe( (response) => {
        const files = response.map( (item) => {
          let file = new File(JSON.parse(item.json));
          file.id = item.id;
          file.title = item.title;
          file.project_id = item.project_id;
          return file;
        });
        resolve(files);
      });
    });
  }

  getFilesByProjectId(projectId: number): Promise<File[]> {
    return new Promise( (resolve) => {
      this.http.get<any[]>(AppSettings.API_URL + "files/" + projectId).subscribe( (response) => {
        const files = response.map( (item) => {
          let file = new File(JSON.parse(item.json));
          file.id = item.id;
          file.title = item.title;
          file.project_id = item.project_id;
          return file;
        });
        resolve(files);
      });
    });
  }

  getFilesChilds(): Promise<any[]> {
    return new Promise( (resolve) => {
      this.http.get<any[]>(AppSettings.API_URL + "files-parents/").subscribe( (response) => {
        const file = response;
        resolve(file);
      });
    });
  }

  getFilesChildsByProjectId(projectId: number): Promise<any[]> {
    return new Promise( (resolve) => {
      this.http.get<any[]>(AppSettings.API_URL + "files-parents/" + projectId).subscribe( (response) => {
        const file = response;
        resolve(file);
      });
    });
  }

  postFile(file: File): Promise<any>{
    return new Promise( (resolve) => {
      let fileToCreate = new File({
        childs: null,
        content: file.content,
        hasChanged: false,
        iconColor: file.iconColor,
        id: undefined,
        index: file.index,
        isFavorite: file.isFavorite,
        isOpen: file.isOpen,
        linkId: file.linkId,
        parent: null,
        title: file.title,
        titleColor: file.titleColor,
        type: file.type,
        store: null,
        project_id: file.project_id
      });

      this.http.post<any>(AppSettings.API_URL + "files/", {title:fileToCreate.title, project_id: fileToCreate.project_id, json:fileToCreate.Serialize()}).subscribe( (response) => {
        resolve(response);
      });
    });
  }

  postFilesParent(file: File): Promise<any> {
      return new Promise( (resolve) => {
        if (file && file.parent && file.id){
        this.http.post<any>(AppSettings.API_URL + "files-parents/", { id: file.linkId, parent_id: file.parent.id, file_id: file.id }).subscribe( (response) => {
          resolve(response);
        });
      } else {
        resolve(-2);
      }
    });
  }

  putFile(file: File): Promise<any>{
    return new Promise( (resolve) => {
      let fileToUpdate = new File({
        childs: null,
        content: file.content,
        hasChanged: false,
        iconColor: file.iconColor,
        id: file.id,
        index: file.index,
        isFavorite: file.isFavorite,
        isOpen: file.isOpen,
        linkId: file.linkId,
        parent: null,
        title: file.title,
        titleColor: file.titleColor,
        type: file.type,
        store: null,
        project_id: file.project_id
      });
      this.http.put<any>(AppSettings.API_URL + "files/" + file.id, {id: fileToUpdate.id, title:fileToUpdate.title, project_id: fileToUpdate.project_id, json:fileToUpdate.Serialize()}).subscribe( (response) => {
        resolve(response);
      });
    });
  }

  putFilesParent(file: File): Promise<any> {
      return new Promise( (resolve) => {
        if (file && file.parent && file.id){
          this.http.put<any>(AppSettings.API_URL + "files-parents/" + file.linkId, { id: file.linkId, parent_id: file.parent.id, file_id: file.id }).subscribe( (response) => {
            resolve(response);
          });
        } else {
          resolve(false);
        }
      });
    }

  // #endregion Public Methods (8)
}