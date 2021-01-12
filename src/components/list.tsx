import React, { Component, useState } from 'react';
import Photo from './photo'
import { IphotoObject } from '../interface/index';


interface IListProps {
  photos: IphotoObject[];
  onAdd : (photo: IphotoObject) => void;
  onRemove: (idx: number) => void;
  onReplace: (photo: IphotoObject) => void;
}

interface IListState {
  
}

class List extends Component<IListProps, IListState> {
  constructor(props: IListProps) {
    super(props);
  }
  // componentWillMount()
  // {
  //   // this.setState({
  //   //   name: "ssibal",
  //   //   photos: [
  //   //     {
  //   //     'src' :'https://marcel2021.github.io/assets/imgs/main.jpg',
  //   //     'width' : 4,
  //   //     'height' :4
  //   //     }
  //   //   ]
  //   // })
  //   // ?ver='+new Date().getTime()
  //   fetch('https://marcel2021.github.io/PhotosDatabase.json?ver='+new Date().getTime())
  //   .then(response => response.json())
  //   .then((jsonData) => {
  //     // jsonData is parsed json object received from url
  //     this.setState({
  //       name: "ssibal",
  //       photos: jsonData.photos
  //     })
  //     console.log(jsonData)
  //   })
  //   .catch((error) => {
  //     // handle your errors here
  //     console.error(error)
  //   })

  // }

  // onClick() {
  //   this.setState((previousState, props) => ({
  //     toggle: !previousState.toggle,
  //   }));
  //   fetch('https://marcel2021.github.io/PhotosDatabase.json?ver='+new Date().getTime())
  //   .then(response => response.json())
  //   .then((jsonData) => {
  //     // jsonData is parsed json object received from url
  //     console.log(jsonData)
  //   })
  //   .catch((error) => {
  //     // handle your errors here
  //     console.error(error)
  //   })
  // }

  render() {
    const {photos, onAdd, onRemove, onReplace} = this.props;
    return (
      <div>
        <button onClick={()=>onAdd({idx:-1, src:"/assets/imgs/main.jpg",width:5,height:5})}>추가</button>
        <button onClick={()=>onAdd({idx:-1, src:"/assets/imgs/main.jpg",width:5,height:5})}>삭제</button>
        {
          photos.map( (photo, i) => {
            return (
              <Photo idx={photo.idx} src={photo.src} width={photo.width} height={photo.height} key={i}></Photo>
            );
          })
        }
      </div>
    )
  }
}

export default List