
export interface ControllerInterface{
    document: Document;
    keyDownListener: (key: KeyboardEvent) => void;
    keyUpListener: (key: KeyboardEvent) => void;
    enable(): void;
    disable(): void;
}