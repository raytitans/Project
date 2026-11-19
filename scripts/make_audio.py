"""Sintesis SFX + musik latar (tanpa aset eksternal). Output: public/sfx/*.wav, public/music.wav"""
import numpy as np, wave, os, sys
SR = 44100
OUT = sys.argv[1] if len(sys.argv) > 1 else "public"
rng = np.random.default_rng(7)

def save(name, x, stereo=False):
    x = np.asarray(x, dtype=float)
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    if not stereo: x = np.stack([x, x], 1)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a, r):  # attack/release in s
    e = np.ones(n); A = int(SR*a); R = int(SR*r)
    if A: e[:A] = np.linspace(0, 1, A)
    if R: e[-R:] *= np.linspace(1, 0, R) ** 2
    return e
def lp(x, a):  # simple one-pole lowpass with time-varying coef array/scalar
    y = np.zeros_like(x); s = 0.0
    a = np.broadcast_to(a, x.shape)
    for i in range(len(x)): s += a[i] * (x[i] - s); y[i] = s
    return y

# whoosh: noise with sweeping lowpass, bell-shaped envelope
n = int(SR*0.55); tt = np.linspace(0, 1, n)
shape = np.sin(np.pi * tt) ** 2
x = lp(rng.standard_normal(n), 0.02 + 0.25 * shape) * shape
pan = np.linspace(-0.8, 0.8, n)
save("sfx/whoosh.wav", np.stack([x*(1-pan)/2, x*(1+pan)/2], 1), stereo=True)

# tick: short click
n = int(SR*0.04); x = np.sin(2*np.pi*2400*t(0.04)) * np.exp(-t(0.04)*180) + 0.3*rng.standard_normal(n)*np.exp(-t(0.04)*400)
save("sfx/tick.wav", x)

# pop: pitch drop sine
d = 0.15; tt = t(d); f = 900*np.exp(-tt*25) + 220
x = np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt*28)
save("sfx/pop.wav", x)

# ding: UI confirm (two bell partials)
d = 1.2; tt = t(d)
x = sum(a*np.sin(2*np.pi*f*tt)*np.exp(-tt*k) for f, a, k in [(1318.5,1,4),(1975.5,.5,6),(2637,.25,9),(659.25,.3,3)])
x[:int(SR*0.12)] += 0.0
x2 = np.zeros(int(SR*1.32)); x2[:len(x)] += x*0.6
tt2 = t(1.2); x2[int(SR*0.12):] += sum(a*np.sin(2*np.pi*f*tt2)*np.exp(-tt2*k) for f,a,k in [(1760,1,4),(2637,.4,7)])[:len(x2)-int(SR*0.12)]
save("sfx/ding.wav", x2)

# impact: sub boom + noise burst
d = 1.6; tt = t(d); f = 110*np.exp(-tt*6) + 38
x = np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt*2.5) + 0.5*lp(rng.standard_normal(len(tt)), 0.08)*np.exp(-tt*14)
save("sfx/impact.wav", x)

# riser: noise + rising tone over 1.6s
d = 1.6; tt = t(d); p = tt/d
f = 200 + 1400*p**2
x = 0.5*np.sin(2*np.pi*np.cumsum(f)/SR)*p**2 + lp(rng.standard_normal(len(tt)), 0.03+0.4*p**2)*p**2
x *= env(len(tt), 0, 0.03)
save("sfx/riser.wav", x)

# shimmer: glassy high arpeggio
d = 1.0; x = np.zeros(int(SR*d))
for i, fr in enumerate([2093, 2637, 3136, 4186]):
    s = int(SR*0.05*i); tt = t(d)[:len(x)-s]
    x[s:] += np.sin(2*np.pi*fr*tt)*np.exp(-tt*6)*0.6
save("sfx/shimmer.wav", x)

# cash: coin jingle (random metallic partials)
d = 0.6; x = np.zeros(int(SR*d))
for k in range(9):
    s = int(SR*rng.uniform(0, 0.25)); tt = t(d)[:len(x)-s]; fr = rng.uniform(3000, 6000)
    x[s:] += np.sin(2*np.pi*fr*tt)*np.exp(-tt*rng.uniform(15, 30))
save("sfx/cash.wav", x)

# music: 62s ambient corporate, 100 BPM, Am - F - C - G pads + soft kick/hat, fade in/out
BPM = 100; beat = 60/BPM; D = 62.0; N = int(SR*D)
L = np.zeros(N); R = np.zeros(N)
chords = [[220, 261.63, 329.63], [174.61, 220, 261.63], [261.63, 329.63, 392], [196, 246.94, 293.66]]
bar = beat*4
for b in range(int(D/bar)+1):
    s = int(SR*b*bar); n = min(int(SR*bar), N-s)
    if n <= 0: break
    tt = t(bar)[:n]; ch = chords[b % 4]
    pad = sum(np.sin(2*np.pi*f*tt + 0.3*np.sin(2*np.pi*0.5*tt)) + 0.4*np.sin(2*np.pi*f*2.003*tt) for f in ch)
    pad *= env(n, 0.6, 0.6) * 0.12
    bass = np.sin(2*np.pi*ch[0]/2*tt) * env(n, 0.05, 0.4) * 0.18
    L[s:s+n] += pad + bass; R[s:s+n] += pad*0.9 + bass
# arpeggio pluck on 8ths
for i in range(int(D/(beat/2))):
    s = int(SR*i*beat/2); ch = chords[int(i*beat/2/bar) % 4]; f = ch[i % 3]*2
    n = min(int(SR*0.4), N-s); tt = t(0.4)[:n]
    p = np.sin(2*np.pi*f*tt)*np.exp(-tt*9)*0.05
    (L if i % 2 else R)[s:s+n] += p
# drums from bar 2 (kick on 1&3, hat on 8ths)
for i in range(int(D/beat)):
    tb = i*beat
    if tb < bar*2 or tb > D-4: continue
    s = int(SR*tb)
    if i % 2 == 0:
        n = int(SR*0.3); tt = t(0.3); f = 120*np.exp(-tt*30)+45
        k = np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*10)*0.35
        L[s:s+n] += k; R[s:s+n] += k
    for h in (0, beat/2):
        s2 = int(SR*(tb+h)); n = int(SR*0.05)
        hh = np.diff(rng.standard_normal(n+1))*np.exp(-t(0.05)*90)*0.03
        L[s2:s2+n] += hh; R[s2:s2+n] += hh*0.8
fade = np.ones(N); fi = int(SR*1.5); fo = int(SR*3)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
save("music.wav", np.stack([L*fade, R*fade], 1), stereo=True)
print("ok")
