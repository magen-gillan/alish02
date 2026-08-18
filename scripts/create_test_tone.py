import math
import wave
from pathlib import Path

out = Path('/tmp/alish02-test-tone.wav')
rate = 44100
duration = 2.0
with wave.open(str(out), 'wb') as handle:
    handle.setnchannels(1)
    handle.setsampwidth(2)
    handle.setframerate(rate)
    for index in range(int(rate * duration)):
        envelope = min(1.0, index / (rate * 0.1), (rate * duration - index) / (rate * 0.1))
        sample = int(12000 * envelope * math.sin(2 * math.pi * 220 * index / rate))
        handle.writeframesraw(sample.to_bytes(2, byteorder='little', signed=True))
print(out)
