import React, { useRef, useEffect, RefObject } from 'react';
import * as Styles from './PaletteTrigger.styles';
import { usePaletteContext } from './stores/context.store';
import { useTriggers, NodeTriggerState, AutoTriggerState } from './stores/triggers.store';

type SubjectProps = {
  type: string,
  id?: string,
}

type AutoTriggerProps = {
  children: React.ReactNode
} & SubjectProps

type SubjectHookOptions = {
  id?: string,
  enabled?: boolean
}

export function useSubjectTrigger(type: string, options: SubjectHookOptions = {}) {
  let { id = null, enabled = true } = options
  let subject = { type, id }
  let triggers = useTriggers()

  useEffect(() => {
    let trigger: AutoTriggerState = { subject, auto: true, $node: null }

    if (enabled) {
      triggers.add(trigger)
    } else {
      triggers.remove(trigger)
    }

    return () => {
      triggers.remove(trigger)
    }
  }, [type, id])
}

export function AutoTrigger(props: AutoTriggerProps) {
  let { type, id, children } = props
  useSubjectTrigger(type, { id })
  return <>{children}</>
}

type TriggerProps = {
  children: React.ReactNode
} & SubjectProps & React.HTMLAttributes<HTMLDivElement>


export function Trigger(props: TriggerProps) {
  let { onClick, tabIndex, type, id = null, ...otherProps } = props

  let subject = { type, id }
  let blockRef = useRef(null);
  let context = usePaletteContext()
  let triggers = useTriggers()

  useEffect(() => {
    let $node = blockRef.current
    if ($node) {
      let trigger: NodeTriggerState = { subject, $node, auto: false }

      triggers.add(trigger)

      return () => {
        triggers.remove(trigger)
      }
    }
  // Apparently this might not always work as expected?
  }, [blockRef])

  let inContext = Boolean(context.state.find((s) => s.type === subject.type && s.id === subject.id))

  function handleClick (event: React.MouseEvent<HTMLDivElement>) {
    if (props.onClick) props.onClick(event);
  }

  return (
    <Styles.Trigger ref={blockRef} inContext={inContext} tabIndex={0} onClick={handleClick} {...otherProps} />
  )
}

export function useTriggersManager(palette: RefObject<HTMLElement>, onContextFocus: () => void) {
  let triggers = useTriggers()
  let context = usePaletteContext()

  for (let trigger of triggers.state) {
    if (trigger.auto) {
      context.add(trigger.subject)
    }
  }

  for (let subject of context.state) {
    let trigger = triggers.findBySubject(subject)
    if (!trigger) {
      context.remove(subject)
    }
  }

  function isWithinPalette($target: HTMLElement) {
    return palette.current && ($target === palette.current || palette.current.contains($target))
  }

  function handleClickOrFocus(event: Event) {
    let $target = event.target as HTMLElement
    if (!document.documentElement.contains($target)) return;
    for (let trigger of triggers.state) {
      if (trigger.auto) continue;
      if ($target === trigger.$node || trigger.$node.contains($target)) {
        context.add(trigger.subject)
        if (event.type === 'click') onContextFocus()
      } else if (!isWithinPalette($target)) {
        context.remove(trigger.subject)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOrFocus)
    document.addEventListener('focus', handleClickOrFocus, { capture: true })
    return () => {
      document.removeEventListener('click', handleClickOrFocus)
      document.removeEventListener('focus', handleClickOrFocus, { capture: true })
    }
  }) 
}