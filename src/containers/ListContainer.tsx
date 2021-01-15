import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../modules';
import { add, imgLoaded, loading, remove, replace } from '../modules/list';
import List from '../components/list';
import { IphotoObject } from '../interface/index';

function ListContainer () {
    // 상태를 조회합니다. 상태를 조회 할 때에는 state 의 타입을 RootState 로 지정해야합니다.
    const photos = useSelector((state: RootState) => state.list.photoList);
    const active = useSelector((state: RootState) => state.list.active);
    const init_loaded_cnt = useSelector((state: RootState) => state.list.init_loaded_cnt);
    const init = useSelector((state: RootState) => state.list.init);
    const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다
  
    // 각 액션들을 디스패치하는 함수들을 만들어줍니다
    const onAdd = (photos:IphotoObject[]) => {
      dispatch(add(photos));
    };
  
    const onRemove = (idx:number) => {
      dispatch(remove(idx));
    };
  
    const onReplace = (photo: IphotoObject) => {
      dispatch(replace(photo));
    };

    const onLoading = (active: boolean) => {
      dispatch(loading(active))
    }

    const onImgLoaded = () => {
      dispatch(imgLoaded())
    }
  
    return (
      <List
        photos={photos}
        active={active}
        init_loaded_cnt={init_loaded_cnt}
        init={init}
        onAdd={onAdd}
        onRemove={onRemove}
        onReplace={onReplace}
        onLoading={onLoading}
        onImgLoaded={onImgLoaded}
      />
    );
  };
  
  export default ListContainer;