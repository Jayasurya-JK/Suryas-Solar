import os
import glob
from PIL import Image

def compress_images(directory, quality=75, max_width=1200):
    print(f"Scanning {directory} for WebP images...")
    
    # Recursively find all webp files
    image_files = glob.glob(os.path.join(directory, '**', '*.webp'), recursive=True)
    
    print(f"Found {len(image_files)} images.")
    
    saved_size = 0
    processed_count = 0
    
    for file_path in image_files:
        try:
            original_size = os.path.getsize(file_path)
            
            with Image.open(file_path) as img:
                # Resize if too large
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Save with compression
                img.save(file_path, 'WEBP', quality=quality, optimize=True)
                
            new_size = os.path.getsize(file_path)
            saved = original_size - new_size
            
            if saved > 0:
                saved_size += saved
                processed_count += 1
                print(f"Compressed: {os.path.basename(file_path)} | Saved: {saved/1024:.2f} KB")
            else:
                print(f"Skipped (already optimized): {os.path.basename(file_path)}")
                
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            
    print(f"\nTotal images processed: {processed_count}")
    print(f"Total space saved: {saved_size/1024/1024:.2f} MB")

if __name__ == "__main__":
    target_dir = r"c:\Website Projects\Suryas-Solar\Web\public\images"
    compress_images(target_dir, quality=65) # Aggressive compression for mobile
