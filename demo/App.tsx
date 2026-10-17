import {
  Button,
  Heading,
  Hub,
  HubSection,
  Link,
  MetroProvider,
  Page,
  PageTransition,
  Stack,
  Subheading,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tile,
  TileGrid,
  TileGroup,
  metroAccents,
  type AccentColor,
  type MetroAccentName,
  type MetroTheme,
  type ShapePreset,
} from 'metro-glass';
import type { ReactNode } from 'react';
import {
  ArrowLeftIcon,
  CalendarIcon,
  MailIcon,
  MusicIcon,
  PeopleIcon,
  PhotoIcon,
  SettingsIcon,
  StoreIcon,
  SunIcon,
  landscape,
} from '../src/stories/icons';
import { navigate, usePath } from './router';
import { useSettings, type DemoSettings } from './settings';

interface AppInfo {
  id: string;
  title: string;
  accent: AccentColor;
  icon: ReactNode;
}

const apps: AppInfo[] = [
  { id: 'mail', title: 'Mail', accent: 'teal', icon: <MailIcon /> },
  { id: 'calendar', title: 'Calendar', accent: 'orange', icon: <CalendarIcon /> },
  { id: 'people', title: 'People', accent: 'violet', icon: <PeopleIcon /> },
  { id: 'weather', title: 'Weather', accent: 'cyan', icon: <SunIcon /> },
  { id: 'photos', title: 'Photos', accent: 'magenta', icon: <PhotoIcon /> },
];
const appById = Object.fromEntries(apps.map((a) => [a.id, a]));
const open = (id: string) => () => navigate(`/apps/${id}`, 'continuum');

export function App() {
  const path = usePath();
  const [settings, update] = useSettings();

  let page: ReactNode;
  if (path.startsWith('/apps/') && appById[path.slice(6)]) page = <AppPage app={appById[path.slice(6)]} />;
  else if (path === '/hub') page = <HubPage />;
  else if (path === '/settings') page = <SettingsPage settings={settings} update={update} />;
  else if (path === '/') page = <StartPage />;
  else page = <NotFound />;

  return (
    <MetroProvider accent={settings.accent} theme={settings.theme} shape={settings.shape} className="demo-root">
      <Page>
        <a className="demo-skip mg-focusable" href="#content">Skip to content</a>
        <header className="demo-bar mg-glass">
          <a className="demo-brand mg-focusable" href="/" onClick={intercept('/', 'slide-back')}>
            <span className="demo-logo" aria-hidden="true" />
            metro glass
          </a>
          <nav aria-label="Main">
            <Stack as="ul" direction="row" gap={4} align="center">
              <li><Link variant="standalone" href="/hub" onNavigate={() => navigate('/hub', 'slide')}>Hub</Link></li>
              <li><Link variant="standalone" href="/settings" onNavigate={() => navigate('/settings', 'turnstile')}>Personalise</Link></li>
              <li><Link variant="standalone" href="/storybook/">Storybook</Link></li>
            </Stack>
          </nav>
        </header>
        <PageTransition id="content" className="demo-content">
          {page}
        </PageTransition>
      </Page>
    </MetroProvider>
  );
}

const intercept = (to: string, type: Parameters<typeof navigate>[1]) => (e: React.MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  navigate(to, type);
};

function StartPage() {
  return (
    <Stack gap={6}>
      <div>
        <Subheading as="p" tone="caps">React UI library</Subheading>
        <Heading level={1} size="display" lowercase>start</Heading>
        <Subheading>
          Metro's typographic grid, live tiles and kinetic motion — in Liquid Glass. Press a tile (try several fingers at once), pinch the grid, or{' '}
          <Link variant="inline" href="/settings" onNavigate={() => navigate('/settings')}>pick your accent</Link>.
        </Subheading>
      </div>
      <TileGrid aria-label="Start" semanticZoom>
        <TileGroup title="Life at a glance">
          <Tile size="wide" accent="cyan" title="Weather" liveAnimation="peek" transitionName="app-weather" onClick={open('weather')}>
            <Stack direction="row" gap={4} align="center">
              <SunIcon width={52} height={52} />
              <div><div className="demo-big">23°</div>Stuttgart · sunny</div>
            </Stack>
            <div><div className="demo-mid">Tomorrow</div>19° / 11° · light showers</div>
            <div><div className="demo-mid">Weekend</div>Warm and dry, 25°</div>
          </Tile>
          <Tile accent="teal" icon={<MailIcon />} title="Mail" badge={5} transitionName="app-mail" onClick={open('mail')} />
          <Tile accent="orange" title="Calendar" transitionName="app-calendar" onClick={open('calendar')}>
            <div className="demo-mid">Fri 17</div>
            <div>Design review</div>
            <div>14:00 · Studio 3</div>
          </Tile>
          <Tile size="small" accent="red" icon={<MusicIcon />} title="Music" onClick={() => navigate('/hub', 'slide')} />
          <Tile size="small" accent="lime" icon={<StoreIcon />} title="Storybook" href="/storybook/" />
          <Tile size="small" accent="steel" icon={<SettingsIcon />} title="Personalise" onClick={() => navigate('/settings')} />
          <Tile size="small" accent="violet" icon={<PeopleIcon />} title="People" transitionName="app-people" onClick={open('people')} />
        </TileGroup>
        <TileGroup title="Play and explore" columns={4}>
          <Tile size="wide" variant="glass" title="Photos" liveAnimation="fade" liveInterval={5000} transitionName="app-photos" onClick={open('photos')}>
            <img className="demo-fill" src={landscape(210)} alt="Mountains above a lake" />
            <img className="demo-fill" src={landscape(20)} alt="Desert ridge at sunset" />
            <img className="demo-fill" src={landscape(300)} alt="Violet hills at dusk" />
          </Tile>
          <Tile accent="magenta" icon={<MusicIcon />} title="music + videos" onClick={() => navigate('/hub', 'slide')} />
          <Tile variant="glass" title="About" href="https://github.com/ginomessmer/metro-glass">
            <div className="demo-mid">metro-glass</div>
            <div>Source on GitHub</div>
          </Tile>
        </TileGroup>
      </TileGrid>
    </Stack>
  );
}

function AppPage({ app }: { app: AppInfo }) {
  return (
    <MetroProvider accent={app.accent} style={{ display: 'contents' }}>
      <Stack gap={5}>
        <Button variant="outline" shape="circle" icon={<ArrowLeftIcon />} aria-label="Back to start" onClick={() => navigate('/', 'slide-back')} />
        <Heading level={1} size="display" lowercase accent transitionName={`app-${app.id}`}>{app.title}</Heading>
        {app.id === 'weather' ? <WeatherBody /> : app.id === 'photos' ? <PhotosBody /> : <ListBody app={app} />}
      </Stack>
    </MetroProvider>
  );
}

const people = ['Anna Weber', 'Jonas Becker', 'Lea Fischer', 'Noah Wagner', 'Mia Schulz', 'Elias Hoffmann'];

function ListBody({ app }: { app: AppInfo }) {
  const line = (i: number) =>
    app.id === 'mail' ? `Re: ${['Launch plan', 'Tile sizes', 'Glass contrast', 'Pivot motion', 'Accent tokens', 'Weekend'][i]}` : app.id === 'calendar' ? `${9 + i}:00 · ${['Stand-up', 'Design review', 'Lunch', '1:1', 'Focus time', 'Gym'][i]}` : 'Last seen today';
  return (
    <Tabs defaultValue="all">
      <TabList aria-label={`${app.title} views`}>
        <Tab value="all">all</Tab>
        <Tab value="recent">recent</Tab>
        <Tab value="favourites">favourites</Tab>
      </TabList>
      {(['all', 'recent', 'favourites'] as const).map((tab, t) => (
        <TabPanel key={tab} value={tab}>
          <Stack as="ul" gap={4}>
            {people.slice(0, 6 - t * 2).map((p, i) => (
              <li key={p}>
                <Heading level={2} size="section">{p}</Heading>
                <Subheading>{line(i)}</Subheading>
              </li>
            ))}
          </Stack>
        </TabPanel>
      ))}
    </Tabs>
  );
}

function WeatherBody() {
  return (
    <Stack gap={5}>
      <Stack direction="row" gap={5} align="center" wrap>
        <SunIcon width={96} height={96} aria-hidden />
        <div>
          <div className="demo-huge">23°</div>
          <Subheading>Stuttgart · sunny · feels like 24°</Subheading>
        </div>
      </Stack>
      <Tabs defaultValue="daily" variant="segmented">
        <TabList aria-label="Forecast">
          <Tab value="hourly">Hourly</Tab>
          <Tab value="daily">Daily</Tab>
        </TabList>
        <TabPanel value="hourly">
          <Stack direction="row" gap={2} wrap>
            {[23, 22, 21, 19, 17, 15].map((t, i) => (
              <Tile key={i} size="small" variant="glass" title={`${15 + i}:00`}><div className="demo-mid">{t}°</div></Tile>
            ))}
          </Stack>
        </TabPanel>
        <TabPanel value="daily">
          <Stack direction="row" gap={2} wrap>
            {['Sat', 'Sun', 'Mon', 'Tue'].map((d, i) => (
              <Tile key={d} variant="glass" title={d}><div className="demo-big">{[19, 25, 22, 18][i]}°</div></Tile>
            ))}
          </Stack>
        </TabPanel>
      </Tabs>
    </Stack>
  );
}

function PhotosBody() {
  return (
    <div className="demo-photos">
      {[200, 20, 300, 140, 250, 40, 170, 330].map((h) => (
        <img key={h} src={landscape(h)} alt="" className="demo-photo" />
      ))}
    </div>
  );
}

function HubPage() {
  return (
    <Hub title="music + videos" background={landscape(280)}>
      <HubSection title="collection">
        <Stack gap={2}>
          {['music', 'videos', 'podcasts', 'radio'].map((x) => (
            <Link key={x} variant="nav" href="#" onClick={(e) => e.preventDefault()}>{x}</Link>
          ))}
        </Stack>
      </HubSection>
      <HubSection title="history" width="wide">
        <Stack direction="row" gap={2} wrap>
          {[['Daft Punk', 'magenta'], ['Bonobo', 'orange'], ['Röyksopp', 'cobalt'], ['Moderat', 'emerald']].map(([n, a]) => (
            <Tile key={n} accent={a} title={n} icon={<MusicIcon />} onClick={() => {}} />
          ))}
        </Stack>
      </HubSection>
      <HubSection title="new">
        <Subheading>Fresh releases from artists you follow show up here. Scroll sideways — the title drifts slower than the content.</Subheading>
      </HubSection>
      <HubSection title="apps">
        <Stack direction="row" gap={2} wrap>
          <Tile size="small" accent="lime" icon={<StoreIcon />} title="Store" onClick={() => {}} />
          <Tile size="small" accent="steel" icon={<SettingsIcon />} title="Settings" onClick={() => navigate('/settings')} />
        </Stack>
      </HubSection>
    </Hub>
  );
}

function SettingsPage({ settings, update }: { settings: DemoSettings; update: (p: Partial<DemoSettings>) => void }) {
  return (
    <Stack gap={6}>
      <div>
        <Subheading as="p" tone="caps">Settings</Subheading>
        <Heading level={1} lowercase>personalise</Heading>
        <Subheading>One accent token re-tints every surface. Saved in this browser.</Subheading>
      </div>
      <Stack gap={3}>
        <Heading level={2} size="header" lowercase id="accent-heading">accent</Heading>
        <div role="radiogroup" aria-labelledby="accent-heading" className="demo-swatches">
          {(Object.keys(metroAccents) as MetroAccentName[]).map((name) => (
            <Tile
              key={name}
              size="small"
              accent={name}
              title={name}
              role="radio"
              aria-checked={settings.accent === name}
              className="demo-swatch"
              onClick={() => update({ accent: name })}
            />
          ))}
        </div>
      </Stack>
      <Stack gap={3}>
        <Heading level={2} size="header" lowercase>theme</Heading>
        <Tabs value={settings.theme} onValueChange={(v) => update({ theme: v as MetroTheme })} variant="segmented" animated={false}>
          <TabList aria-label="Theme">
            <Tab value="system">System</Tab>
            <Tab value="light">Light</Tab>
            <Tab value="dark">Dark</Tab>
          </TabList>
        </Tabs>
      </Stack>
      <Stack gap={3}>
        <Heading level={2} size="header" lowercase>shape</Heading>
        <Tabs value={settings.shape} onValueChange={(v) => update({ shape: v as ShapePreset })} variant="segmented" animated={false}>
          <TabList aria-label="Shape">
            <Tab value="metro">Metro</Tab>
            <Tab value="blend">Blend</Tab>
            <Tab value="glass">Glass</Tab>
          </TabList>
        </Tabs>
      </Stack>
      <Stack direction="row" gap={3} wrap>
        <Button variant="accent" onClick={() => navigate('/', 'slide-back')}>Done</Button>
        <Button variant="glass" onClick={() => update({ accent: 'cobalt', theme: 'system', shape: 'blend' })}>Reset</Button>
      </Stack>
    </Stack>
  );
}

function NotFound() {
  return (
    <Stack gap={4}>
      <Heading level={1} size="display" lowercase>not found</Heading>
      <Link variant="nav" href="/" onNavigate={() => navigate('/', 'slide-back')}>back to start</Link>
    </Stack>
  );
}
