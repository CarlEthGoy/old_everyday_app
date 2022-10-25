
import { File } from '../../models/file/file.model';

export class Project{
  id: number;
  title: string;
  type: string;
  icon: string;
  active: boolean;
  File: File;

  constructor(data){
    this.id = data.id;
    this.title = data.title.trim();;
    this.type = data.type;
    this.icon = data.icon;
    this.active = data.active;
    this.File = data.File;
  }

  Serialize(){
    return JSON.stringify ({ id: this.id, title: this.title, type: this.type, icon: this.icon, active:this.active } );
  }
}
