import SinglePlayerLogic, { SnakeSegment } from "../../logic/SinglePlayerLogic";

export interface ControllerInterface{
    document: Document;
    logic: SinglePlayerLogic;
    keyDownListener: (key: KeyboardEvent) => void;
    keyUpListener: (key: KeyboardEvent) => void;
    moveHead(head: SnakeSegment): void;
    enable(): void;
    disable(): void;
}