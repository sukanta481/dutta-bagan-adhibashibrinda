import re

def update_hero_script(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # The old script block
    old_script_pattern = r"  <script>\s*\(\s*function\s*\(\)\s*\{\s*var\s*heroText\s*=\s*document\.querySelector\('\.page-hero\s*\.hero-text-content'\);\s*if\s*\(!heroText\)\s*return;\s*function\s*activateHeroText\(\)\s*\{\s*window\.requestAnimationFrame\(function\s*\(\)\s*\{\s*heroText\.classList\.add\('active'\);\s*\}\);\s*\}\s*if\s*\(document\.readyState\s*===\s*'loading'\)\s*\{\s*document\.addEventListener\('DOMContentLoaded',\s*activateHeroText,\s*\{\s*once:\s*true\s*\}\);\s*\}\s*else\s*\{\s*activateHeroText\(\);\s*\}\s*window\.addEventListener\('pageshow',\s*activateHeroText\);\s*\}\(\)\);\s*</script>"
    
    # Check if we can find the exact match
    match = re.search(old_script_pattern, content)
    if not match:
        print(f"Could not match pattern in {filename}")
        
        # Try a more forgiving replacement if exact whitespace failed
        forgiving_pattern = re.compile(r"<script>[\s\S]*?activateHeroText\(\);[\s\S]*?</script>")
        # let's just do an exact match using multi_replace_file_content instead of regex? No, regex is fine
        pass
    else:
        new_script = """  <script>
  (function () {
    var heroText = document.querySelector('.page-hero .hero-text-content');
    if (!heroText) return;
    function activateHeroText() {
      window.requestAnimationFrame(function () {
        heroText.classList.add('active');
      });
    }
    document.addEventListener('loader:done', activateHeroText, { once: true });
    // Failsafe in case loader finished before this script ran
    if (document.readyState === 'complete' && (!document.getElementById('pageLoader') || document.getElementById('pageLoader').dataset.done === '1')) {
        activateHeroText();
    }
    window.addEventListener('pageshow', activateHeroText);
  }());
  </script>"""
        
        content = content[:match.start()] + new_script + content[match.end():]
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")

update_hero_script('about.html')
update_hero_script('contact.html')
update_hero_script('gallery.html')
