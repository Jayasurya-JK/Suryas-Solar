import os

blog_dir = r"c:\Website Projects\Suryas-Solar\Web\content\blog"

files = [f for f in os.listdir(blog_dir) if f.startswith("2026-") and f.endswith(".md")]

emoji_map = {
    "👉": "",
    "✅": "Yes",
    "❌": "No",
    "⚠️": "Warning:",
    "⚡": "",
    "💰": "",
    "🏠": "",
    "🚨": "Alert:",
    "👇": "",
    "🛑": "Stop:",
    "🛠️": "",
    "🔧": ""
}

for filename in files:
    filepath = os.path.join(blog_dir, filename)
    try:
        with open(filepath, "r", encoding="utf-8", errors='ignore') as f:
            content = f.read()
        
        original_content = content
        
        for emoji, replacement in emoji_map.items():
            content = content.replace(emoji, replacement)
        
        if content != original_content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Cleaned {filename}")
    except Exception as e:
        print(f"Error {filename}")
