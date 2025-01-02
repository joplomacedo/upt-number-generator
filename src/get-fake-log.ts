import { getRandomNumberBetween } from './utils';

const getRandomPercentageString = (
  min: number = 0,
  max: number = 100
): string =>
  `${(getRandomNumberBetween(min * 100, max * 100) / 100).toFixed(2)}%`;

const addRandomDecimals = (num: number): number => {
  const decimals = Math.floor(Math.random() * 100000);
  return Number(`${num}.${decimals.toString().padStart(5, '0')}`);
};

type LogItem = [string | null, string];
type Log = LogItem[];

function getFakeLog(number: number): Log {
  const quantumCoherenceInitial = getRandomPercentageString(70, 97);
  const entropyStabilization = getRandomPercentageString(70, 97);
  const quantumCoherenceStabilized = getRandomPercentageString(99, 99.99);
  const parallelTimelines = getRandomNumberBetween(1300, 2900);
  const rawNumber = addRandomDecimals(number);

  const log: Log = [
    [
      'info',
      'Initializing Advanced Stochastic Number Generation System v3.14159...',
    ],
    ['debug', 'Loading quantum fluctuation matrices...'],
    ['info', 'Calibrating entropy pools...'],
    ['verbose', 'Establishing connection to local time-space fabric...'],
    ['debug', 'Time-space fabric connection established'],
    ['info', 'Beginning pre-generation system checks...'],
    ['debug', 'Validating integer boundaries [1-3]...'],
    ['verbose', 'Integer boundaries confirmed'],
    ['info', 'Initializing primary random core...'],
    ['debug', 'Loading probability distribution templates...'],
    ['verbose', 'Checking uniform distribution parameters...'],
    ['info', 'Spinning up quantum uncertainty calculator...'],
    [
      `debug`,
      `Quantum state initialized at ${quantumCoherenceInitial} coherence`,
    ],
    ['verbose', 'Applying Heisenberg compensation filters...'],
    ['info', 'Activating temporal flux monitors...'],
    ['debug', 'Temporal stability at nominal levels'],
    ['warn', 'Minor entropy fluctuation detected - applying corrections'],
    [`info`, `Entropy stabilized at ${entropyStabilization}`],
    ['debug', 'Initializing parallel universe sampling...'],
    [`verbose`, `Sampling ${parallelTimelines} parallel timelines...`],
    ['info', 'Parallel sampling complete - convergence achieved'],
    ['debug', 'Loading cosmic background radiation filters...'],
    ['verbose', 'Background radiation levels nominal'],
    ['info', 'Preparing primary number generation sequence...'],
    [`debug`, `Quantum coherence stabilized at ${quantumCoherenceStabilized}`],
    ['verbose', 'Initializing butterfly effect compensators...'],
    ['info', 'Butterfly effect neutralized'],
    ['debug', 'Loading probability matrices...'],
    ['verbose', 'Matrices loaded - checking integrity...'],
    ['info', 'Matrix integrity confirmed'],
    ['debug', 'Spinning up random number turbines...'],
    ['verbose', 'Turbine speed at optimal levels'],
    ['info', 'Engaging primary number generation sequence...'],
    ['debug', 'Quantum state collapsed successfully'],
    ['verbose', 'Processing quantum output...'],
    [`info`, `Raw quantum value: ${rawNumber}`],
    ['debug', 'Applying integer constraints...'],
    ['verbose', 'Constraint application successful'],
    ['info', 'Performing final validation checks...'],
    ['debug', 'Distribution uniformity verified'],
    ['verbose', 'Checking for temporal paradoxes...'],
    ['info', 'No paradoxes detected'],
    ['debug', 'Finalizing number generation...'],
    ['verbose', 'All systems nominal'],
    ['success', 'Random number generation complete'],
    [`info`, `Generated value: ${number}`],
    ['debug', 'Beginning system cooldown sequence...'],
    ['verbose', 'Deactivating quantum cores...'],
    ['info', 'Quantum cores safely deactivated'],
    ['debug', 'Storing entropy for future use...'],
    ['verbose', 'Entropy successfully preserved'],
    ['info', 'Shutting down temporal monitors...'],
    ['debug', 'All systems successfully deactivated'],
    ['verbose', 'Generation cycle complete'],
    ['info', 'System ready for next generation request'],
  ];

  return log;
}

export type { Log, LogItem };

export { getFakeLog };
