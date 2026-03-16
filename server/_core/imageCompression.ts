/**
 * Image compression helper using sharp
 * Automatically compresses images before uploading to S3
 */

import sharp from "sharp";

export type CompressionOptions = {
  quality?: number; // 1-100, default 80
  maxWidth?: number; // max width in pixels, default 1200
  maxHeight?: number; // max height in pixels, default 1200
  format?: "jpeg" | "png" | "webp"; // output format
};

/**
 * Compress an image buffer
 * @param imageBuffer - The image buffer to compress
 * @param options - Compression options
 * @returns Compressed image buffer and metadata
 */
export async function compressImage(
  imageBuffer: Buffer,
  options: CompressionOptions = {}
): Promise<{
  buffer: Buffer;
  format: string;
  size: number;
  width: number;
  height: number;
}> {
  const {
    quality = 80,
    maxWidth = 1200,
    maxHeight = 1200,
    format = "webp",
  } = options;

  try {
    // Get original image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Calculate dimensions while maintaining aspect ratio
    let width = originalWidth;
    let height = originalHeight;

    if (width > maxWidth || height > maxHeight) {
      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;
      const ratio = Math.min(widthRatio, heightRatio);

      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    // Compress the image
    let pipeline = sharp(imageBuffer)
      .resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      });

    // Apply format-specific compression
    if (format === "jpeg") {
      pipeline = pipeline.jpeg({ quality, progressive: true });
    } else if (format === "png") {
      pipeline = pipeline.png({ compressionLevel: 9 });
    } else if (format === "webp") {
      pipeline = pipeline.webp({ quality });
    }

    const compressedBuffer = await pipeline.toBuffer();

    return {
      buffer: compressedBuffer,
      format,
      size: compressedBuffer.length,
      width,
      height,
    };
  } catch (error) {
    throw new Error(
      `Image compression failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Compress multiple images in parallel
 * @param imageBuffers - Array of image buffers
 * @param options - Compression options
 * @returns Array of compressed images
 */
export async function compressImages(
  imageBuffers: Buffer[],
  options: CompressionOptions = {}
): Promise<
  Array<{
    buffer: Buffer;
    format: string;
    size: number;
    width: number;
    height: number;
  }>
> {
  return Promise.all(
    imageBuffers.map((buffer) => compressImage(buffer, options))
  );
}

/**
 * Get compression statistics
 * @param originalSize - Original image size in bytes
 * @param compressedSize - Compressed image size in bytes
 * @returns Compression statistics
 */
export function getCompressionStats(
  originalSize: number,
  compressedSize: number
): {
  originalSize: number;
  compressedSize: number;
  reduction: number;
  reductionPercent: number;
} {
  const reduction = originalSize - compressedSize;
  const reductionPercent = (reduction / originalSize) * 100;

  return {
    originalSize,
    compressedSize,
    reduction,
    reductionPercent: Math.round(reductionPercent * 100) / 100,
  };
}
