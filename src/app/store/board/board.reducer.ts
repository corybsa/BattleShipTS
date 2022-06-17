import { createReducer, on } from '@ngrx/store';
import { Helper } from 'src/app/models/utils/helper';
import { Board } from '../../models/board/board';
import { setBoard } from './board.actions';

export interface BoardState {
    name: string;
    board: Board;
}

export const initialState: BoardState = {
    name: null,
    board: null
};

export const boardReducer = createReducer(
    initialState,
    on(setBoard, (state, { name, board }) => {
        const newState: BoardState = Helper.copy(state);
        newState.name = name;
        newState.board = board;

        return newState;
    })
);
