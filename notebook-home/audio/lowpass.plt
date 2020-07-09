% GNU Octave file (may also work with MATLAB(R) )
Fs=48000;minF=10;maxF=Fs/2;
sweepF=logspace(log10(minF),log10(maxF),200);
[h,w]=freqz([1.782750419661228e-01 0.000000000000000e+00 0.000000000000000e+00],[1 -8.217249580338772e-01 0.000000000000000e+00],sweepF,Fs);
semilogx(w,20*log10(h))
title('SoX effect: lowpass gain=0 frequency=1500 band-width(Hz)=0 (rate=48000)')
xlabel('Frequency (Hz)')
ylabel('Amplitude Response (dB)')
axis([minF maxF -35 25])
grid on
disp('Hit return to continue')
pause
