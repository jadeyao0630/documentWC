import React, { useReducer } from 'react';

interface Iobject {
  name: string;
}

export type OptionDataState = {
  projects: Iobject[];
  tags: Iobject[];
  locations: Iobject[];
  categories: Iobject[];
};

export type Action =
  | { type: 'SET_OPTION_DATA'; key: keyof OptionDataState; data: Iobject[] }
  | { type: 'UPDATE_OPTION_ITEM'; key: keyof OptionDataState; index: number; value: string };

export const initialState: OptionDataState = {
  projects: [],
  tags: [],
  locations: [],
  categories: []
};

export const optionDataReducer = (state: OptionDataState, action: Action): OptionDataState => {
  switch (action.type) {
    case 'SET_OPTION_DATA':
      return { ...state, [action.key]: action.data };
    case 'UPDATE_OPTION_ITEM':
      return {
        ...state,
        [action.key]: state[action.key].map((item, idx) =>
          idx === action.index ? { ...item, name: action.value } : item
        )
      };
    default:
      return state;
  }
};