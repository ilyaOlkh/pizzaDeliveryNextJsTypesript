export interface PopupDetail {
    popup: {
        hash: string;
    };
}

export interface CustomPopupEvent extends CustomEvent {
    detail: PopupDetail;
}