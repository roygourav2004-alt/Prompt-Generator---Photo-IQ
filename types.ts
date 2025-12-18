export interface DesignPromptResult {
  prompt: string;
  analysis?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface UploadedFile {
  file: File;
  previewUrl: string;
  base64: string;
}