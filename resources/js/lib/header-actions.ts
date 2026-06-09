import type { ReactNode } from 'react';

let _headerActions: ReactNode = null;

export function setHeaderActions(actions: ReactNode) {
    _headerActions = actions;
}

export function getHeaderActions(): ReactNode {
    return _headerActions;
}
