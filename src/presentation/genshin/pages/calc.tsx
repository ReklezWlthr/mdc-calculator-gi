import Albedo from '@src/data/lib/stats/conditionals/characters/Albedo'
import { useStore } from '@src/data/providers/app_store_provider'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { Tooltip } from '@src/presentation/components/tooltip'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

export const Calculator = observer(({}: {}) => {
  const { teamStore } = useStore()

  const test = Albedo(teamStore.characters[0]?.cons, teamStore.characters[0]?.ascension)

  const { setValue, watch } = useForm<Record<string, any>>({
    defaultValues: _.reduce(
      test.content,
      (acc, curr) => {
        acc[curr.id] = curr.default
        return acc
      },
      {}
    ),
  })
  const values = watch()

  const Conditionals = useCallback(
    () =>
      _.map(test.content, (content) => {
        let Input = () => <></>
        switch (content.type) {
          case 'number':
            Input = () => (
              <TextInput
                type="number"
                value={values[content.id]}
                onChange={(value) => setValue(content.id, parseFloat(value) || '')}
              />
            )
            break
          case 'toggle':
            Input = () => <div></div>
            break
        }

        return (
          content.show && (
            <Tooltip
              title={content.title}
              body={<p dangerouslySetInnerHTML={{ __html: content.content }} />}
              key={content.id}
              style="w-[400px]"
            >
              <div className="grid items-center grid-cols-12 text-sm gap-x-1">
                <p className="w-full col-span-4 text-center truncate" title={content.text}>
                  {content.text}
                </p>
                <Input />
              </div>
            </Tooltip>
          )
        )
      }),
    [test]
  )

  return (
    <div className="flex w-full gap-5 p-5 text-white">
      <div className="w-1/2 rounded-lg bg-primary-darker h-fit">
        <p className="px-4 py-3 text-lg font-bold text-center rounded-t-lg bg-primary-light">Self Conditionals</p>
        <div className="h-[200px] px-4 py-3 space-y-3 overflow-visible">
          <Conditionals />
        </div>
      </div>
    </div>
  )
})
