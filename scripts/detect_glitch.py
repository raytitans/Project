"""Deteksi frame 'flash' (glitch 1 frame): frame i berbeda jauh dari i-1 dan i+1, padahal i-1 ≈ i+1.
Usage: python3 scripts/detect_glitch.py video.mp4 [offset_frame]"""
import sys, subprocess, numpy as np
path = sys.argv[1]; off = int(sys.argv[2]) if len(sys.argv) > 2 else 0
W, H = 135, 240
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
bad = []
for i in range(1, len(fr) - 1):
    a = np.abs(fr[i] - fr[i - 1]); b = np.abs(fr[i] - fr[i + 1]); c = np.abs(fr[i + 1] - fr[i - 1])
    # piksel yang berubah lalu kembali lagi
    flash = np.minimum(a, b) - c
    score = float((flash > 25).mean() * 100)
    if score > 0.25:
        bad.append((i + off, round(score, 2)))
print(len(fr), "frames;", "glitch:", bad)
