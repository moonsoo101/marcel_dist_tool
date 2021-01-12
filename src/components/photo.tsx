import React, { Component } from 'react';
import { IphotoObject } from '../interface/index';


class Photo extends Component<IphotoObject> {
  constructor(props: IphotoObject) {
    super(props);
  }

  shouldComponentUpdate(nextProps:IphotoObject)
  {
    if (this.props.src === nextProps.src && this.props.width === nextProps.width && this.props.height === nextProps.height)
      return false;
    return true;  
  }

  render() {
    console.log("render");
    return (
      <img src={"https://marcel2021.github.io/" + this.props.src}></img>
    )
  }
}

export default Photo