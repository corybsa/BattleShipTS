import { createAction, props } from "@ngrx/store";
import { Board } from "src/app/models/board/board";

export const setBoard = createAction(
    '[Board] Set Board',
    props<{ name: string, board: Board }>()
);
