---
title: Bengaluru Waterline
order: 10
blurb: Measures open water and weed cover for 44 Bengaluru lakes from 2018–2025 using Sentinel-2, with an error range on every number. The method is scored against hand-labelled lakes it was never tuned on.
detail: 'Settings were tuned on 8 validation lakes, frozen, then scored once on 12 held-out test lakes (40 hand-labelled lake-years in total). Test results: water IoU 0.78 and vegetation IoU 0.74 (both met their targets), and 83% coverage for the nominal 90% intervals (target 80–100%). One target failed: median relative area error on clean lakes was 0.24 against a frozen target of 0.10. Failure cause: MNDWI undercounts dark, deep water (Bagaluru 2025: 37.7 ha measured vs 56.1 ha labelled) and misses vegetation-tinged water (Kogilu 2018: 0.8 vs 8.2 ha). I reported this rather than changing the method after seeing test results. Trends use a seasonal Mann-Kendall test with exact p-values, Theil-Sen slopes with 90% CIs, and Benjamini-Hochberg correction across all 44 lakes. Result: 1 lake confirmed shrinking (Gattahalli, -1.7 ha/yr), 1 growing (Horamavu Agara, +1.9 ha/yr), and 33 with no clear trend; "no clear trend" means the data can''t decide, not that a lake is stable. Limitations: one annotator, only 3 clean validation lakes, only winter readings validated, and 8 years is short against large year-to-year swings.'
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
