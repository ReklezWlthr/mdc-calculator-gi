import { IContent } from '@src/domain/genshin/conditional'
import { Element } from '@src/domain/genshin/constant'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { Tooltip } from '@src/presentation/components/tooltip'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { Dispatch, SetStateAction, useState } from 'react'

interface IContentIndex extends IContent {
  index: number
}

interface ConditionalBlockProps {
  title: string
  contents: IContentIndex[]
  form: Record<string, any>[]
  setForm: Dispatch<SetStateAction<Record<string, any>[]>>
  tooltipStyle?: string
}

export const ConditionalBlock = observer(
  ({ title, contents, form, setForm, tooltipStyle = 'w-[40vw]' }: ConditionalBlockProps) => {
    const [open, setOpen] = useState(true)

    return (
      <div className="w-full rounded-lg bg-primary-darker h-fit">
        <p
          className={classNames(
            'px-2 py-1 text-lg font-bold text-center duration-300 cursor-pointer bg-primary-light',
            open ? 'rounded-t-lg' : 'rounded-lg'
          )}
          onClick={() => setOpen((prev) => !prev)}
        >
          {title}
          <i
            className={classNames(
              'ml-2 text-base align-top fa-solid fa-caret-down duration-300',
              open && '-rotate-180'
            )}
          />
        </p>
        <div
          className={classNames(
            'space-y-3 duration-300 ease-out px-4',
            open ? 'h-fit overflow-visible py-3' : 'h-0 overflow-hidden'
          )}
        >
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
                        style={tooltipStyle}
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
                              const replace = { ...formValue[content.index], [content.id]: e.target.checked }
                              if (content.id === 'melt_forward') replace.vape_reverse = false
                              if (content.id === 'vape_reverse') replace.melt_forward = false
                              formValue[content.index] = replace
                              return _.cloneDeep(formValue)
                            })
                          }
                          checked={form[content.index]?.[content.id]}
                          name={content.id}
                        />
                      </div>
                    )}
                    {content.type === 'element' && (
                      <div className="flex items-center justify-center col-span-3">
                        <SelectInput
                          value={form[content.index]?.[content.id]}
                          options={
                            content.options || [
                              { name: Element.PYRO, value: Element.PYRO },
                              { name: Element.HYDRO, value: Element.HYDRO },
                              { name: Element.CRYO, value: Element.CRYO },
                              { name: Element.ELECTRO, value: Element.ELECTRO },
                            ]
                          }
                          onChange={(value) =>
                            setForm((formValue) => {
                              formValue[content.index] = { ...formValue[content.index], [content.id]: value }
                              return _.cloneDeep(formValue)
                            })
                          }
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
