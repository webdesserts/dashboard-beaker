import React from 'react';
import * as Styles from './Log.styles';
import { EntryGrid } from './EntryGrid';
import { DayOverview } from './DayOverview'
import { DateTime, Interval } from 'luxon'
import { EntriesProvider, Entry, useEntries, EntriesStore } from './stores/entries';
import { ActiveEntryProvider, useActiveEntry, ActiveEntryStore } from './stores/active_entry';
import { RouteComponentProps } from '@reach/router'
import { useSubjectTrigger } from '../commands';
import { useAuth } from '../utils/auth';

export { Log, LogProvider }

type LogProps = RouteComponentProps

function getInterval(entry: Entry) : Interval {
  return Interval.fromDateTimes(entry.start, entry.end || DateTime.local())
}

function Log (props: LogProps) {
  let { user, isAuthenticated } = useAuth()
  let active_entry = useActiveEntry()
  let entries = useEntries()
  useSubjectTrigger('Log', { enabled: isAuthenticated })

  if (!isAuthenticated) return null

  let day_start = DateTime.local().minus({ days: 0 }).startOf('day')
  let day = Interval.fromDateTimes(day_start, day_start.endOf('day'))
  let day_log = entries.state.filter((entry) => day.intersection(getInterval(entry))).sort((a, b) => b.start.diff(a.start).as('seconds'))

  return (
    <Styles.Log>
      <DayOverview day={day_start} entries={day_log} active_entry={active_entry.state} />
      <EntryGrid activeEntry={active_entry.state} entries={entries.state} />
    </Styles.Log>
  );
}

type LogProviderProps = {
  children: React.ReactNode
}

function LogProvider({ children }: LogProviderProps) {
  let entries = EntriesStore.useState(EntriesStore.initialState)
  let active_entry = ActiveEntryStore.useState(ActiveEntryStore.initialState)

  return (
    <EntriesProvider store={entries}>
      <ActiveEntryProvider store={active_entry}>
        <>{children}</>
      </ActiveEntryProvider>
    </EntriesProvider>
  );
}