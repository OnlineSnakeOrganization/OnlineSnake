import SinglePlayerLogic, { SnakeSegment } from "../SinglePlayerLogic";

export interface ControllerInterface{
    document: Document;
    logic: SinglePlayerLogic;
    keyDownListener: (key: KeyboardEvent) => void;
    keyUpListener: (key: KeyboardEvent) => void;
    moveHead(head: SnakeSegment): void;
    enable(): void;
    disable(): void;
}