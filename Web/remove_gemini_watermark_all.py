"""
remove_gemini_watermark_all.py
------------------------------
Removes the Gemini AI sparkle watermark from the bottom-right corner
of ALL new blog WebP images using OpenCV's TELEA inpainting algorithm.
"""

import cv2
import numpy as np
import os

IMAGES_DIR = r"c:\Website Projects\Suryas-Solar\Web\public\images"

# All newly converted blog images
BLOG_IMAGES = [
    "can-1-5-ton-ac-run-on-solar-power-tamil-nadu.webp",
    "is-stabilizer-required-for-inverter-ac-on-solar.webp",
    "why-is-electricity-bill-high-in-summer-tamil-nadu.webp",
    "how-to-reduce-electricity-bill-tamil-nadu-solar.webp",
    "how-many-units-does-ac-consume-per-day-india.webp",
    "how-to-calculate-eb-bill-tamil-nadu-examples.webp",
    "how-much-solar-for-5000-electricity-bill-tamil-nadu.webp",
    "how-much-solar-needed-for-home-india.webp",
    "how-much-can-you-save-with-solar-panels-india.webp",
    "solar-panel-cost-tamil-nadu-2026.webp",
    "3kw-solar-system-price-india-2026.webp",
    "5kw-solar-system-cost-tamil-nadu-2026.webp",
    "best-solar-company-cuddalore-2026.webp",
    "solar-cost-puducherry-2026.webp",
]


def build_watermark_mask(image_bgr):
    """
    Builds a binary mask that isolates the Gemini sparkle watermark
    in the bottom-right corner of the image.
    """
    h, w = image_bgr.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)

    # Gemini always places its sparkle in the bottom-right corner.
    # Search the bottom 15% height x right 10% width region.
    roi_y = int(h * 0.85)
    roi_x = int(w * 0.90)
    roi = image_bgr[roi_y:h, roi_x:w]

    # Method 1: Detect very bright white pixels (the 4-pointed star arms)
    roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    _, bright_mask = cv2.threshold(roi_gray, 190, 255, cv2.THRESH_BINARY)

    # Method 2: Detect the blue/teal hue of the Gemini sparkle colour
    roi_hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    lower_blue = np.array([85, 40, 140])
    upper_blue = np.array([135, 255, 255])
    blue_mask = cv2.inRange(roi_hsv, lower_blue, upper_blue)

    # Combine: bright white OR blue/teal sparkle pixels
    combined = cv2.bitwise_or(bright_mask, blue_mask)

    # Dilate generously to cover the full star shape including thin arms
    kernel = np.ones((11, 11), np.uint8)
    combined = cv2.dilate(combined, kernel, iterations=3)

    # Place the ROI mask back into the full image mask
    mask[roi_y:h, roi_x:w] = combined
    return mask


def process_image(image_path):
    img_bgr = cv2.imread(image_path)
    if img_bgr is None:
        print(f"  [SKIP] Could not load: {os.path.basename(image_path)}")
        return False

    h, w = img_bgr.shape[:2]
    mask = build_watermark_mask(img_bgr)
    pixel_count = int(np.count_nonzero(mask))

    if pixel_count == 0:
        print(f"  [SKIP] No watermark detected in: {os.path.basename(image_path)}")
        return False

    print(f"  Detected {pixel_count} watermark pixels. Inpainting...")
    result = cv2.inpaint(img_bgr, mask, inpaintRadius=18, flags=cv2.INPAINT_TELEA)

    encode_params = [cv2.IMWRITE_WEBP_QUALITY, 88]
    cv2.imwrite(image_path, result, encode_params)
    return True


def main():
    print("=" * 60)
    print("Gemini Watermark Remover - All Blog Images")
    print("=" * 60)

    success = 0
    skipped = 0

    for filename in BLOG_IMAGES:
        image_path = os.path.join(IMAGES_DIR, filename)
        print(f"\nProcessing: {filename}")

        if not os.path.exists(image_path):
            print(f"  [MISSING] File not found, skipping.")
            skipped += 1
            continue

        if process_image(image_path):
            print(f"  [OK] Watermark removed and saved.")
            success += 1
        else:
            skipped += 1

    print("\n" + "=" * 60)
    print(f"DONE. Cleaned: {success} images | Skipped: {skipped} images.")
    print("=" * 60)


if __name__ == "__main__":
    main()
