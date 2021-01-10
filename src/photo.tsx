import React, { Component } from 'react';

interface IListProps {
  src: string;
  width: number;
  height: number;
}

class Photo extends Component<IListProps> {
  constructor(props: IListProps) {
    super(props);
  }

  render() {
    console.log("render");
    return (
      <img src={"https://marcel2021.github.io/" + this.props.src}></img>
    )
  }
}

export default Photo