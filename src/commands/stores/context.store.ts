import { Store } from '../../utils/store';

/*=======*\
*  Types  *
\*=======*/

export type PaletteContextState = SubjectPayload[]
export type SubjectPayload = { type: string, id: string | null  }

/*=========*\
*  Helpers  *
\*=========*/

function display(subject: SubjectPayload) {
  return subject.type + (subject.id ? `[${subject.id}]` : '')
}

function isEqual(a: SubjectPayload, b: SubjectPayload) {
  return a.type === b.type && a.id === b.id;
}

/*=======*\
*  Store  *
\*=======*/

export class PaletteContextStore extends Store<PaletteContextState> {
  static initialState: PaletteContextState = []
  static display = display
  static isEqual = isEqual

  // init() {
  //   console.log('Context:', this.state.map(display))
  // }

  add(subject: SubjectPayload) {
    this.produceState((draft) => {
      let match = draft.findIndex(s => isEqual(s, subject)) > -1
      if (!match) {
        // console.log('ADD', display(subject))
        draft.push(subject)
      }
    })
  }

  remove(subject: SubjectPayload) {
    this.produceState((draft) => {
      let index = draft.findIndex(s => isEqual(s, subject))
      if (index > -1) {
        // console.log('REM', display(subject))
        draft.splice(index, 1)
      }
    })
  }

  hasSubject(subject: SubjectPayload) : boolean {
    return Array.from(this.state).reverse().some((s) => isEqual(subject, s))
  }
  findSubjectWithType(type: string) : SubjectPayload | undefined {
    return Array.from(this.state).reverse().find(subject => subject.type === type)
  }
  findIndexOfSubjectWithType(type: string) {
    return Array.from(this.state).findIndex((subject) => subject.type === type)
  }
}

export const [ PaletteContextProvider, usePaletteContext ] = PaletteContextStore.createContext(PaletteContextStore.initialState)