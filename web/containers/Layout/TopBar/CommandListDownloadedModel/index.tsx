import { Fragment, useEffect, SetStateAction, Dispatch } from 'react'

import { InferenceEngine } from '@janhq/core'
import {
  CommandModal,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Badge,
} from '@janhq/uikit'

import { DatabaseIcon, CpuIcon } from 'lucide-react'

import { MainViewState } from '@/constants/screens'

import { useActiveModel } from '@/hooks/useActiveModel'
import { useGetDownloadedModels } from '@/hooks/useGetDownloadedModels'
import { useMainViewState } from '@/hooks/useMainViewState'

type CommandListDownloadedModelType = {
  open?: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function CommandListDownloadedModel(
  props: CommandListDownloadedModelType
) {
  const { open, setOpen } = props
  const { setMainViewState } = useMainViewState()
  const { downloadedModels } = useGetDownloadedModels()
  const { activeModel, startModel, stopModel } = useActiveModel()

  const onModelActionClick = (modelId: string) => {
    if (activeModel && activeModel.id === modelId) {
      stopModel()
    } else {
      startModel(modelId)
    }
  }

  // const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'e' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isNotDownloadedModel = downloadedModels.length === 0

  if (isNotDownloadedModel) return null

  return (
    <Fragment>
      <CommandModal open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search your model..." />
        <CommandList>
          <CommandEmpty>No Model found.</CommandEmpty>
          {!isNotDownloadedModel && (
            <CommandGroup heading="Your Model">
              {downloadedModels
                .filter((model) => {
                  return model.engine === InferenceEngine.nitro
                })
                .map((model, i) => {
                  return (
                    <CommandItem
                      key={i}
                      value={model.id}
                      onSelect={() => {
                        onModelActionClick(model.id)
                        setOpen(false)
                      }}
                    >
                      <DatabaseIcon
                        size={16}
                        className="mr-3 text-muted-foreground"
                      />
                      <div className="flex w-full items-center justify-between">
                        <span>{model.id}</span>
                        {activeModel && activeModel.id === model.id && (
                          <Badge themes="secondary">Active</Badge>
                        )}
                      </div>
                    </CommandItem>
                  )
                })}
            </CommandGroup>
          )}
          <CommandGroup heading="Find another model">
            <CommandItem
              onSelect={() => {
                setMainViewState(MainViewState.Hub)
                setOpen(false)
              }}
            >
              <CpuIcon size={16} className="mr-3 text-muted-foreground" />
              <span>Explore The Hub</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandModal>
    </Fragment>
  )
}
