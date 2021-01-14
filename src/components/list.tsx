import React, { Component } from 'react';
import Photo from './photo'
import { IphotoObject } from '../interface/index';
import style from './list.module.css'
import {getGCD} from '../utils/index';
import LoadingOverlay from 'react-loading-overlay';


interface IListProps {
  photos: IphotoObject[];
  onAdd : (photos: IphotoObject[]) => void;
  onRemove: (idx: number) => void;
  onReplace: (photo: IphotoObject) => void;
}

interface IListState {
  column: number,
  active: boolean
}

class List extends Component<IListProps, IListState> {
  constructor(props: IListProps) {
    super(props);
    this.state = {
      column : 0,
      active : false

    };
    this.onDistBtnClick = this.onDistBtnClick.bind(this)
    this.onAddBtnClick = this.onAddBtnClick.bind(this)
  }

  onDistBtnClick()
  {
    this.setState({
      active : true
    })

    const res = ipcRenderer.sendSync("distribution", this.props.photos);
    console.log("sendSync to distribute in list.tsx : " + res);
    ipcRenderer.send("dist_complete", "request reload");

    this.setState({
      active : false
    })
    // console.log("sendSync to reload in list.tsx : " + res1);
  }

  onAddBtnClick()
  {
    ipcRenderer.once('chosenFile', (event, ret:{code; data;}) => {
      this.setState({
        active : true
      }, () => 
        {
          const {code, data} = ret
          switch (code) {
            case 0:
              let photos = []
              for (let idx=0, j=data.length; idx<j; idx++)
              {
                const item = data[idx];
                const {width, height} = item.size;
                const GCD = getGCD(width, height);
                const photo: IphotoObject = {
                  idx: -1,
                  width: width/GCD,
                  height: height/GCD,
                  src: `data:image/${item.ext.toLowerCase().split(".")[1]};base64,${item.data}`,
                  new: true
                }
                photos.push(photo)
              }
              this.props.onAdd(photos)
              break;
          
            default:
              break;
          }
          this.setState({
            active : false
          })
        })
      })

      this.setState({
        active : true
      })
  
      const res = ipcRenderer.sendSync("add_img", {multi: true});
      console.log("sendSync to add in list.tsx : " + res);
  
      this.setState({
        active : false
      })
  }

  componentDidMount()
  {
    this.setState({
      active : true
    })
    fetch('https://marcel2021.github.io/PhotosDatabase.json?ver='+new Date().getTime())
      .then(response => response.json())
      .then((jsonData) => {
        // jsonData is parsed json object received from url
        let initPhotos: IphotoObject[] = [];
        console.log("fetch")
        for (let i=0, j=jsonData.photos.length; i<j; i++)
        {
          const item = jsonData.photos[i]
          const photo:IphotoObject = {
            idx: i,
            src: `https://marcel2021.github.io${item.src}?ver=${+new Date().getTime()}`,
            width: item.width,
            height: item.height,
            new: false
          }
          initPhotos.push(photo)
        }
        this.props.onAdd(initPhotos)
        this.setState({
          active : false
        })
      })
      .catch((error) => {
        // handle your errors here
        console.error(error)
      })
  }

  render() {
    const {photos, onRemove, onReplace} = this.props;
    const {active} = this.state;
    const {innerWidth} = window;
    return (
      <LoadingOverlay
        active={active}
        spinner
        text='Please wait...'
        className={style.loading_overlay}
        >
          <button className={style.btn} onClick={this.onDistBtnClick}>배포</button>
          <button className={style.btn} onClick={this.onAddBtnClick}>추가</button>
          {
            photos.map( (photo, i) => {
              return (
                <Photo idx={photo.idx} src={photo.src} width={photo.width} height={photo.height} new={photo.new} onRemove={onRemove} onReplace={onReplace} key={i}></Photo>
              );
            })
          }
        </LoadingOverlay>
    )
  }
}

export default List