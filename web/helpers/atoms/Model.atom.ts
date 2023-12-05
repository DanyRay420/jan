import { Model } from '@janhq/core'
import { atom } from 'jotai'

export const stateModel = atom({ state: 'start', loading: false, model: '' })
export const activeAssistantModelAtom = atom<Model | undefined>(undefined)
export const downloadingModelsAtom = atom<Model[]>([])