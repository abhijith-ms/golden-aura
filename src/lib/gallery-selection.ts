export type GallerySelection = {
  active: number;
  requested: number;
  requestId: number;
  loading: boolean;
  error: boolean;
  versions: Record<number, number>;
};

export const initialGallerySelection: GallerySelection = {
  active: 0,
  requested: 0,
  requestId: 0,
  loading: false,
  error: false,
  versions: { 0: 0 },
};

type GalleryAction =
  | { type: "select"; index: number }
  | { type: "loaded" | "failed"; index: number; requestId: number };

export function gallerySelection(
  state: GallerySelection,
  action: GalleryAction,
): GallerySelection {
  if (action.type === "select") {
    const requestId = state.requestId + 1;
    const loading = action.index !== state.active || (state.error && state.requested === state.active);
    return {
      ...state,
      requested: action.index,
      requestId,
      loading,
      error: false,
      versions: loading ? { ...state.versions, [action.index]: requestId } : state.versions,
    };
  }

  // A slower, superseded request must never replace the latest selection.
  if (action.index !== state.requested || action.requestId !== state.versions[action.index]) return state;
  return {
    ...state,
    active: action.type === "loaded" ? action.index : state.active,
    loading: false,
    error: action.type === "failed",
  };
}
