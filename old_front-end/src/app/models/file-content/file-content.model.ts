export class FileContent{
  title: string;
  content: string;
  type: string;
  hasChanged: boolean = false;
  isExecutable: boolean = false;
  parentId: number = undefined;

  constructor(data){
    this.title = data.title.trim();;
    this.content = data.content;
    this.type = data.type;
    this.isExecutable = data.isExecutable;
    this.parentId = data.parentId;
    if (data.hasChanged){
      this.hasChanged = data.hasChanged;
    }
  }
}