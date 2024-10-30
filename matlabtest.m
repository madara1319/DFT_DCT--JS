clear; clc;


sr = 512;      % Sample rate
Np = 512;      % Number of samples
f = 10;        % Frequency
A = 1;         % Amplitude


t = (0:Np-1) / sr; % time vector


x_sine_1 = A * sin(2*pi*f*t);
x_sine_2 = A * sin(2*pi*f*t) + (A/2) * sin(2*pi*3*f*t); 
x_sine_3 = A * sin(2*pi*f*t) + (A/2) * sin(2*pi*3*f*t) + (-3*A) * sin(2*pi*5*f*t);




function processSignal(x, signalType, sr, f, t, A, index)
    N = length(x);
    k = 0:(N-1);

    
    [X_dft, ~] = mydftk(x, k);

    
    X_fft = fft(x);
    X_dct = dct(x);

    
    results_dft = [real(X_dft(:)) imag(X_dft(:)) abs(X_dft(:)) angle(X_dft(:))];
    results_fft = [real(X_fft(:)) imag(X_fft(:)) abs(X_fft(:)) angle(X_fft(:))];

    
    dlmwrite(['results_' signalType '_dft_' num2str(index) '.csv'], results_dft, 'precision', '%.10f');
    dlmwrite(['results_' signalType '_fft_' num2str(index) '.csv'], results_fft, 'precision', '%.10f');
    dlmwrite(['results_' signalType '_dct_' num2str(index) '.csv'], X_dct(:), 'precision', '%.10f');

    
    if ~strcmp(signalType, 'sine')
        figure('Name', ['Signal Comparison: ' signalType]);

        
        subplot(2,1,1);
        plot(t, x);
        title(['Custom ' signalType ' wave (JS implementation)']);
        xlabel('Time (s)');
        ylabel('Amplitude');

        
        subplot(2,1,2);

    end

    
    figure('Name', ['Signal Analysis: ' signalType]);

    
    subplot(2,2,1);
    plot(t, x);
    title(['Time Domain: ' signalType]);
    xlabel('Time (s)');
    ylabel('Amplitude');

    
    subplot(2,2,2);
    stem(k(1:N/2)/N*sr, abs(X_dft(1:N/2)));
    title('DFT Magnitude Spectrum');
    xlabel('Frequency (Hz)');
    ylabel('|X(f)|');

    
    subplot(2,2,3);
    stem(k(1:N/2)/N*sr, abs(X_fft(1:N/2)));
    title('FFT Magnitude Spectrum');
    xlabel('Frequency (Hz)');
    ylabel('|X(f)|');

    
    subplot(2,2,4);
    stem(k(1:N/2), abs(X_dct(1:N/2)));
    title('DCT Coefficients');
    xlabel('k');
    ylabel('|C(k)|');
end


function [X, W] = mydftk(x, k)
    N = length(x);
    W = exp(-1i * 2 * pi * k(:) * (0:N-1) / N);
    X = W * x(:);
end


processSignal(x_sine_1, 'sine', sr, f, t, A,1);
processSignal(x_sine_2, 'sine', sr, f, t, A,2);
processSignal(x_sine_3, 'sine', sr, f, t, A,3);


dlmwrite('signal_sine_1.csv', x_sine_1(:), 'precision', '%.10f');
dlmwrite('signal_sine_2.csv', x_sine_2(:), 'precision', '%.10f');
dlmwrite('signal_sine_3.csv', x_sine_3(:), 'precision', '%.10f');