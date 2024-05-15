import { IContent } from '@src/domain/genshin/conditional'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { Tooltip } from '@src/presentation/components/tooltip'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { Dispatch, SetStateAction } from 'react'

interface IContentIndex extends IContent {
  index: number
}

export const ConditionalBlock = observer(
  ({
    title,
    contents,
    form,
    setForm,
    selected,
  }: {
    title: string
    contents: IContentIndex[]
    form: Record<string, any>[]
    setForm: Dispatch<SetStateAction<Record<string, any>[]>>
    selected: number
  }) => {
    return (
      <div className="w-full rounded-lg bg-primary-darker h-fit">
        <p className="px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">{title}</p>
        <div className="max-h-[200px] px-4 py-3 space-y-3 overflow-visible">
          {_.size(_.filter(contents, 'show')) ? (
            _.map(
              contents,
              (content) =>
                content.show && (
                  <div className="grid items-center grid-cols-12 text-xs gap-x-1" key={content.id}>
                    <div className="col-span-6">
                      <Tooltip
                        title={content.title}
                        body={<p dangerouslySetInnerHTML={{ __html: content.content }} />}
                        key={content.id}
                        style="w-[40vw]"
                      >
                        <p className="w-full text-xs text-center text-white truncate">{content.text}</p>
                      </Tooltip>
                    </div>
                    <div className={classNames('col-span-2 text-center', content.debuff ? 'text-red' : 'text-blue')}>
                      {content.debuff ? 'Debuff' : 'Buff'}
                    </div>
                    {content.type === 'number' && (
                      <TextInput
                        type="number"
                        value={form[content.index]?.[content.id]}
                        onChange={(value) =>
                          setForm((formValue) => {
                            formValue[content.index] = {
                              ...formValue[content.index],
                              [content.id]: parseFloat(value) || '',
                            }
                            return _.cloneDeep(formValue)
                          })
                        }
                        max={content.max}
                        min={content.min}
                        style="col-span-2"
                      />
                    )}
                    {content.type === 'toggle' && (
                      <div className="flex items-center justify-center col-span-2">
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            setForm((formValue) => {
                              formValue[content.index] = { ...formValue[content.index], [content.id]: e.target.checked }
                              return _.cloneDeep(formValue)
                            })
                          }
                          checked={form[content.index]?.[content.id]}
                          name={content.id}
                        />
                      </div>
                    )}
                  </div>
                )
            )
          ) : (
            <div className="text-center text-gray">None</div>
          )}
        </div>
      </div>
    )
  }
)
