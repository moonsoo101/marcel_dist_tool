import React, { Component } from 'react';
import { IphotoObject } from '../interface/index';
import style from './photo.module.css'
import {getGCD} from '../utils/index';


interface IPhotoProps extends IphotoObject {
  onRemove: (idx: number) => void;
  onReplace: (photo: IphotoObject) => void;
}

interface IPhotoState {
  column: number
}

class Photo extends Component<IPhotoProps, IPhotoState> {
  constructor(props: IPhotoProps) {
    super(props);
    this.state = {
      column: 1
    }

    window.addEventListener('resize', ()=>{
      this.setColumn()
    });

    this.onReplaceBtnClick = this.onReplaceBtnClick.bind(this)
  }

  shouldComponentUpdate(nextProps:IPhotoProps, nextState:IPhotoState)
  {
    if (this.props.src === nextProps.src && this.props.width === nextProps.width && this.props.height === nextProps.height && this.state.column === nextState.column)
      return false;
    return true;  
  }

  componentDidMount()
  {
    this.setColumn()
  }

  setColumn() 
  {
    let col = 1;

    if (window.innerWidth > 1200)
      col = 3
    else if (window.innerWidth > 650)
      col = 2;

    this.setState({
      column: col
    })
  }

  onReplaceBtnClick()
  {
    ipcRenderer.once('chosenFile', (event, ret:{code; data;}) => {
      const {code, data} = ret
      switch (code) {
        case 0:
          const item = data[0]
          const {width, height} = item.size;
          const GCD = getGCD(width, height);
          const photo: IphotoObject = {
            idx: this.props.idx,
            width: width/GCD,
            height: height/GCD,
            src: `data:image/${item.ext.toLowerCase().split(".")[1]};base64,${item.data}`,
            new: true
          }
          this.props.onReplace(photo)
          break;
      
        default:
          break;
      }
    })
    const res = ipcRenderer.sendSync("add_img", {multi : false});
    console.log("sendSync to replace in photo.tsx : " + res);
  }

  render() {
    const {column} = this.state
    return (
      <div className={style.container} style={{width:`${100/column}%`}}>
        {/* <img src={this.props.src} style={{width: this.props.window_width, height: this.props.window_height}}></img> */}
        <img src={this.props.src}></img>
        <button className={style.btn} style={{top: "0.3%", left: "0.3%"}} onClick={()=>this.props.onRemove(this.props.idx)}>삭제</button>
        <button className={style.btn} style={{top: "0.3%", left: "12.8%"}} onClick={this.onReplaceBtnClick}>교체</button>
      </div>
    )
  }
}

export default Photo