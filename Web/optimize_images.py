import os
from PIL import Image

def get_size_format(b, factor=1024, suffix="B"):
    """
    Scale bytes to its proper byte format
    e.g:
        1253656 => '1.20MB'
        1253656678 => '1.17GB'
    """
    for unit in ["", "K", "M", "G", "T", "P", "E", "Z"]:
        if b < factor:
            return f"{b:.2f}{unit}{suffix}"
        b /= factor
    return f"{b:.2f}Y{suffix}"

def optimize_images(directory):
    print(f"Scanning {directory}...")
    
    total_saved = 0
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                filepath = os.path.join(root, file)
                original_size = os.path.getsize(filepath)
                
                try:
                    with Image.open(filepath) as img:
                        # Determine max width based on filename
                        max_width = 1920
                        if 'mobile' in file.lower():
                            max_width = 800
                        
                        # Resize if needed
                        if img.width > max_width:
                            ratio = max_width / img.width
                            new_height = int(img.height * ratio)
                            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                            print(f"Resizing {file}: {img.width}x{img.height} -> {max_width}x{new_height}")
                        
                        # Save optimized
                        # For PNGs, we can try to reduce colors if it's not a photo, but these look like banners.
                        # We will just use optimize=True.
                        
                        if file.lower().endswith('.png'):
                            # Check if it has transparency
                            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                                # Keep as PNG
                                img.save(filepath, optimize=True, quality=85)
                            else:
                                # If no transparency, maybe we could convert to JPG? 
                                # But user wants to keep filenames.
                                # We'll stick to PNG optimization.
                                # Pngquant is better but this is Python only.
                                img.save(filepath, optimize=True)
                                
                        elif file.lower().endswith(('.jpg', '.jpeg')):
                            img.save(filepath, optimize=True, quality=80)
                            
                    new_size = os.path.getsize(filepath)
                    saved = original_size - new_size
                    total_saved += saved
                    
                    print(f"Optimized {file}: {get_size_format(original_size)} -> {get_size_format(new_size)} (Saved {get_size_format(saved)})")
                    
                except Exception as e:
                    print(f"Error processing {file}: {e}")

    print(f"\nTotal space saved: {get_size_format(total_saved)}")

if __name__ == "__main__":
    optimize_images("public/images")
