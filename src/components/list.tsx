import React, { Component } from 'react';
import Photo from './photo'
import { IphotoObject } from '../interface/index';
import style from './list.module.css'
import {getGCD} from '../utils/index';
import LoadingOverlay from 'react-loading-overlay';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


interface IListProps {
  photos: IphotoObject[];
  active: boolean;
  init: boolean;
  init_loaded_cnt: number;
  onAdd : (photos: IphotoObject[]) => void;
  onRemove: (idx: number) => void;
  onReplace: (photo: IphotoObject) => void;
  onLoading: (active: boolean) => void;
  onImgLoaded: () => void;
}

interface IListState {
  column: number;
}

class List extends Component<IListProps, IListState> {
  constructor(props: IListProps) {
    super(props);
    this.state = {
      column : 0
    };
    this.onDistBtnClick = this.onDistBtnClick.bind(this)
    this.onAddBtnClick = this.onAddBtnClick.bind(this)
  }
  
  async onDistBtnClick()
  {
    this.props.onLoading(true)
    const res = await ipcRenderer.invoke("distribution", this.props.photos);
    const {code, message} = res;
    console.log(`sendSync to distribute in list.tsx : { code : ${code}, msg : ${message} }`);
    let confirm_title = "배포 실패", confirm_message =`배포 실패. 다시 시도해 주세요.\n 에러 메세지 : ${message}`;
    if (code === 0 )
    {
      confirm_title = "배포 성공"
      confirm_message ="배포 성공. 실 적용까지는 시간이 다소 소요될 수 있습니다.";
    }
    this.submit(confirm_title, confirm_message, code)
    console.log("써브밋")
    this.props.onLoading(false)
  }

  async onAddBtnClick()
  {
    this.props.onLoading(true)
    const ret = await ipcRenderer.invoke('add_img', {multi: true});
    const {code, data} = ret
    console.log("sendSync to add in list.tsx : " + code);
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
    this.props.onLoading(false)
  }

  async submit(title, message, code) 
  {
    confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: 'Confirm',
          onClick: async () => {
            this.props.onLoading(true)
            if ( code == 0 )
            {
              await ipcRenderer.invoke("dist_complete", "request reload");
              console.log("reload return")
            }
            this.props.onLoading(false)
            console.log("click confirm")
          }
        },
        // {
        //   label: 'No',
        //   onClick: () => alert('Click No')
        // }
      ]
    });
  }

  //after render
  componentDidMount()
  {
    this.props.onLoading(true)
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
      })
      .catch((error) => {
        // handle your errors here
        console.error(error)
      })
      .finally( () => 
      {
        this.props.onLoading(false) 
      })
  }

  render() {
    const {photos, active, init, onRemove, onReplace, onLoading, onImgLoaded} = this.props;
    const overlay_class = init ? style.loading_overlay : `${style.loading_overlay} ${style.full_height}`
    return (
      <LoadingOverlay
        active={active}
        spinner
        text='Please wait...'
        className={ overlay_class }
        >
          <button className={style.btn} onClick={this.onDistBtnClick}>배포</button>
          <button className={style.btn} onClick={this.onAddBtnClick}>추가</button>
          {
            photos.map( (photo, i) => {
              return (
                <Photo idx={photo.idx} src={photo.src} width={photo.width} height={photo.height} new={photo.new} init={init} onRemove={onRemove} onReplace={onReplace} onLoading={onLoading} onImgLoaded={onImgLoaded} key={i}></Photo>
              );
            })
          }
        </LoadingOverlay>
    )
  }
}

export default List