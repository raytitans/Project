"""SFX + musik latar lembut untuk video AHP (sintesis lokal, bebas royalti).
Output: public/ahp/sfx/*.wav, public/ahp/music.wav. Usage: python3 scripts/make_audio_ahp.py [durasi_detik]"""
import numpy as np, wave, os, sys
SR = 44100
OUT = "public/ahp"
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 60.0
rng = np.random.default_rng(11)
os.makedirs(f"{OUT}/sfx", exist_ok=True)

def save(name, x, peak=0.9):
    x = np.asarray(x, float)
    if x.ndim == 1: x = np.stack([x, x], 1)
    x = x / (np.abs(x).max() + 1e-9) * peak
    with wave.open(f"{OUT}/{name}", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

t = lambda d: np.arange(int(SR * d)) / SR
def lp(x, a):
    y = np.zeros_like(x); s = 0.0; a = np.broadcast_to(a, x.shape)
    for i in range(len(x)): s += a[i] * (x[i] - s); y[i] = s
    return y
def hp(x, a=0.05): return x - lp(x, a)

# whoosh pendek (0.4s) dan panjang (0.7s): noise band-pass menyapu, stereo pan
for name, d in (("whoosh", 0.42), ("whoosh_long", 0.75)):
    n = int(SR * d); u = np.linspace(0, 1, n); sh = np.sin(np.pi * u) ** 2.2
    x = hp(lp(rng.standard_normal(n), 0.015 + 0.18 * sh), 0.01) * sh
    pan = np.linspace(-0.7, 0.7, n)
    save(f"sfx/{name}.wav", np.stack([x * (1 - pan) / 2, x * (1 + pan) / 2], 1), 0.8)

# click mouse 2-lapis
d = 0.06; tt = t(d)
x = np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt * 260) + 0.6 * rng.standard_normal(len(tt)) * np.exp(-tt * 500)
x2 = np.zeros(int(SR * 0.09)); x2[:len(x)] += x; s = int(SR * 0.028); x2[s:s + len(x)] += 0.6 * x[: len(x2) - s]
save("sfx/click.wav", x2)

# tick lembut
d = 0.03; tt = t(d)
save("sfx/tick.wav", np.sin(2 * np.pi * 2000 * tt) * np.exp(-tt * 220), 0.6)

# pop/bubble (+ varian nada naik untuk 5 blok)
def pop(f0):
    d = 0.18; tt = t(d); f = f0 * (1 + 1.2 * np.exp(-tt * 40))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 22) * (1 - np.exp(-tt * 900))
save("sfx/pop.wav", pop(520))
for k in range(5): save(f"sfx/pop{k}.wav", pop(440 * 2 ** (k * 2 / 12)))

# chime lembut (marimba-ish)
d = 1.4; tt = t(d)
x = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) for f, a, k in [(1046.5, 1, 3.5), (1568, .45, 5), (2093, .2, 8), (523.25, .35, 3)])
save("sfx/chime.wav", x * (1 - np.exp(-tt * 400)), 0.7)

# shimmer: arpeggio tinggi halus
d = 1.3; x = np.zeros(int(SR * d))
for i, fr in enumerate([1318.5, 1568, 1975.5, 2637]):
    s = int(SR * 0.06 * i); tt = t(d)[: len(x) - s]
    x[s:] += np.sin(2 * np.pi * fr * tt) * np.exp(-tt * 4.5) * (0.7 - 0.1 * i)
save("sfx/shimmer.wav", x, 0.6)

# boom lembut (sub, tanpa distorsi)
d = 1.8; tt = t(d); f = 70 * np.exp(-tt * 5) + 40
x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.2) * (1 - np.exp(-tt * 300)) + 0.15 * lp(rng.standard_normal(len(tt)), 0.05) * np.exp(-tt * 10)
save("sfx/boom.wav", x, 0.85)

# riser lembut 1.5s dan rise_soft 0.5s (untuk batang tumbuh)
for name, d in (("riser", 1.5), ("rise_soft", 0.55)):
    tt = t(d); p = tt / d
    f = 300 + 900 * p ** 2
    x = 0.5 * np.sin(2 * np.pi * np.cumsum(f) / SR) * p ** 2 + 0.6 * lp(rng.standard_normal(len(tt)), 0.02 + 0.25 * p ** 2) * p ** 2
    x[-int(SR * 0.03):] *= np.linspace(1, 0, int(SR * 0.03))
    save(f"sfx/{name}.wav", x, 0.6)

# musik: ambient tenang 120 BPM half-time (beat 15f), pad + piano pluck + sub kick lembut
BPM = 120; beat = 60 / BPM; bar = beat * 4; N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
chords = [[220.0, 261.63, 329.63, 392.0], [174.61, 220.0, 261.63, 329.63], [261.63, 329.63, 392.0, 493.88], [196.0, 246.94, 293.66, 392.0]]
for b in range(int(DUR / (bar * 2)) + 1):  # 1 akor per 2 bar
    s = int(SR * b * bar * 2); n = min(int(SR * bar * 2), N - s)
    if n <= 0: break
    tt = t(bar * 2)[:n]; ch = chords[b % 4]
    e = np.minimum(1, tt / 1.2) * np.minimum(1, (bar * 2 - tt) / 1.2)
    pad = sum(np.sin(2 * np.pi * f * tt + 0.2 * np.sin(2 * np.pi * 0.3 * tt)) + 0.3 * np.sin(2 * np.pi * f * 2.004 * tt) for f in ch) * e * 0.06
    bass = np.sin(2 * np.pi * ch[0] / 2 * tt) * e * 0.12
    L[s:s + n] += pad + bass; R[s:s + n] += pad * 0.92 + bass
# piano pluck tiap 1/4 (pola arpeggio)
pat = [0, 2, 1, 3, 2, 1, 3, 2]
for i in range(int(DUR / beat)):
    s = int(SR * i * beat); ch = chords[int(i * beat / (bar * 2)) % 4]; f = ch[pat[i % 8]] * 2
    n = min(int(SR * 0.9), N - s)
    if n <= 0: break
    tt = t(0.9)[:n]
    p = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 5) * (1 - np.exp(-tt * 300)) * 0.035
    if i * beat > 7.5: (L if i % 2 else R)[s:s + n] += p; (R if i % 2 else L)[s:s + n] += p * 0.5
# sub kick lembut di ketukan 1 & 3, mulai bar ke-4, berhenti 4 dtk sebelum akhir
for i in range(int(DUR / beat)):
    tb = i * beat
    if tb < bar * 4 or tb > DUR - 4 or i % 2: continue
    s = int(SR * tb); n = int(SR * 0.35); tt = t(0.35); f = 90 * np.exp(-tt * 25) + 45
    k = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * 0.16
    L[s:s + n] += k; R[s:s + n] += k
fade = np.ones(N); fi = int(SR * 1.0); fo = int(SR * 2.5)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo) ** 2
save("music.wav", np.stack([L * fade, R * fade], 1), 0.8)
print("ok")
