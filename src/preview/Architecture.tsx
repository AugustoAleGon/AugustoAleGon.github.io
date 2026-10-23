import { lazy, Suspense } from 'react';
import type { Story, Text } from './content';
import { isInstrumentId } from './instruments/registry';
const Instrument = lazy(() => import('./instruments/Instrument'));
const ConsoleArchitecture = lazy(() => import('./ConsoleArchitecture'));

export default function Architecture({ story, tr }: { story: Story; tr: (text: Text) => string }) {
  return (
    <Suspense fallback={<p>{tr(['Loading the instrument…', 'Cargando el instrumento…'])}</p>}>
      {isInstrumentId(story.id) ? (
        <Instrument key={story.id} id={story.id} story={story} tr={tr} />
      ) : (
        <ConsoleArchitecture key={story.id} story={story} tr={tr} />
      )}
    </Suspense>
  );
}
