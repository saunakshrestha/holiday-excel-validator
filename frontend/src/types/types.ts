export interface Holiday {
  date: string;
  description: string;
  // Add any other fields that your API returns
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  holiday_dates?: string[];
  invalid_dates?: string[];
}