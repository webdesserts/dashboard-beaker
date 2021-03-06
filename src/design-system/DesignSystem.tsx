import React, { useState } from 'react'
import * as Styled from './DesignSystem.styles'
import { DateTime, Duration } from 'luxon'
import { RouteComponentProps } from '@reach/router'

import { Textbox } from '../controls/Textbox'
import { Timebox } from '../controls/Timebox'
import { Durationbox } from '../controls/Durationbox'
import { Selectable, MultiSelectable } from '../controls/Selectable'
import { Button } from '../controls/Button';

type Props = RouteComponentProps
type State = {
  time: DateTime
  dur: Duration
  color: string,
  bkgs: string[]
}

export default class DesignSystem extends React.Component<Props, State> {
  state: State = {
    time: DateTime.local(),
    dur: Duration.fromObject({ hours: 1, minutes: 30 }),
    color: 'red',
    bkgs: ['papayawhip']
  }

  updateTime = (time: DateTime) => this.setState({ time })
  updateDuration = (dur: Duration) => this.setState({ dur })
  updateColor = (color: string, option: string, isSelected: boolean) => this.setState({ color })
  updateGem = (bkgs: string[], option: string, isSelected: boolean) => this.setState({ bkgs })

  render () {
    let { time, dur, color, bkgs } = this.state
    return (
      <Styled.DesignSystem>
        <h1>Design System</h1>
        <Styled.LightFrame>
          <h2>Light Theme</h2>
          <label htmlFor="textbox">Textbox</label>
          <Textbox id="textbox" defaultValue="hello" />
          <label htmlFor="timebox">Timebox</label>
          <Timebox id="timebox" time={time} onChange={this.updateTime} />
          <label htmlFor="durationbox">Durationbox</label>
          <Durationbox id="durationbox" value={dur} onChange={this.updateDuration} />
          <Button>Submit</Button>
        </Styled.LightFrame>
        <Styled.DarkFrame>
          <h2>Dark Theme</h2>
          <label htmlFor="textbox">Textbox</label>
          <Textbox id="textbox" defaultValue="hello" />
          <label htmlFor="timebox">Timebox</label>
          <Timebox id="timebox" time={time} onChange={this.updateTime} />
          <Button>Submit</Button>
        </Styled.DarkFrame>
        <Styled.LightFrame>
          <h2>Selectable</h2>
          <Selectable required value={color} options={['red', 'green', 'blue']} onChange={this.updateColor} optionRenderer={
            (color, isSelected, triggerSelect) => (
              <span key={color} style={isSelected ? { color, fontWeight: 'bold' }: {}} onClick={triggerSelect}>{color}</span>
            )}/>
          <MultiSelectable value={bkgs} options={['papayawhip', 'whitesmoke', 'azure']} onChange={this.updateGem} optionRenderer={
            (bkg, isSelected, triggerSelect) => (
              <span key={bkg} style={isSelected ? { backgroundColor: bkg, fontWeight: 'bold' } : {}} onClick={triggerSelect}>{bkg}</span>
            )}/>
        </Styled.LightFrame>
      </Styled.DesignSystem>
    )
  }
}