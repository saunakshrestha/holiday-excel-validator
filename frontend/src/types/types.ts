export interface Holiday {
  date: string;
  description: string;
  // Add any other fields that your API returns
}

export interface FileUploadResponse {
  dates: string[];
  message: string;
}