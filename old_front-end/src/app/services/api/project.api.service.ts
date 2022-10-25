import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings'
import { File } from 'src/app/models/file/file.model';
import { Project } from 'src/app/models/project/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsApiService {
  // #region Constructors (1)

  constructor(
    private http: HttpClient) { }

  // #endregion Constructors (1)

  // #region Public Methods (4)

  deleteProject(project: Project): Promise<boolean>{
      return new Promise( (resolve) => {
        if (project && project.id){
        this.http.delete<any>(AppSettings.API_URL + "projects/" + project.id).subscribe( (response) => {
          resolve(response.Error);
        });
      } else {
        resolve(false);
      }
      });
    }

  getProjects(): Promise<Project[]> {
    return new Promise( (resolve) => {
      this.http.get<any[]>(AppSettings.API_URL + "projects/").subscribe( (response) => {
        const projects = response.map( (item) => {
          let project = new Project(JSON.parse(item.json));
          project.id = item.id;
          project.title = item.title;
          return project;
        });
        resolve(projects);
      });
    });
  }

  postProject(project: Project): Promise<any>{
    return new Promise( (resolve) => {
      this.http.post<any>(AppSettings.API_URL + "projects/", {title:project.title, json:project.Serialize()}).subscribe( (response) => {
        resolve(response);
      });
    });
  }

  putProject(project: Project): Promise<any>{
    return new Promise( (resolve) => {
      this.http.put<any>(AppSettings.API_URL + "projects/" + project.id, {id: project.id, title:project.title, json:project.Serialize()}).subscribe( (response) => {
        resolve(response);
      });
    });
  }

  // #endregion Public Methods (4)
}