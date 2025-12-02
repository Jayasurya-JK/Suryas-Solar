import os
from PIL import Image

# Configuration
IMAGE_DIR = 'public/images'
CONTENT_DIRS = ['src', 'content']
EXTENSIONS = ('.png', '.jpg', '.jpeg')
QUALITY = 75  # 0-100, 75 is a good balance for "very low kb" without destroying artifacts

def convert_images():
    replacements = {}
    print(f"Scanning {IMAGE_DIR} for images to convert...")
    
    for root, dirs, files in os.walk(IMAGE_DIR):
        for file in files:
            if file.lower().endswith(EXTENSIONS):
                file_path = os.path.join(root, file)
                file_name, ext = os.path.splitext(file)
                new_file_name = file_name + ".webp"
                new_file_path = os.path.join(root, new_file_name)
                
                try:
                    with Image.open(file_path) as img:
                        # Resize if huge (e.g. raw photos)
                        max_width = 1920
                        if img.width > max_width:
                            ratio = max_width / img.width
                            new_height = int(img.height * ratio)
                            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                        
                        # Save as WebP
                        img.save(new_file_path, 'WEBP', quality=QUALITY, method=6)
                        
                    print(f"Converted: {file} -> {new_file_name}")
                    
                    # Store mapping for code update
                    replacements[file] = new_file_name
                    
                    # Delete original file to save space and force usage of new one
                    os.remove(file_path)
                    
                except Exception as e:
                    print(f"Error converting {file}: {e}")

    return replacements

def update_references(replacements):
    print(f"Updating references in {CONTENT_DIRS}...")
    
    # Sort replacements by length (descending) to avoid substring issues
    # e.g. replace "background-image.png" before "image.png"
    sorted_replacements = dict(sorted(replacements.items(), key=lambda item: len(item[0]), reverse=True))
    
    count = 0
    for directory in CONTENT_DIRS:
        if not os.path.exists(directory):
            continue
            
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith(('.js', '.jsx', '.md', '.json', '.css', '.html')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        new_content = content
                        for old_name, new_name in sorted_replacements.items():
                            if old_name in new_content:
                                new_content = new_content.replace(old_name, new_name)
                                
                        if new_content != content:
                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            print(f"Updated {file}")
                            count += 1
                                
                    except Exception as e:
                        print(f"Error updating {file}: {e}")
    
    print(f"Updated references in {count} files.")

if __name__ == "__main__":
    replacements = convert_images()
    if replacements:
        update_references(replacements)
    else:
        print("No images found to convert.")
