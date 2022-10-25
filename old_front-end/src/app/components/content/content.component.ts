import { Component, OnInit, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as ContentActions from 'src/app/actions/content.actions'

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  contentType: string;
  
  constructor(private store: Store<AppState>) {
    store.select('currentContent').subscribe( res =>{
      this.contentType = this.determineTypeOfContent(res);
    });
   }

  ngOnInit() {
  }

  determineTypeOfContent(toBeDetermined: any): string {
    if (!toBeDetermined){
      return "invalid";
    }

    if(toBeDetermined.type === "file"){
      return "file-content";
    }
    else if(toBeDetermined.type === "folder"){
      return "folder-content";
    } 
    else if(toBeDetermined.type === "google"){
      return "google-content";
    }
    else if(toBeDetermined.type === "create-folder"){
      return "create-folder";
    }
    else if(toBeDetermined.type === "create-file"){
      return "create-file";
    }
    else if(toBeDetermined.type === "create-project"){
      return "create-project";
    }

    return "invalid";
  }
}