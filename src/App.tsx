import React, { useEffect } from 'react'
import { Router } from '@reach/router'
import { Log } from './log/Log'
import DesignSystem from './design-system/DesignSystem'
import { Palette, Subject, Command } from './commands/Palette';
import { useActiveEntry } from './log/models/active_entry';
import { useEntries } from './log/models/entries';
import { useAuth } from './utils/auth';
import * as Styled from './App.styles'
import { useSubjectTrigger } from './commands';

export function App() {
  let { isLoading, user, isAuthenticated, loginWithRedirect, logout, getTokenSilently } = useAuth()
  let active_entry = useActiveEntry()
  let entries = useEntries()
  useSubjectTrigger('Account')

  useEffect(() => {
    if (isAuthenticated) {
      getTokenSilently().then((token) => {
        console.log({ token })
      })
    }
  }, [isAuthenticated])

  if (isLoading) {
    return <Styled.App>Loading...</Styled.App>
  }

  console.log({
    isAuthenticated,
    isLoading,
    user
  })

  return (
    <Styled.App>
      <Router>
        <Log path="/" />
        <DesignSystem path="/design" />
      </Router>
      <Palette>
        <Subject type="Account">
          <Command name="login" description="Log in or Register to Logger" enabled={!isAuthenticated} onSubmit={loginWithRedirect}/>
          <Command name="logout" description="Log out of your account" enabled={isAuthenticated} onSubmit={logout}/>
        </Subject>
        <Subject type="Log">
          <Command name="start" description="Starts a new Entry" params={{
            sector: { type: 'string', required: true },
            project: { type: 'string', required: true },
            description: { type: 'string', required: true },
          }} onSubmit={(data) => {
            active_entry.start(data)
          }}/>
        </Subject>

        <Subject type="Entry (Active)">
          <Command name="stop" description="Stops the log" onSubmit={() => {
            let entry = active_entry.stop()
            if (entry) entries.create(entry)
          }} />
        </Subject>

        <Subject.WithId type="Entry">{(id: string) => {
          let entry = entries.find(id)

          // TODO: why are we hitting this after delete?
          // if (!entry) throw Error(`Could not find entry with id: ${id}`)
          if (!entry) return null

          return <>
            <Command name="delete" description="Deletes an entry" onSubmit={() => entries.delete(id)} />
            <Command name="edit" description="Edits an existing Entry"
              params={{
                sector: { type: 'string', required: true, defaultValue: entry.sector },
                project: { type: 'string', required: true, defaultValue: entry.project },
                description: { type: 'string', required: true, defaultValue: entry.description },
                start: { type: 'time', required: true, defaultValue: entry.start },
                end: { type: 'time', required: true, defaultValue: entry.end }
              }}
              onSubmit={(data) => {
                entries.update(id, data)
              }}
            />
          </>
        }}
        </Subject.WithId>
      </Palette>
    </Styled.App>
  )
}