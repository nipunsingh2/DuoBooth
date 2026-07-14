import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { CapturedPhoto, GridLayout } from '@/types';
import { ExportFormat } from '@/lib/constants';

interface CompositingOptions {
  layout: GridLayout;
  photos: Record<number, CapturedPhoto>;
  frameStyle: 'minimal' | 'polaroid' | 'film' | 'none';
  dateStampEnabled: boolean;
  resolution: { width: number; height: number };
}

export async function createCompositedCanvas({
  layout,
  photos,
  frameStyle,
  dateStampEnabled,
  resolution
}: CompositingOptions): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Parse aspect ratio
  const [arW, arH] = layout.aspectRatio.split(':').map(Number);
  
  // Base dimensions calculation
  // We want the final canvas to fit within the chosen resolution but maintain aspect ratio (including frame)
  // Let's create a base inner grid size first
  
  // Grid properties
  const gap = 20;
  const padding = frameStyle === 'polaroid' ? 60 : frameStyle === 'film' ? 80 : frameStyle === 'minimal' ? 40 : 0;
  const bottomPadding = frameStyle === 'polaroid' ? 180 : padding;

  // Let's fix a cell size based on standard width for simplicity
  const cellWidth = 1000;
  // Calculate cell height based on layout's aspect ratio if possible, or assume 4:3 for camera
  const cellHeight = 750; // assuming 4:3 camera capture

  const innerWidth = layout.cols * cellWidth + (layout.cols - 1) * gap;
  const innerHeight = layout.rows * cellHeight + (layout.rows - 1) * gap;

  canvas.width = innerWidth + (padding * 2);
  canvas.height = innerHeight + padding + bottomPadding;

  // Draw background/frame
  ctx.fillStyle = frameStyle === 'none' ? '#000000' : frameStyle === 'film' ? '#111111' : '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // If film, draw sprocket holes
  if (frameStyle === 'film') {
    ctx.fillStyle = '#ffffff';
    for (let y = 40; y < canvas.height; y += 120) {
      ctx.fillRect(20, y, 40, 60);
      ctx.fillRect(canvas.width - 60, y, 40, 60);
    }
  }

  // Draw photos
  const drawPromises = layout.slots.map((slot, index) => {
    return new Promise<void>((resolve) => {
      const photo = photos[index];
      if (!photo) {
        resolve();
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const x = padding + (slot.col * (cellWidth + gap));
        const y = padding + (slot.row * (cellHeight + gap));

        // Source crop to fit cell if aspect ratios don't match exactly
        const srcAspect = img.width / img.height;
        const cellAspect = cellWidth / cellHeight;

        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        
        if (srcAspect > cellAspect) {
          sw = img.height * cellAspect;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / cellAspect;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, x, y, cellWidth, cellHeight);
        resolve();
      };
      img.src = photo.imageUrl;
    });
  });

  await Promise.all(drawPromises);

  // Draw Date Stamp
  if (dateStampEnabled && frameStyle !== 'none') {
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    ctx.font = `italic ${Math.floor(bottomPadding * 0.3)}px 'Playfair Display', serif`;
    ctx.fillStyle = frameStyle === 'film' ? '#ffffff' : '#333333';
    ctx.textAlign = 'center';
    
    let textY = canvas.height - (bottomPadding / 2) + (bottomPadding * 0.1);
    ctx.fillText(date, canvas.width / 2, textY);
  }

  return canvas;
}

export async function exportPhotoGrid(
  options: CompositingOptions,
  format: ExportFormat,
  quality: number = 0.9
) {
  const canvas = await createCompositedCanvas(options);
  const filename = `duobooth-${Date.now()}`;

  if (format === 'pdf') {
    // Generate PDF
    // A4 dimensions: 210 x 297 mm
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgRatio = canvas.width / canvas.height;
    const pdfRatio = pdfWidth / pdfHeight;

    let finalW = pdfWidth;
    let finalH = pdfHeight;

    if (imgRatio > pdfRatio) {
      finalH = pdfWidth / imgRatio;
    } else {
      finalW = pdfHeight * imgRatio;
    }

    // Center image
    const x = (pdfWidth - finalW) / 2;
    const y = (pdfHeight - finalH) / 2;

    const imgData = canvas.toDataURL('image/jpeg', quality);
    pdf.addImage(imgData, 'JPEG', x, y, finalW, finalH);
    pdf.save(`${filename}.pdf`);
  } else {
    // Generate Image
    const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${filename}.${format}`);
      }
    }, mimeType, quality);
  }
}
