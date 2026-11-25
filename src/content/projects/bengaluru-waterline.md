---
title: Bengaluru Waterline
order: 10
blurb: Measures open water and weed cover for 44 Bengaluru lakes from 2018–2025 using Sentinel-2, with an error range on every number. The method is scored against hand-labelled lakes it was never tuned on.
detail: 'Settings tuned on 8 lakes, frozen, then scored once on 12 held-out test lakes. Water IoU 0.78, vegetation IoU 0.74, and 83% coverage on nominal 90% intervals, all within target. One target failed: median area error on clean lakes was 0.24 vs a 0.10 target, because MNDWI undercounts dark, deep water. I reported it instead of re-tuning. Trends: Gattahalli shrinking (-1.7 ha/yr), Horamavu Agara growing, 33 of 44 lakes with no clear trend. Limits: one annotator, 8 years of data.'
stack:
  - Python
  - Sentinel-2 (Microsoft Planetary Computer)
  - Google Earth Engine
  - QGIS
  - Parquet/GeoTIFF/GeoJSON
  - GitHub Pages + GitHub Actions
links:
  - label: Live here
    href: https://srijan-ratrey.github.io/bengaluru-waterline/
    primary: true
  - label: Github
    href: https://github.com/Srijan-Ratrey/bengaluru-waterline
    primary: false
---
