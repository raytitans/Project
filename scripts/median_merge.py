"""Gabungkan beberapa render identik dengan median per piksel per frame.
Glitch render Chromium (tile hilang 1 frame) bersifat acak, jadi median dari 3 render menghapusnya.
Usage: python3 scripts/median_merge.py out.mp4 render1.mp4 render2.mp4 render3.mp4
Audio diambil dari render pertama."""
import subprocess, sys
import numpy as np

out, *ins = sys.argv[1:]
W, H = 1080, 1920
size = W * H * 3
readers = [
    subprocess.Popen(["ffmpeg", "-v", "error", "-i", p, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    for p in ins
]
writer = subprocess.Popen(
    [
        "ffmpeg", "-v", "error", "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
        "-i", ins[0],
        "-map", "0:v", "-map", "1:a",
        "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", "30",
        "-c:a", "copy", "-movflags", "+faststart",
        out,
    ],
    stdin=subprocess.PIPE,
)
n = fixed = 0
while True:
    bufs = [r.stdout.read(size) for r in readers]
    if any(len(b) < size for b in bufs):
        break
    fr = [np.frombuffer(b, np.uint8).reshape(H, W, 3) for b in bufs]
    med = np.median(np.stack(fr), axis=0).astype(np.uint8)
    # hitung frame yang sempat berbeda jauh di salah satu render (untuk laporan)
    if any(float((np.abs(f.astype(np.int16) - med).max(axis=2) > 40).mean()) > 0.002 for f in fr):
        fixed += 1
    writer.stdin.write(med.tobytes())
    n += 1
writer.stdin.close()
writer.wait()
print(f"frames={n} frame_dengan_perbedaan_antar_render={fixed}")
