import { SignalGenerator } from './SignalGenerator.js';
import { DFT } from './DFT.js';
import { DCT } from './DCT.js';
import fs from 'fs';

function loadCsvData(filePath) {
    const csvText = fs.readFileSync(filePath, 'utf-8');
    return csvText.split('\n')
        .filter(line => line.trim())
        .map(line => line.split(',').map(Number));
}

function compareResults(jsResults, matlabResults, tolerance = 1e-4) {
    const differences = {
        maxDiff: 0,
        avgDiff: 0,
        numMismatches: 0,
        totalComparisons: Math.min(jsResults.length, matlabResults.length),
        tolerance
    };
    
    let sumDiff = 0;
    
    for (let i = 0; i < differences.totalComparisons; i++) {
        let jsVal, matlabVal;
        
        // Handle different data formats
        if (typeof jsResults[i] === 'object' && jsResults[i] !== null) {
            // DFT format
            jsVal = Math.sqrt(
                Math.pow(jsResults[i].real, 2) + 
                Math.pow(jsResults[i].imag, 2)
            );
            matlabVal = Math.sqrt(
                Math.pow(matlabResults[i][0], 2) + 
                Math.pow(matlabResults[i][1], 2)
            );
        } else {
            // DCT format
            jsVal = Math.abs(jsResults[i]);
            matlabVal = Math.abs(Array.isArray(matlabResults[i]) ? 
                matlabResults[i][0] : matlabResults[i]);
        }
        
        const diff = Math.abs(jsVal - matlabVal);
        sumDiff += diff;
        differences.maxDiff = Math.max(differences.maxDiff, diff);
        
        if (diff > tolerance) {
            differences.numMismatches++;
        }
    }
    
    differences.avgDiff = sumDiff / differences.totalComparisons;
    return differences;
}

function formatResults(differences, transformType) {
    return `
${transformType} Comparison Results:
----------------------------------------
Maximum difference: ${differences.maxDiff.toExponential(4)}
Average difference: ${differences.avgDiff.toExponential(4)}
Number of mismatches (>${differences.tolerance}): ${differences.numMismatches}
Total comparisons: ${differences.totalComparisons}
Accuracy rate: ${(100 * (1 - differences.numMismatches / differences.totalComparisons)).toFixed(2)}%
`;
}

async function runSignalTests() {
    const sampleRate = 512;
    const frequency = 10;
    const length = 512;
    const amplitude = 1;

    // Generate base sine wave
    const baseSignal = SignalGenerator.generateSineWave(frequency, amplitude, sampleRate, length);
    const baseValues = Array.from(baseSignal.values());

    // Create three different signals according to MATLAB implementation
    const signals = {
        sine_1: baseValues,
        sine_2: baseValues.map((value, index) => {
            const t = index / sampleRate;
            return amplitude * Math.sin(2 * Math.PI * frequency * t) + 
                   (amplitude/2) * Math.sin(2 * Math.PI * 3 * frequency * t);
        }),
        sine_3: baseValues.map((value, index) => {
            const t = index / sampleRate;
            return amplitude * Math.sin(2 * Math.PI * frequency * t) + 
                   (amplitude/2) * Math.sin(2 * Math.PI * 3 * frequency * t) + 
                   (-3 * amplitude) * Math.sin(2 * Math.PI * 5 * frequency * t);
        })
    };

    // Perform transformations for each signal
    const results = {};
    for (const [signalType, signal] of Object.entries(signals)) {
        const dft = new DFT(signal);
        const dct = new DCT(signal);
        
        results[signalType] = {
            dft: dft.transform(),
            dct: dct.transform(),
            original: signal
        };

        // Save original signal to CSV
        fs.writeFileSync(
            `signal_${signalType}.csv`,
            signal.join('\n'),
            'utf-8'
        );
    }

    return results;
}

async function main() {
    // Run tests for all signals
    const testResults = await runSignalTests();
    
    // Compare with MATLAB results
    for (let i = 1; i <= 3; i++) {
        const signalKey = `sine_${i}`;
        
        for (const transformType of ['dft', 'dct', 'fft']) {
            const matlabResults = loadCsvData(
                `results_sine_${transformType}_${i}.csv`
            );
            
            const jsResults = testResults[signalKey][
                transformType === 'fft' ? 'dft' : transformType
            ];

            const differences = compareResults(jsResults, matlabResults);
            console.log(
                formatResults(differences, 
                `SINE_${i} ${transformType.toUpperCase()}`)
            );
        }

        // Save detailed results
        const detailedResults = {
            signal: signalKey,
            originalSignal: testResults[signalKey].original.slice(0, 10),
            dftResults: testResults[signalKey].dft.slice(0, 10),
            dctResults: testResults[signalKey].dct.slice(0, 10)
        };

        fs.writeFileSync(
            `detailed_results_${signalKey}.json`,
            JSON.stringify(detailedResults, null, 2)
        );
    }
}

main().catch(error => {
    console.error('Error during signal tests:', error);
    process.exit(1);
});
