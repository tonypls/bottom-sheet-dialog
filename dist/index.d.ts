export type SnapPoint = number;
interface BottomSheetEvents {
    onOpen?: () => void;
    onClose?: () => void;
    onSnap?: (snapIndex: number) => void;
}
export interface BottomSheetProps extends BottomSheetEvents {
    snapPoints?: SnapPoint[];
    backgroundColor?: string;
    excludeElement?: HTMLElement;
}
export declare function createBottomSheet(element: HTMLElement, props: BottomSheetProps): {
    snapTo: (snapIndex: number) => void;
    destroy: () => void;
};
export {};
