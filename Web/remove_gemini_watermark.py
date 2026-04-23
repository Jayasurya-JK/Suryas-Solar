"""
remove_gemini_watermark.py
--------------------------
Removes the Gemini AI sparkle watermark from blog feature images in public/images.

This script scans Markdown blog posts for featured image references and applies
mask-based inpainting to the bottom-right watermark region.
"""

import cv2
import numpy as np
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
IMAGES_DIR = ROOT / 'public' / 'images'
CONTENT_DIR = ROOT / 'content' / 'blog'

IMAGE_EXTENSIONS = {'.webp', '.png', '.jpg', '.jpeg'}

FEATURED_IMAGE_RE = re.compile(r'featuredImage:\s*["\']?(/images/[^"\']+)["\']?')
INLINE_IMAGE_RE = re.compile(r'!\[[^\]]*\]\((/images/[^)]+)\)')
GENERIC_IMAGE_RE = re.compile(r'(/images/[\w\-\s./]+\.(?:webp|png|jpg|jpeg))', re.IGNORECASE)


def find_blog_images():
    image_paths = set()

    for md_file in sorted(CONTENT_DIR.glob('*.md')):
        text = md_file.read_text(encoding='utf-8')
        for regex in (FEATURED_IMAGE_RE, INLINE_IMAGE_RE, GENERIC_IMAGE_RE):
            for match in regex.findall(text):
                image_paths.add(match.strip())

    return sorted(image_paths)


def build_watermark_mask(image_bgr):
    h, w = image_bgr.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)

    roi_y = int(h * 0.88)
    roi_x = int(w * 0.92)
    roi = image_bgr[roi_y:, roi_x:]

    roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    _, bright_mask = cv2.threshold(roi_gray, 210, 255, cv2.THRESH_BINARY)

    roi_hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    lower_blue = np.array([85, 40, 160])
    upper_blue = np.array([135, 255, 255])
    blue_mask = cv2.inRange(roi_hsv, lower_blue, upper_blue)

    combined = cv2.bitwise_or(bright_mask, blue_mask)

    kernel = np.ones((5, 5), np.uint8)
    combined = cv2.morphologyEx(combined, cv2.MORPH_OPEN, kernel, iterations=1)
    combined = cv2.dilate(combined, kernel, iterations=2)

    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(combined, connectivity=8)
    final_mask = np.zeros_like(combined)

    for label in range(1, num_labels):
        area = stats[label, cv2.CC_STAT_AREA]
        x = stats[label, cv2.CC_STAT_LEFT]
        y = stats[label, cv2.CC_STAT_TOP]
        w0 = stats[label, cv2.CC_STAT_WIDTH]
        h0 = stats[label, cv2.CC_STAT_HEIGHT]

        if 10 <= area <= 4000 and x + w0 >= combined.shape[1] - 60:
            final_mask[labels == label] = 255

    if np.count_nonzero(final_mask) == 0:
        final_mask[-56:, -56:] = 255

    mask[roi_y:, roi_x:] = final_mask
    return mask


def normalize_image_path(path_str):
    normalized = path_str.lstrip('/')
    if normalized.startswith('images/'):
        normalized = normalized[len('images/'):]
    return IMAGES_DIR / normalized


def process_image(image_path):
    if not image_path.exists():
        print(f'  [MISSING] {image_path}')
        return False

    img_bgr = cv2.imread(str(image_path))
    if img_bgr is None:
        print(f'  [ERROR] Could not load {image_path}')
        return False

    mask = build_watermark_mask(img_bgr)
    watermark_pixels = int(np.count_nonzero(mask))

    if watermark_pixels == 0:
        print(f'  [SKIP] No watermark detected in {image_path.name}')
        return False

    backup_dir = IMAGES_DIR / 'watermark_backup'
    backup_dir.mkdir(exist_ok=True)
    backup_path = backup_dir / image_path.name
    if not backup_path.exists():
        cv2.imwrite(str(backup_path), img_bgr)

    result = cv2.inpaint(img_bgr, mask, inpaintRadius=12, flags=cv2.INPAINT_TELEA)
    cv2.imwrite(str(image_path), result, [cv2.IMWRITE_WEBP_QUALITY, 88])
    debug_mask_path = image_path.with_name(image_path.stem + '_watermark_mask_debug.png')
    cv2.imwrite(str(debug_mask_path), mask)
    print(f'  [OK] Cleaned {image_path.name} ({watermark_pixels} mask px)')
    return True


def main():
    image_paths = find_blog_images()
    if not image_paths:
        print('No blog image references found in content/blog.')
        return

    print('Blog images found:', len(image_paths))
    for path_str in image_paths:
        image_path = normalize_image_path(path_str)
        process_image(image_path)


if __name__ == '__main__':
    main()
