import React from 'react';
import { PaletteContextProvider, PaletteContextModel } from './models/context.model';
import { TriggersProvider, TriggersModel } from './models/triggers.model';

interface PaletteProviderProps {
  children: React.ReactChild
}

export function PaletteProvider(props: PaletteProviderProps) {
  let palette_context = PaletteContextModel.use(PaletteContextModel.initialState)
  let triggers = TriggersModel.use(TriggersModel.initialState)

  return (
    <PaletteContextProvider model={palette_context}>
      <TriggersProvider model={triggers}>
        {props.children}
      </TriggersProvider>
    </PaletteContextProvider>
  )
}