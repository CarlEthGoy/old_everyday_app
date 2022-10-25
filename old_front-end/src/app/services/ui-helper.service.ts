import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiHelperService {
  // #region Constructors (1)

  constructor() { }

  // #endregion Constructors (1)

  // #region Public Methods (4)

  determinePosition(event, type): Positions {
    let cursorPos = event.pageY;
    let itemHeight = event.target.offsetHeight;
    let itemTop = event.target.offsetTop;
    // Over
    if (cursorPos < itemTop + 1) {
      return Over;
    }
    // Under
    else if (cursorPos > itemTop + itemHeight - 1) {
      return Under;
    }
    // First quarter
    else if (cursorPos < itemTop + itemHeight / 4 && !(cursorPos > itemTop + ((itemHeight - (itemHeight / 4))))) {
      return FirstQuarter;
    }
    // Last quarter
    else if (cursorPos > itemTop + itemHeight / 4 && !(cursorPos < itemTop + ((itemHeight - (itemHeight / 4))))) {
      return LastQuarter;
    }
    // Center
    else {
      if (type == "folder") {
        return Center;
      }
    }
  }

  dragDrop(event){
    event.target.style = "background-color: none; border: none;";
  }

  dragOver(event, type){
    event.preventDefault();
    
    if (event.target.className == "material-icons"){
      return;
    }

    if (type == "root"){
      event.target.style = "background-color: white; color: black;";
      return;
    }

    let position = this.determinePosition(event, type);
    // First quarter
    if (position == FirstQuarter){
      event.target.style = "border-top: 1px solid white;";
    }
    // Last quarter
     else if (position == LastQuarter){
      event.target.style = "border-bottom: 1px solid white;";
    }
    // Center
    else {
      if (type == "folder"){
        event.target.style = "background-color: white; color: black;";
      } else {
        event.target.style = "border-bottom: 1px solid white;";
      }
    }
  }

  // #endregion Public Methods (4)
}

export type Positions = Under | Over | FirstQuarter | LastQuarter | Center;
export class Under{}
export class Over{}
export class FirstQuarter{}
export class LastQuarter{}
export class Center{}