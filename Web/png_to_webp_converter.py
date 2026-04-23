# -*- coding: utf-8 -*-
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
"""
png_to_webp_converter.py
------------------------
Converts all PNG images in the public/images directory to WebP format,
then deletes the original PNGs.
Also maps the new images to blog frontmatter and updates the paths.
"""

import os
import glob
from PIL import Image

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
IMAGES_DIR   = r"c:\Website Projects\Suryas-Solar\Web\public\images"
BLOG_DIR     = r"c:\Website Projects\Suryas-Solar\Web\content\blog"
WEBP_QUALITY = 85   # 85 = great quality, still much smaller than PNG
MAX_WIDTH    = 1200 # Resize if wider (good for blog thumbnails)

# ─────────────────────────────────────────────
# MAPPING: Blog-title image name  →  blog file slug  →  new webp filename
# The key is the EXACT image filename prefix the user saved (without extension)
# The value is (blog_md_filename, new_seo_webp_name)
# ─────────────────────────────────────────────
IMAGE_BLOG_MAP = {
    "Can a 1.5 Ton AC Run on Solar Power in Tamil Nadu (2026 Ultimate Guide)":
        ("2026-04-25-can-1-5-ton-ac-run-on-solar-power-tamil-nadu.md",
         "can-1-5-ton-ac-run-on-solar-power-tamil-nadu.webp"),

    "can-1-5-ton-ac-run-on-solar-power-tamil-nadu":
        ("2026-04-25-can-1-5-ton-ac-run-on-solar-power-tamil-nadu.md",
         "can-1-5-ton-ac-run-on-solar-power-tamil-nadu.webp"),

    "Do You Need a Stabilizer for an Inverter AC on Solar Power (2026 Ultimate Guide)":
        ("2026-04-26-is-stabilizer-required-for-inverter-ac-on-solar.md",
         "is-stabilizer-required-for-inverter-ac-on-solar.webp"),

    "Why Is My Electricity Bill So High in Summer":
        ("2026-04-27-why-is-electricity-bill-high-in-summer-tamil-nadu.md",
         "why-is-electricity-bill-high-in-summer-tamil-nadu.webp"),

    "How to Reduce Your Electricity Bill in Tamil Nadu Using Solar Panels":
        ("2026-04-28-how-to-reduce-electricity-bill-tamil-nadu-solar.md",
         "how-to-reduce-electricity-bill-tamil-nadu-solar.webp"),

    "How Many Units Does an AC Consume Per Day in India":
        ("2026-04-29-how-many-units-does-ac-consume-per-day-india.md",
         "how-many-units-does-ac-consume-per-day-india.webp"),

    "How to Calculate Your EB Bill in Tamil Nadu":
        ("2026-04-30-how-to-calculate-eb-bill-tamil-nadu-examples.md",
         "how-to-calculate-eb-bill-tamil-nadu-examples.webp"),

    "How Much Solar Is Needed for a ₹3000–₹5000 Electricity Bill in Tamil Nadu":
        ("2026-05-01-how-much-solar-for-5000-electricity-bill-tamil-nadu.md",
         "how-much-solar-for-5000-electricity-bill-tamil-nadu.webp"),

    "How Much Solar Do You Need for Your Home in India":
        ("2026-05-02-how-much-solar-needed-for-home-india.md",
         "how-much-solar-needed-for-home-india.webp"),

    "How Much Can You Save With Solar Panels in India":
        ("2026-05-03-how-much-can-you-save-with-solar-panels-india.md",
         "how-much-can-you-save-with-solar-panels-india.webp"),

    "Solar Panel Cost in Tamil Nadu (2026)":
        ("2026-05-04-solar-panel-cost-tamil-nadu-2026-price-subsidy-savings.md",
         "solar-panel-cost-tamil-nadu-2026.webp"),

    "3kW Solar System Price in India – How Many Units & Complete Cost Guide (2026)":
        ("2026-05-05-3kw-solar-system-price-india-how-many-units-cost.md",
         "3kw-solar-system-price-india-2026.webp"),

    "5kW Solar System Cost in Tamil Nadu – Complete 2026 Guide":
        ("2026-05-06-5kw-solar-system-cost-tamil-nadu-2026-complete-guide.md",
         "5kw-solar-system-cost-tamil-nadu-2026.webp"),

    "Best Solar Company in Cuddalore – What to Check Before Installing (2026 Guide":
        ("2026-05-07-best-solar-company-cuddalore-what-to-check.md",
         "best-solar-company-cuddalore-2026.webp"),

    "Solar Cost in Puducherry (2026)":
        ("2026-05-08-solar-cost-puducherry-2026-1kw-3kw-5kw-price-guide.md",
         "solar-cost-puducherry-2026.webp"),
}


def convert_png_to_webp(png_path, webp_path, quality=85, max_width=1200):
    """Convert a single PNG to WebP with optional resize."""
    try:
        with Image.open(png_path) as img:
            # Convert RGBA or P mode images to RGB for WebP compatibility
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            # Resize if too wide
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

            img.save(webp_path, "WEBP", quality=quality, optimize=True)

        original_kb = os.path.getsize(png_path) / 1024
        new_kb = os.path.getsize(webp_path) / 1024
        saving_pct = ((original_kb - new_kb) / original_kb) * 100
        print(f"  [OK] Converted: {os.path.basename(png_path)}")
        print(f"     {original_kb:.0f} KB -> {new_kb:.0f} KB  (saved {saving_pct:.0f}%)")
        return True
    except Exception as e:
        print(f"  [ERROR] Error converting {png_path}: {e}")
        return False


def update_blog_frontmatter(blog_md_path, new_webp_name):
    """Update the featuredImage field in a blog markdown frontmatter."""
    try:
        with open(blog_md_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Find existing featuredImage line and replace it
        import re
        new_image_path = f"/images/{new_webp_name}"
        pattern = r'(featuredImage:\s*")[^"]*(")'
        replacement = rf'\g<1>{new_image_path}\g<2>'
        new_content, count = re.subn(pattern, replacement, content)

        if count > 0:
            with open(blog_md_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"  📝 Updated frontmatter: {os.path.basename(blog_md_path)}")
            print(f"     → featuredImage: {new_image_path}")
        else:
            print(f"  ⚠️  No featuredImage found in {os.path.basename(blog_md_path)}")

    except Exception as e:
        print(f"  ❌ Error updating {blog_md_path}: {e}")


def main():
    print("=" * 60)
    print("PNG to WebP Converter + Blog Frontmatter Mapper")
    print("=" * 60)

    # Find all PNGs in images directory
    png_files = glob.glob(os.path.join(IMAGES_DIR, "*.png"))
    print(f"\nFound {len(png_files)} PNG files in images directory.\n")

    total_converted = 0
    total_deleted = 0

    for png_path in png_files:
        filename_no_ext = os.path.splitext(os.path.basename(png_path))[0]
        print(f"\nProcessing: {filename_no_ext}.png")

        # Check if this image is in our mapping
        mapped = IMAGE_BLOG_MAP.get(filename_no_ext)

        if mapped:
            blog_filename, webp_name = mapped
            webp_path = os.path.join(IMAGES_DIR, webp_name)
        else:
            # No specific mapping — convert with a slugified name
            import unicodedata
            safe_name = unicodedata.normalize("NFKD", filename_no_ext)
            safe_name = safe_name.encode("ascii", "ignore").decode("ascii")
            safe_name = safe_name.lower().replace(" ", "-").replace("–", "-")
            safe_name = "".join(c for c in safe_name if c.isalnum() or c == "-")
            webp_name = safe_name.strip("-") + ".webp"
            webp_path = os.path.join(IMAGES_DIR, webp_name)
            blog_filename = None
            print(f"  ⚠️  No blog mapping found. Converting as: {webp_name}")

        # Convert PNG → WebP
        success = convert_png_to_webp(png_path, webp_path, WEBP_QUALITY, MAX_WIDTH)

        if success:
            total_converted += 1

            # Update blog frontmatter if we have a mapping
            if blog_filename:
                blog_md_path = os.path.join(BLOG_DIR, blog_filename)
                if os.path.exists(blog_md_path):
                    update_blog_frontmatter(blog_md_path, webp_name)
                else:
                    print(f"  ⚠️  Blog file not found: {blog_filename}")

            # Delete the original PNG
            try:
                os.remove(png_path)
                total_deleted += 1
                print(f"  🗑️  Deleted original PNG.")
            except Exception as e:
                print(f"  ❌ Could not delete {png_path}: {e}")

    print("\n" + "=" * 60)
    print(f"DONE! Converted: {total_converted} | Deleted: {total_deleted} PNG files.")
    print("=" * 60)


if __name__ == "__main__":
    main()
