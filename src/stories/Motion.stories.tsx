import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button/Button';
import { Stack } from '../components/Layout/Stack';
import { PageTransition } from '../components/PageTransition/PageTransition';
import { Tab, TabList, Tabs } from '../components/Tabs/Tabs';
import { Tile, type TileLiveAnimation } from '../components/Tile/Tile';
import { Heading, Subheading } from '../components/Typography/Heading';
import { useViewTransition, type MetroTransitionType } from '../hooks/useViewTransition';
import { CalendarIcon, MailIcon, PhotoIcon, SunIcon, landscape } from './icons';

/**
 * Frame-rate readout for judging motion on a real device. Counts frames per
 * 500 ms window and keeps the slowest frame of that window; anything over
 * ~33 ms is a visible hitch.
 */
function FpsMeter() {
  const [stats, setStats] = useState({ fps: 0, worst: 0 });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let windowStart = last;
    let frames = 0;
    let worst = 0;
    const tick = (now: number) => {
      worst = Math.max(worst, now - last);
      last = now;
      frames += 1;
      if (now - windowStart >= 500) {
        setStats({ fps: Math.round((frames * 1000) / (now - windowStart)), worst: Math.round(worst) });
        windowStart = now;
        frames = 0;
        worst = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="mg-glass"
      style={{
        position: 'fixed',
        insetBlockEnd: 12,
        insetInlineEnd: 12,
        zIndex: 10,
        padding: '6px 12px',
        borderRadius: 'var(--mg-radius-md)',
        fontSize: 12,
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--mg-fg)',
        pointerEvents: 'none',
      }}
    >
      {stats.fps} fps · worst {stats.worst} ms
    </div>
  );
}

const withFpsMeter: Decorator = (Story) => (
  <>
    <Story />
    <FpsMeter />
  </>
);

const meta = {
  title: 'Patterns/Motion lab',
  decorators: [withFpsMeter],
  parameters: {
    docs: {
      description: {
        component:
          'A bench for judging motion on a real device (open the deployed Storybook on a phone). The meter in the corner shows frames per second and the slowest frame of the last half second.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const durations = [
  ['fast', '--mg-duration-fast'],
  ['normal', '--mg-duration-normal'],
  ['slow', '--mg-duration-slow'],
] as const;

const easings = [
  ['out', '--mg-ease-out'],
  ['in', '--mg-ease-in'],
  ['spring', '--mg-ease-spring'],
] as const;

export const Easings: Story = {
  name: 'Durations & easings',
  parameters: {
    docs: {
      description: {
        story:
          'Every duration/easing token pair, running the same move. `out` is the Metro exponential deceleration; `spring` overshoots.',
      },
    },
  },
  render: function Render() {
    const [on, setOn] = useState(false);

    return (
      <Stack gap={5}>
        <div>
          <Heading level={1} lowercase>easings</Heading>
          <Subheading>Press play to run every duration and easing token.</Subheading>
        </div>
        <Button variant="accent" onClick={() => setOn((value) => !value)}>
          Play
        </Button>
        <Stack gap={3}>
          {easings.flatMap(([easing, easingVar]) =>
            durations.map(([duration, durationVar]) => (
              <div
                key={`${easing}-${duration}`}
                style={{ display: 'grid', gridTemplateColumns: '9rem 1fr', alignItems: 'center', gap: 12 }}
              >
                <code style={{ fontSize: 13 }}>{easing} · {duration}</code>
                <div style={{ containerType: 'inline-size', blockSize: 24 }}>
                  <div
                    className="mg-glass"
                    data-tint="accent"
                    style={{
                      inlineSize: 24,
                      blockSize: 24,
                      borderRadius: 'var(--mg-radius-md)',
                      transform: on ? 'translateX(calc(100cqw - 24px))' : 'translateX(0)',
                      transition: `transform var(${durationVar}) var(${easingVar})`,
                    }}
                  />
                </div>
              </div>
            )),
          )}
        </Stack>
      </Stack>
    );
  },
};

const liveTypes: Array<[TileLiveAnimation, string]> = [
  ['flip', 'Flip'],
  ['peek', 'Peek'],
  ['fade', 'Fade'],
];

export const LiveTiles: Story = {
  name: 'Live tiles',
  parameters: {
    docs: {
      description: {
        story:
          'All three live-tile animations side by side on a short interval. Look for a flash of the new face before it animates in.',
      },
    },
  },
  render: function Render() {
    const [paused, setPaused] = useState(false);

    return (
      <Stack gap={5}>
        <div>
          <Heading level={1} lowercase>live tiles</Heading>
          <Subheading>Flip, peek and fade, rotating every 2 seconds.</Subheading>
        </div>
        <Button onClick={() => setPaused((value) => !value)} aria-pressed={paused}>
          {paused ? 'Resume' : 'Pause'}
        </Button>
        <Stack direction="row" gap={2} wrap>
          {liveTypes.map(([type, label], i) => (
            <Tile
              key={type}
              size="medium"
              accent={(['cobalt', 'magenta', 'teal'] as const)[i]}
              title={label}
              liveAnimation={type}
              liveInterval={2000}
              paused={paused}
            >
              <div style={{ display: 'grid', placeItems: 'center', blockSize: '100%' }}>
                <SunIcon width={48} height={48} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 300 }}>23°</div>
              <div style={{ display: 'grid', placeItems: 'center', blockSize: '100%' }}>
                <MailIcon width={48} height={48} />
              </div>
            </Tile>
          ))}
          <Tile size="wide" accent="orange" title="Photos" liveAnimation="peek" liveInterval={2000} paused={paused}>
            <img src={landscape(200)} alt="Mountain lake at dusk" style={{ inlineSize: '100%', blockSize: '100%', objectFit: 'cover', borderRadius: 6 }} />
            <img src={landscape(20)} alt="Desert ridge at sunset" style={{ inlineSize: '100%', blockSize: '100%', objectFit: 'cover', borderRadius: 6 }} />
          </Tile>
        </Stack>
      </Stack>
    );
  },
};

export const Press: Story = {
  name: 'Press & tilt',
  parameters: {
    docs: {
      description: {
        story:
          'Hold a tile near an edge to push that edge down; tap the centre to sink it. Release should settle smoothly with no snap, and several tiles can be held at once on a touch screen.',
      },
    },
  },
  render: () => (
    <Stack gap={5}>
      <div>
        <Heading level={1} lowercase>press</Heading>
        <Subheading>Press and hold, then release.</Subheading>
      </div>
      <Stack direction="row" gap={2} align="start" wrap>
        <Tile size="small" accent="lime" icon={<MailIcon />} title="Mail" onClick={() => {}} />
        <Tile size="medium" accent="cyan" icon={<CalendarIcon />} title="Calendar" onClick={() => {}} />
        <Tile size="medium" variant="glass" icon={<PhotoIcon />} title="Glass" onClick={() => {}} />
        <Tile size="wide" accent="violet" icon={<SunIcon />} title="Weather" badge={5} onClick={() => {}} />
        <Tile size="large" accent="crimson" icon={<PhotoIcon />} title="Photos" onClick={() => {}} />
      </Stack>
    </Stack>
  ),
};

const transitionTypes: MetroTransitionType[] = ['turnstile', 'continuum', 'slide', 'fade'];

/** Scoped override used by the "flatten glass" experiment below. */
const flatGlassCss = '.mg-motion-lab[data-flat] .mg-glass { backdrop-filter: none; }';

export const Transitions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Swaps two pages with each view transition type. "Flatten glass" removes `backdrop-filter` for the duration of the transition, to compare how the glass looks in the snapshots and how smooth the motion gets.',
      },
    },
  },
  render: function Render() {
    const [page, setPage] = useState<'a' | 'b'>('a');
    const [type, setType] = useState<MetroTransitionType>('turnstile');
    const [flatten, setFlatten] = useState(false);
    const labRef = useRef<HTMLDivElement>(null);
    const transition = useViewTransition();

    const swap = () => {
      const lab = labRef.current;
      if (flatten && lab) lab.dataset.flat = '';
      transition(() => setPage((current) => (current === 'a' ? 'b' : 'a')), { types: [type] }).finally(() => {
        if (lab) delete lab.dataset.flat;
      });
    };

    return (
      <div ref={labRef} className="mg-motion-lab">
        <style>{flatGlassCss}</style>
        <Stack gap={5}>
          <Tabs value={type} onValueChange={(v) => setType(v as MetroTransitionType)} variant="segmented" animated={false}>
            <TabList aria-label="Transition type">
              {transitionTypes.map((t) => (
                <Tab key={t} value={t}>{t}</Tab>
              ))}
            </TabList>
          </Tabs>
          <Stack direction="row" gap={2} wrap>
            <Button variant="accent" onClick={swap}>Swap page</Button>
            <Button onClick={() => setFlatten((value) => !value)} aria-pressed={flatten}>
              Flatten glass: {flatten ? 'on' : 'off'}
            </Button>
          </Stack>
          <PageTransition>
            {page === 'a' ? (
              <Stack gap={4}>
                <Heading level={1} lowercase>page a</Heading>
                <Stack direction="row" gap={2} wrap>
                  <Tile accent="cobalt" icon={<MailIcon />} title="Mail" />
                  <Tile accent="orange" icon={<CalendarIcon />} title="Calendar" />
                  <Tile size="wide" variant="glass" icon={<SunIcon />} title="Weather" />
                </Stack>
              </Stack>
            ) : (
              <Stack gap={4}>
                <Heading level={1} lowercase>page b</Heading>
                <Stack direction="row" gap={2} wrap>
                  <Tile size="wide" accent="magenta" icon={<PhotoIcon />} title="Photos" />
                  <Tile variant="glass" icon={<MailIcon />} title="Mail" />
                  <Tile accent="lime" icon={<CalendarIcon />} title="Calendar" />
                </Stack>
              </Stack>
            )}
          </PageTransition>
        </Stack>
      </div>
    );
  },
};
