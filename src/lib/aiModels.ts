export interface AiModel {
  id: string;
  label: string;
}

export const AI_MODELS: AiModel[] = [
  { id: 'nvidia/nemotron-3.5-super-vl:free', label: 'NVIDIA: Nemotron 3.5 Super VL (free)' },
  { id: 'dots-studio/dots-3-note-preview:free', label: 'Dots Studio: Dots3-Note Preview (free)' },
  { id: 'nvidia/nemotron-3.5-lightning:free', label: 'NVIDIA: Nemotron 3.5 Lightning (free)' },
  { id: 'nvidia/nemotron-3.5-content-safety:free', label: 'NVIDIA: Nemotron 3.5 Content Safety (free)' },
];

export const DEFAULT_MODEL_ID = AI_MODELS[0].id;
