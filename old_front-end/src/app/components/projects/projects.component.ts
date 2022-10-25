import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project/project.model';
import { ProjectsApiService } from 'src/app/services/api/project.api.service';
import { FilesApiService } from 'src/app/services/api/files.api.service';
import { File } from '../../models/file/file.model';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { FileContent } from 'src/app/models/file-content/file-content.model';
import * as FileActions from '../../actions/file.actions'
import * as ContentActions from 'src/app/actions/content.actions'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  // #region Properties (2)

  files: File[] = [];
  projects: Project[] = [];
  links: any[] = [];
  store: Store<AppState>;

  // #endregion Properties (2)

  // #region Constructors (1)

  constructor(
    private projectsApiService: ProjectsApiService,    
    private filesApiService: FilesApiService,
    private _store: Store<AppState>,
    ) {
      this.store = _store;
      this.store.select('root').subscribe( res =>{
        this.loadProjectAndFiles(false);
      });
  }
 
  // #endregion Constructors (1)

  // #region Public Methods (4)

  async ngOnInit() {
    await this.loadProjectAndFiles();
  }

  async loadProjectAndFiles(setProject: boolean = true){
    await this.projectsApiService.getProjects().then( ( projects ) => {
      this.projects = projects;
     });
     this.projects.forEach( async ( project ) => {
       let files: File[] = await this.filesApiService.getFilesByProjectId(project.id);
       let links: any[] =  await this.filesApiService.getFilesChildsByProjectId(project.id);

      await this.reconstructFileTreeFromList(project, files, links).then((response) => {
        project.File = response;
      });

      if (setProject){
        this.setFileExplorer(this.projects[0]);
      }
      
    });

    if (this.projects.length <= 0){
      let content = new FileContent({
        title: "",
        content: "",
        type: "create-project",
        hasChanged: false,
        isExecutable: false,
        parentId: undefined,
      });
      this.store.dispatch(new ContentActions.ChangeContent(content));
    }
  }


  async reconstructFileTreeFromList(project: Project, files: File[], links: any[]): Promise<File> {
    return new Promise((resolve) => {
      let root = new File({ id: 0, index: -1, title: project.title, store: this.store, project_id: project.id, type: "root", isOpen: true, parent: null, childs: [], content: new FileContent({ title: "", content: "", type: "folder" }) });
      // Assign parent to each file

      files.forEach((file) => {
        if (file.type === "folder" || file.type === "root") {
          file.childs = [];
          file.store = this.store;
        }

        file.store = this.store;
        links.forEach((link) => {
          if (file.id == link['file_id'] && link['parent_id'] == 0) { // Parent is Root case
            file.parent = root;
          }
          if (file.parent == null && file.id == link['file_id']) { // Parent is a Sub folder or Sub File case
            file.linkId = link['id'];
            file.parent = files.find(f => f.id == link['parent_id']);
          }
        });
      });

      files.push(root);

      // Assign childs to each file
      files.forEach((file) => {
        if (file.parent) {
          let parentFile = files.find(f => f.id == file.parent.id);
          parentFile.childs.push(file);
        }
      });
      this.sortTreeRoot(root);
      resolve(root);
    });
  }

   // Sort Complete Tree (recursive)
   sortTreeRoot(file: File) {
      if (file.childs && file.childs.length > 0){
        file.childs = file.childs.sort( (n1, n2) => n1.index - n2.index);
        this.sortTree(file.childs);
      }
  }

  // Sort Complete Tree (recursive)
  sortTree(files: File[]) {
    files.forEach( ( file ) => {
      if (file.childs && file.childs.length > 0){
        file.childs = file.childs.sort( (n1, n2) => n1.index - n2.index);
        this.sortTree(file.childs);
      }
    });
  }

  setFileExplorer(project: Project){
    this.projects.forEach( (project) =>{
      project.active = false;
    });
    project.active = true;
    this.store.dispatch(new FileActions.ChangeRoot([project.File]));
  }

  onAddProjectClick(){
    let content = new FileContent({
      title: "",
      content: "",
      type: "create-project",
      hasChanged: false,
      isExecutable: false,
      parentId: undefined,
    });
    this.store.dispatch(new ContentActions.ChangeContent(content));
  }

  // #endregion Public Methods (4)
}
