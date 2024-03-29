import {Injectable} from '@angular/core';

@Injectable()
export class SpinnerService {

  private _selector:string = 'global-loading';
  private _element:HTMLElement;

  constructor() {
    this._element = document.getElementById(this._selector);
  }

  public show():void {
    this._element.style['display'] = 'block';
  }

  public hide(delay:number = 0):void {
    setTimeout(() => {
      this._element.style['display'] = 'none';
    }, delay);
  }

  public preHide(){
    let preBlock = document.getElementById('pre-loading');

    preBlock.style['display'] = 'none';
  }
}
