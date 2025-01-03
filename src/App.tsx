import { useState, useEffect, useRef } from 'react';
import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import { createPortal } from 'react-dom';
import style from './App.module.css';
import { useLocalStorage } from '@uidotdev/usehooks';
import { getFakeLog } from './get-fake-log';
import type { Log } from './get-fake-log';
import { getRandomNumberBetween, formatDate } from './utils';
import { motion, AnimatePresence } from "motion/react"

import {
  Bug as IconBug,
  Info as IconInfo,
  TriangleAlert as IconTriangleAlert,
  IndentIncrease as IconIdentIncrease,
  Check as IconCheck,
  X as IconX,
  Play as IconPlay,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

const iconsByLogType = {
  info: IconInfo,
  debug: IconBug,
  verbose: IconIdentIncrease,
  warn: IconTriangleAlert,
  success: IconCheck,
} as const;


function AppLoader() {
  return (
    <div className={style.appLoader}>
      <div className={style.appLoaderBody}>
        <div className={style.appLoaderBar}></div>
        <div className={style.appLoaderLogo}><span>UPT</span><span className={style.appLoaderLogoDivider}>|</span><span>N-Gen</span> </div>
        <div className={style.appLoaderTagline}>The Gold Standard in Random Number Generation.</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <AppLoader />
      <AppLoaded />
    </>
  );
}

function AppLoaded() {
  const [tab, setTab] = useState<'generator' | 'history'>('generator');

  return (
    <div className={style.app}>
      <p className={style.titleBar}>UPT | Operating Systems</p>

      <div className={style.body}>
        <div className={style.tabs}>
          <div className={style.tabsHeader}>
            <Tab
              isActive={tab === 'generator'}
              onClick={() => setTab('generator')}
            >
              number-generator.ts
            </Tab>
            <Tab isActive={tab === 'history'} onClick={() => setTab('history')}>
              history.txt
            </Tab>
          </div>

          <div className={style.tabsBody}>
            {
              <TabContent isActive={tab === 'generator'}>
                <NumberGenerator />
              </TabContent>
            }
            {
              <TabContent isActive={tab === 'history'}>
                <History />
              </TabContent>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab({
  isActive,
  children,
  ...props
}: {
  isActive: boolean;
  children: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <button
      {...props}
      className={`${style.tab} ${isActive ? style['is-active'] : ''}`}
    >
      {children}
    </button>
  );
}

function TabContent({
  isActive,
  children,
}: {
  isActive: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`${style.tabContent} ${style[isActive ? 'is-active' : 'is-inactive']
        }`}
    >
      {children}
    </div>
  );
}

function NumberGenerator() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const isNumberSelected = typeof selectedNumber === 'number';
  const [log, setLog] = useState<Log>([]);
  const [isLogAnimating, setIsLogAnimating] = useState<boolean>(false);
  const [isNumberModalOpen, setIsNumberModalOpen] = useState<boolean>(false);

  const setHistory = useLocalStorage<
    { number: number; date: Date }[]
  >('numberHistory', [])[1]

  const terminalEl = useRef<HTMLDivElement | null>(null);
  const terminalBottomEl = useRef<HTMLDivElement | null>(null);
  const autoScroll = useRef<boolean>(true);

  function handleGenerateClick() {
    const number = getRandomNumberBetween(1, 3);
    const log = getFakeLog(number);

    setSelectedNumber(number);
    setHistory((history) => [
      {
        number,
        date: new Date(),
      },
      ...history,
    ]);
    setLog(log);
    setIsLogAnimating(true);
  }

  function handleClearClick() {
    setLog([]);
    setSelectedNumber(null);
    autoScroll.current = true;
  }

  function handleLogAnimationComplete() {
    setIsLogAnimating(false);
    if (selectedNumber) {
      setIsNumberModalOpen(true);
    }
  }

  function handleLogAnimationProgress() {
    if (autoScroll.current) {
      scrollToChatBottom();
    }
  }

  function handleScroll() {
    if (terminalEl.current) {
      autoScroll.current =
        terminalEl.current.scrollHeight -
        terminalEl.current.scrollTop -
        terminalEl.current.clientHeight <
        1;
    }
  }

  function scrollToChatBottom() {
    terminalBottomEl.current?.scrollIntoView({ behavior: 'auto' });
  }

  return (
    <>
      <div className={style.terminal} ref={terminalEl} onScroll={handleScroll}>
        <AnimatedLog
          log={log}
          onComplete={handleLogAnimationComplete}
          onProgress={handleLogAnimationProgress}
        />
        <div ref={terminalBottomEl} style={{ height: '1px' }}></div>
      </div>
      <div className={style.terminalActions}>
        <Button
          disabled={isLogAnimating || !isNumberSelected}
          onClick={handleClearClick}
          icon={IconX}
          variant="error"
        >
          Clear
        </Button>
        <Button
          disabled={isLogAnimating || isNumberSelected}
          onClick={handleGenerateClick}
          icon={IconPlay}
          variant="success"
        >
          Run
        </Button>
      </div>


      {createPortal(
        <AnimatePresence>
          {isNumberModalOpen &&
              <NumberModal
                number={selectedNumber as number}
                onClose={() => setIsNumberModalOpen(false)}
              />
          }
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function AnimatedLog({
  log,
  onProgress = () => { },
  onComplete = () => { },
  onStart = () => { },
}: {
  log: Log;
  onProgress?: () => void;
  onComplete?: () => void;
  onStart?: () => void;
}) {
  const [printedLog, setPrintedLog] = useState<Log>([]);

  useEffect(() => {
    if (printedLog.length === log.length) {
      return;
    }

    setTimeout(() => {
      setPrintedLog((v) => {
        const addNItems = getRandomNumberBetween(1, 5);
        return log.slice(0, v.length + addNItems);
      });
    }, getRandomNumberBetween(100, 300));
  });

  useEffect(() => {
    onStart();
  }, [log]);

  useEffect(() => {
    onProgress();

    if (printedLog.length === log.length) {
      onComplete();
    }
  }, [printedLog.length]);

  return (
    <div>
      {' '}
      {printedLog.map(([type, text], index) => {
        let Icon: null | LucideIcon = null;

        if (typeof type === 'string' && type in iconsByLogType) {
          Icon = iconsByLogType[type as keyof typeof iconsByLogType] as LucideIcon;
        }

        return (
          <div className={style.logItem} key={index}>
            {Icon && <Icon className={style.logItemIcon} size={16} />} {text}
          </div>
        );
      })}
    </div>
  );
}

function History() {
  const [history, setHistory] = useLocalStorage<
    { number: number; date: Date }[]
  >('numberHistory', []);

  function handleClearHistory() {
    setHistory([]);
  }

  return (
    <>
      <div className={style.terminal}>
        {history.map((item, index) => {
          const date = formatDate(new Date(item.date));
          return (
            <div key={index} className={style.historyItem}>
              <div className={style.historyItemNumber}>{item.number}</div>
              <div className={style.historyItemDate}>{date}</div>
            </div>
          );
        })}
      </div>
      <div className={style.terminalActions}>
        <Button
          disabled={!history.length}
          onClick={handleClearHistory}
          icon={IconX}
          variant="error"
        >
          Clear history
        </Button>
      </div>
    </>
  );
}

function NumberModal({
  number,
  onClose,
}: {
  number: number;
  onClose: () => void;
}) {
  return (
    <motion.div
      className={style.modalBackdrop}
        initial={{ opacity: .8 }}
        exit={{ opacity: 0, transition: { duration: .1 } }}
        animate={{ opacity: 1 }}
      >
      <motion.div
        className={style.modal}
        initial={{
          scale: .9
        }}
        exit={{
          scale: .9,
          transition: { duration: .1 }
        }}
        animate={{
          scale: 1
        }}
        >
          
        <div className={style.modalTopBar}>Generated Number</div>
        <div className={style.modalBody}>
          <p className={style.modalTitle}>The generated number is:</p>
          <p className={style.modalNumber}>{number}</p>
        </div>

        <div className={style.modalFooter}>
          <Button onClick={onClose}>Acknowledge</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Button({
  children,
  icon: Icon,
  className,
  variant = 'primary',
  ...props
}: {
  icon?: LucideIcon;
  variant?: 'success' | 'primary' | 'error';
} & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={`${style.button} ${style[`button--${variant}`]} ${className}`}
      {...props}
    >
      {children}
      {Icon && <Icon size={15} />}
    </button>
  );
}

export default App;
