import { IphotoObject } from '../interface/index';
import produce from 'immer';

// 액션 타입을 선언합니다
// 뒤에 as const 를 붙여줌으로써 나중에 액션 객체를 만들게 action.type 의 값을 추론하는 과정에서
// action.type 이 string 으로 추론되지 않고 'counter/INCREASE' 와 같이 실제 문자열 값으로 추론 되도록 해줍니다.

const ADD = 'list/ADD' as const;
const REMOVE = 'list/REMOVE' as const;
const REPLACE = 'list/REPLACE' as const;

// 액션 생성함수를 선언합니다
export const add = (photos: IphotoObject[]) => ({
  type: ADD,
  payload: photos
});

export const remove = (idx: number) => ({
  type: REMOVE,
  payload: idx
});

export const replace = (photo: IphotoObject) => ({
  type: REPLACE,
  // 액션에 부가적으로 필요한 값을 payload 라는 이름으로 통일합니다
  // 이는 FSA (https://github.com/redux-utilities/flux-standard-action) 라는 규칙인데
  // 이 규칙을 적용하면 액션들이 모두 비슷한 구조로 이루어져있게 되어 추후 다룰 때도 편하고
  // 읽기 쉽고, 액션 구조를 일반화함으로써 액션에 관련돤 라이브러리를 사용 할 수 있게 해줍니다.
  // 다만, 무조건 꼭 따를 필요는 없습니다.
  payload: photo
});

// 모든 액션 겍체들에 대한 타입을 준비해줍니다.
// ReturnType<typeof _____> 는 특정 함수의 반환값을 추론해줍니다
// 상단부에서 액션타입을 선언 할 떄 as const 를 하지 않으면 이 부분이 제대로 작동하지 않습니다.
type ListAction =
  | ReturnType<typeof add>
  | ReturnType<typeof remove>
  | ReturnType<typeof replace>;

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
type ListState = {
  photoList: IphotoObject[];
  last_idx: number;
};

// 초기상태를 선언합니다.
const initialState: ListState = {
  photoList: [],
  last_idx: -1
};

// 리듀서를 작성합니다.
// 리듀서에서는 state 와 함수의 반환값이 일치하도록 작성하세요.
// 액션에서는 우리가 방금 만든 CounterAction 을 타입으로 설정합니다.
function list(
  state: ListState = initialState,
  action: ListAction
): ListState {
  switch (action.type) {
    case "list/ADD": // case 라고 입력하고 Ctrl + Space 를 누르면 어떤 종류의 action.type들이 있는지 확인 할 수 있습니다.
      return produce(state, draft => {
        let photoObjects:IphotoObject[] = action.payload;
        for (let i=0, j=photoObjects.length; i<j; i++)
        {
          let photoObject = photoObjects[i];
          photoObject.idx = state.last_idx + i + 1;
          draft.photoList.push(photoObject)
        }
        
        draft.last_idx = state.last_idx + photoObjects.length;
      });
    case "list/REMOVE":
      return produce(state, draft => {
        const index:number = draft.photoList.findIndex(photo => photo.idx === action.payload);
        draft.photoList.splice(index, 1)
      });
    case "list/REPLACE":
      return produce(state, draft => {
        const index = draft.photoList.findIndex(photo => photo.idx === action.payload.idx);
        let photoObject:IphotoObject = action.payload;
        draft.photoList[index] = photoObject;
      });
    default:
      return state;
  }
}

export default list;