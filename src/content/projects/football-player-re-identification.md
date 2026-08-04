---
title: 'Football player re-identification'
order: 4
blurb: >-
  Keeps player IDs stable across a football video feed, including when a player leaves the
  frame and comes back.
detail: >-
  YOLOv11 for detection, then multi-modal feature extraction over appearance, motion and
  temporal cues, with Kalman-filter tracking and feature matching to re-associate identities.
  Tracks 45 players at a track continuity of 1.00 and an average track length of 126.5 frames;
  identity preservation across re-entries is the weak point at 0.32, which the repo reports
  rather than hides.
stack:
  - 'Python'
  - 'YOLOv11'
  - 'OpenCV'
  - 'Kalman filter'
  - 'CNN embeddings'
links:
  - label: 'Repo'
    href: 'https://github.com/Srijan-Ratrey/Football-Player-Re-Identification-System-'
---
