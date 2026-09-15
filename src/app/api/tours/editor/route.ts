import {
  deleteEditorTour,
  saveEditorTour,
  setEditorTourStatus
} from '@/features/tour-editor/server';

export const POST = saveEditorTour;
export const PATCH = setEditorTourStatus;
export const DELETE = deleteEditorTour;
