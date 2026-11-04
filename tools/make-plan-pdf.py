#!/usr/bin/env python
"""Build the course-plan PDF from docs/course-plan.md.

  <venv>/bin/pip install markdown
  <venv>/bin/python tools/make-plan-pdf.py /tmp/plan.html
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
      --print-to-pdf=assets/docs/Metal2Humanoid_IAP_2027_Course_Plan.pdf file:///tmp/plan.html
"""
import json, sys, os, markdown
root = os.path.join(os.path.dirname(__file__), '..')
site = json.load(open(os.path.join(root, 'data', 'site.json')))
body = markdown.markdown(open(os.path.join(root, 'docs', 'course-plan.md'), encoding='utf-8').read(), extensions=['sane_lists'])
contact = site['contact']['course']
html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Metal2Humanoid: MIT IAP 2027 course plan</title>
<style>
@page {{ size: Letter; margin: 20mm 18mm 20mm 18mm; }}
body {{ font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #1C1B19; font-size: 10.5pt; line-height: 1.45; }}
.banner {{ font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 8.5pt; letter-spacing: .04em; text-transform: uppercase; color: #5D5A54; border-bottom: 2px solid #A64B1F; padding-bottom: 6px; margin-bottom: 14px; }}
h1 {{ font-size: 20pt; margin: 18px 0 6px; letter-spacing: -.01em; page-break-after: avoid; }}
h1:first-of-type {{ font-size: 24pt; margin-top: 0; }}
h2 {{ font-size: 14pt; margin: 16px 0 6px; page-break-after: avoid; }}
h3 {{ font-size: 11.5pt; margin: 12px 0 4px; page-break-after: avoid; color: #7E3613; }}
p {{ margin: 0 0 7px; }}
ul, ol {{ margin: 0 0 8px; padding-left: 1.3em; }}
li {{ margin-bottom: 2px; }}
hr {{ border: 0; border-top: 1px solid #E2DDD3; margin: 14px 0; }}
.foot {{ margin-top: 18px; padding-top: 8px; border-top: 1px solid #E2DDD3; font-size: 8.5pt; color: #5D5A54; }}
</style></head><body>
<div class="banner">Proposed course plan · November 2026 · Items marked provisional may change</div>
{body}
<div class="foot">Metal2Humanoid is a proposed non-credit MIT IAP 2027 activity organized by its instructors and the Homebrew Robotics Network. Web: {site['siteUrl']} · Contact: {contact['name']} ({contact['email']})</div>
</body></html>"""
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'docs', 'course-plan.html')
open(out, 'w', encoding='utf-8').write(html); print('wrote', out)
