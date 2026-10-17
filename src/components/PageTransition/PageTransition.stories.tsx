import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PageTransition } from './PageTransition';
import { useViewTransition, type MetroTransitionType } from '../../hooks/useViewTransition';
import { Button } from '../Button/Button';
import { Heading, Subheading } from '../Typography/Heading';
import { Link } from '../Link/Link';
import { Stack } from '../Layout/Stack';
import { Tile } from '../Tile/Tile';
import { ArrowLeftIcon, CalendarIcon, MailIcon, PeopleIcon } from '../../stories/icons';
import { Tab, TabList, Tabs } from '../Tabs/Tabs';

const meta = {
  title: 'Patterns/Page transitions',
  component: PageTransition,
  parameters: {
    docs: {
      description: {
        component:
          'Page changes run inside `document.startViewTransition`. Metro Glass ships the Metro choreography — turnstile, continuum, slide — as view transition types. Shared elements (`transitionName` on Tile/Heading) morph between pages.',
      },
    },
  },
} satisfies Meta<typeof PageTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

const apps = [
  { id: 'mail', title: 'Mail', icon: <MailIcon />, accent: 'teal' },
  { id: 'calendar', title: 'Calendar', icon: <CalendarIcon />, accent: 'orange' },
  { id: 'people', title: 'People', icon: <PeopleIcon />, accent: 'violet' },
] as const;

export const MiniApp: Story = {
  name: 'Mini app',
  render: function Render() {
    const [route, setRoute] = useState<string>('home');
    const [type, setType] = useState<MetroTransitionType>('continuum');
    const transition = useViewTransition();
    const go = (to: string, t: MetroTransitionType = type) => transition(() => setRoute(to), { types: [t] });
    const app = apps.find((a) => a.id === route);

    return (
      <Stack gap={5}>
        <Tabs value={type} onValueChange={(v) => setType(v as MetroTransitionType)} variant="segmented" animated={false}>
          <TabList aria-label="Transition type">
            <Tab value="continuum">Continuum</Tab>
            <Tab value="turnstile">Turnstile</Tab>
            <Tab value="slide">Slide</Tab>
            <Tab value="fade">Fade</Tab>
          </TabList>
        </Tabs>
        <PageTransition>
          {app ? (
            <Stack gap={5}>
              <Button variant="outline" shape="circle" icon={<ArrowLeftIcon />} aria-label="Back" onClick={() => go('home', type === 'slide' ? 'slide-back' : type)} />
              <Heading level={1} size="display" lowercase transitionName={`app-${app.id}`}>{app.title}</Heading>
              <Subheading>The tile morphed into this heading via a shared view-transition-name.</Subheading>
            </Stack>
          ) : (
            <Stack gap={5}>
              <Heading level={1} lowercase>start</Heading>
              <Stack direction="row" gap={2} wrap>
                {apps.map((a) => (
                  <Tile key={a.id} accent={a.accent} icon={a.icon} title={a.title} transitionName={`app-${a.id}`} onClick={() => go(a.id)} />
                ))}
              </Stack>
              <Link variant="nav" href="#calendar" onNavigate={() => setRoute('calendar')} transition={type}>
                open calendar
              </Link>
            </Stack>
          )}
        </PageTransition>
      </Stack>
    );
  },
};
