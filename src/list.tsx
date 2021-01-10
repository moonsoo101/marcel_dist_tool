import React, { Component, useState } from 'react';
import Photo from './photo'

interface photoObject {
  src: string;
  width: number;
  height: number;
}

interface IListProps {

}

interface IListState {
  photos: Array<photoObject>;
  name : string;
}

class List extends Component<IListProps, IListState> {
  constructor(props: IListProps) {
    super(props);
    this.state = {
      photos:[],
      name:"name"
    }

  }
  componentWillMount()
  {
    fetch('https://marcel2021.github.io/PhotosDatabase.json?ver='+new Date().getTime())
    .then(response => response.json())
    .then((jsonData) => {
      // jsonData is parsed json object received from url
      this.setState({
        name: "ssibal",
        photos: jsonData.photos
      })
      console.log(jsonData)
    })
    .catch((error) => {
      // handle your errors here
      console.error(error)
    })

  }

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
    const {name, photos} = this.state;
    console.log("render");
    return (
      <div>
        {
          this.state.photos.map( (photo, i) => {
            return (
              <Photo src={photo.src} width={photo.width} height={photo.height} key={i}></Photo>
            );
          })
        }
      </div>
    )
  }
}

export default List