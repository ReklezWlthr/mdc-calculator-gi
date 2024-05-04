import classNames from 'classnames'
import _ from 'lodash'

export const RarityGauge = ({ rarity }: { rarity: number }) => {
  return (
    <div
      className={classNames('text-xs w-full flex justify-center', {
        'text-genshin-hydro': rarity === 3,
        'text-genshin-electro': rarity === 4,
        'text-genshin-geo': rarity === 5,
        'text-primary-lighter': !rarity || rarity === 2,
      })}
    >
      {_.map(Array(rarity || 1), () => (
        <span>✦</span>
      ))}
    </div>
  )
}
