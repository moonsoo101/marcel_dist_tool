import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../modules';
import { add, remove, replace } from '../modules/list';
import List from '../components/list';
import { IphotoObject } from '../interface/index';

function ListContainer () {
    // 상태를 조회합니다. 상태를 조회 할 때에는 state 의 타입을 RootState 로 지정해야합니다.
    const photos = useSelector((state: RootState) => state.list.photoList);
    const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다
  
    // 각 액션들을 디스패치하는 함수들을 만들어줍니다
    const onAdd = (photo:IphotoObject) => {
      dispatch(add(photo));
    };
  
    const onRemove = (idx:number) => {
      dispatch(remove(idx));
    };
  
    const onReplace = (photo: IphotoObject) => {
      dispatch(replace(photo));
    };
  
    return (
      <List
        photos={photos}
        onAdd={onAdd}
        onRemove={onRemove}
        onReplace={onReplace}
      />
    );
  };
  
  export default ListContainer;

// class List extends Component {
//     const photos = useSelector((state: RootState) => state.list.idx)
//     // componentWillMount()
//     // {
//     //   // this.setState({
//     //   //   name: "ssibal",
//     //   //   photos: [
//     //   //     {
//     //   //     'src' :'https://marcel2021.github.io/assets/imgs/main.jpg',
//     //   //     'width' : 4,
//     //   //     'height' :4
//     //   //     }
//     //   //   ]
//     //   // })
//     //   // ?ver='+new Date().getTime()
//     //   fetch('https://marcel2021.github.io/PhotosDatabase.json?ver='+new Date().getTime())
//     //   .then(response => response.json())
//     //   .then((jsonData) => {
//     //     // jsonData is parsed json object received from url
//     //     this.setState({
//     //       name: "ssibal",
//     //       photos: jsonData.photos
//     //     })
//     //     console.log(jsonData)
//     //   })
//     //   .catch((error) => {
//     //     // handle your errors here
//     //     console.error(error)
//     //   })
  
//     // }
  
//     // onClick() {
//     //   this.setState((previousState, props) => ({
//     //     toggle: !previousState.toggle,
//     //   }));
//     //   fetch('https://marcel2021.github.io/PhotosDatabase.json?ver='+new Date().getTime())
//     //   .then(response => response.json())
//     //   .then((jsonData) => {
//     //     // jsonData is parsed json object received from url
//     //     console.log(jsonData)
//     //   })
//     //   .catch((error) => {
//     //     // handle your errors here
//     //     console.error(error)
//     //   })
//     // }
  
//     render() {
//       const {name, photos} = this.state;
//       console.log("render");
//       return (
//         <div>
//           {
//             this.state.photos.map( (photo, i) => {
//               return (
//                 <Photo src={photo.src} width={photo.width} height={photo.height} key={i}></Photo>
//               );
//             })
//           }
//         </div>
//       )
//     }
//   }
  
//   export default List