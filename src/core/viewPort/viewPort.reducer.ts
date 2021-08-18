import {
  ViewPortState,
  VPActionTypes,
  VIEW_PORT_RESIZE_ACTION,
  ViewPortBaseState,
} from './types'
import * as viewPortUtil from './utils'
import { OrientationType } from '../../types/orientation'

function getNewViewPortState(): ViewPortBaseState {
  const width = viewPortUtil.getWidth();
  const height = viewPortUtil.getHeight();
  return {
    rotation: viewPortUtil.getRotation(),
    ratio: width / height,
    width,
    height,
    centerWidth: width / 2,
    centerHeight: height / 2,
  }
}

const initialState: ViewPortState = {
  rotation: OrientationType.LANDSCAPE,
  ratio: 1,
  width: 800,
  height: 600,
  centerWidth: 400,
  centerHeight: 300,
};

export function viewPortReducer(
  state = initialState,
  action: VPActionTypes
): ViewPortState {

  switch (action.type) {
    case VIEW_PORT_RESIZE_ACTION: {
      const newViewPortBase = getNewViewPortState();
      return {
        ...state,
        ...newViewPortBase,
      };
      return state;
    }
    default:
      return state;
  }
}