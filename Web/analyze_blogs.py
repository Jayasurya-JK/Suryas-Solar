import os

blog_dir = r"c:\Website Projects\Suryas-Solar\Web\content\blog"
output_file = r"c:\Website Projects\Suryas-Solar\Web\report.txt"

with open(output_file, "w", encoding="utf-8") as out:
    out.write(f"{'Blog Filename':<60} | {'Word Count':<10} | {'Status'}\n")
    out.write("-" * 85 + "\n")

    files = [f for f in os.listdir(blog_dir) if f.endswith(".md")]
    files.sort()

    for filename in files:
        filepath = os.path.join(blog_dir, filename)
        try:
            with open(filepath, "r", encoding="utf-8", errors='ignore') as f:
                content = f.read()
                
                # Remove frontmatter
                parts = content.split("---", 2)
                if len(parts) > 2:
                    body = parts[2]
                else:
                    body = content
                    
                words = len(body.split())
                
                status = "✅ OK" if words >= 1000 else "⚠️ LOW"
                if words < 600: status = "❌ SHORT"
                
                out.write(f"{filename[:58]:<60} | {words:<10} | {status}\n")
        except Exception as e:
            out.write(f"Error reading {filename}: {e}\n")

print("Validating report generated.")
