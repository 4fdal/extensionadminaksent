export type FileBase64 = {
  fileName: string;
  mimeType: string;
  base64: string;
};

export type UploadResponse = {
  status: boolean;
  code: number;
  message: string;
  data: {
    status: boolean;
    fileId: string;
    name: string;
    url: string;
    src: string;
    download: string;
  };
};
