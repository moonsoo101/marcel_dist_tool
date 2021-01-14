import React, { Component, useState } from 'react';
import Photo from './photo'
import { IphotoObject } from '../interface/index';
import style from './list.module.css'
import { codePointAt } from 'core-js/fn/string';
import {getGCD} from '../utils/index';


interface IListProps {
  photos: IphotoObject[];
  onAdd : (photos: IphotoObject[]) => void;
  onRemove: (idx: number) => void;
  onReplace: (photo: IphotoObject) => void;
}

interface IListState {
  column: number
}

class List extends Component<IListProps, IListState> {
  constructor(props: IListProps) {
    super(props);
    this.state = {
      column : 0
    };
    this.onClick = this.onClick.bind(this)
  }

  onClick()
  {
    ipcRenderer.once('chosenFile', (event, ret:{code; data;}) => {
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
    })
    const res = ipcRenderer.sendSync("add_img", {multi: true});
    console.log("sendSync to add in list.tsx : " + res);
  }

  componentDidMount()
  {
    fetch('https://marcel2021.github.io/PhotosDatabase.json?ver='+new Date().getTime())
      .then(response => response.json())
      .then((jsonData) => {
        // jsonData is parsed json object received from url
        let initPhotos: IphotoObject[] = [];
        for (let i=0, j=jsonData.photos.length; i<j; i++)
        {
          const item = jsonData.photos[i]
          const photo:IphotoObject = {
            idx: i,
            src: `https://marcel2021.github.io${item.src}`,
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
  }

  render() {
    const {photos, onRemove, onReplace} = this.props;
    const {innerWidth} = window;
    return (
      <div>
        <button className={style.btn} onClick={this.onClick}>추가</button>
        {
          photos.map( (photo, i) => {
            return (
              <Photo idx={photo.idx} src={photo.src} width={photo.width} height={photo.height} new={photo.new} onRemove={onRemove} onReplace={onReplace} key={i}></Photo>
            );
          })
        }
      </div>
    )
  }
}

export default List