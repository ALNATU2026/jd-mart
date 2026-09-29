import { ref, uploadBytesResumable, getDownloadURL, deleteObject, storage } from './firebase';

export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export interface UploadedFileMetadata {
  storagePath: string;
  downloadURL: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploaderId: string;
  uploadedAt: string;
}

const DEFAULT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const DEFAULT_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

export function validateFile(file: File, options?: FileValidationOptions): { valid: boolean; error?: string } {
  const maxBytes = (options?.maxSizeMB || 10) * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size exceeds maximum permitted limit of ${options?.maxSizeMB || 10}MB (current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`,
    };
  }

  const allowed = options?.allowedTypes || [...DEFAULT_IMAGE_TYPES, ...DEFAULT_DOC_TYPES];
  if (!allowed.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type || 'unknown'}" is not supported. Allowed formats: ${allowed.map((t) => t.split('/')[1]).join(', ')}.`,
    };
  }

  return { valid: true };
}

export type StorageCategory =
  | 'user-profile'
  | 'product-image'
  | 'seller-document'
  | 'job-attachment'
  | 'employee-cv'
  | 'order-file';

export async function uploadAppFile(
  file: File,
  category: StorageCategory,
  entityId: string,
  uploaderId: string,
  onProgress?: (percent: number) => void
): Promise<UploadedFileMetadata> {
  const validation = validateFile(file, {
    maxSizeMB: category === 'employee-cv' || category === 'seller-document' ? 15 : 8,
    allowedTypes:
      category === 'user-profile' || category === 'product-image'
        ? DEFAULT_IMAGE_TYPES
        : [...DEFAULT_IMAGE_TYPES, ...DEFAULT_DOC_TYPES],
  });

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

  let pathPrefix = '';
  switch (category) {
    case 'user-profile':
      pathPrefix = `users/${uploaderId}/profile`;
      break;
    case 'product-image':
      pathPrefix = `products/${entityId}/images`;
      break;
    case 'seller-document':
      pathPrefix = `sellers/${entityId}/documents`;
      break;
    case 'job-attachment':
      pathPrefix = `jobs/${entityId}/attachments`;
      break;
    case 'employee-cv':
      pathPrefix = `users/${uploaderId}/cv`;
      break;
    case 'order-file':
      pathPrefix = `orders/${entityId}/files`;
      break;
    default:
      pathPrefix = `uploads/${uploaderId}`;
  }

  const fullPath = `${pathPrefix}/${timestamp}-${sanitizedName}`;
  const storageRef = ref(storage, fullPath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        uploaderId,
        entityId,
        category,
        originalName: file.name,
      },
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const metadata: UploadedFileMetadata = {
            storagePath: fullPath,
            downloadURL,
            originalName: file.name,
            mimeType: file.type,
            sizeBytes: file.size,
            uploaderId,
            uploadedAt: new Date().toISOString(),
          };
          resolve(metadata);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

export async function deleteAppFile(storagePath: string): Promise<void> {
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}
