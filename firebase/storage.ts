import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";

// Upload an image and get its download URL
export const uploadImage = async (
  uri: string,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Convert URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create storage reference
    const storageRef = ref(storage, path);

    // Upload to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          // Handle errors
          reject(new Error(`Upload failed: ${error.message}`));
        },
        async () => {
          // Upload complete, get download URL
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error: any) {
            reject(new Error(`Failed to get download URL: ${error.message}`));
          }
        }
      );
    });
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Delete an image by its URL or path
export const deleteImage = async (urlOrPath: string): Promise<void> => {
  try {
    let imagePath = urlOrPath;

    // If a full URL is provided, extract the path
    if (urlOrPath.startsWith("http")) {
      const storageUrl = storage.toString();
      imagePath = urlOrPath.replace(`${storageUrl}/`, "");
      // Extract path from URL by decoding the component after the last slash
      const parts = imagePath.split("/o/");
      if (parts.length > 1) {
        imagePath = decodeURIComponent(parts[1].split("?")[0]);
      }
    }

    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
  } catch (error: any) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};
