import classNames from 'classnames'
import _ from 'lodash'

export const RarityGauge = ({ rarity, textSize = 'text-xs' }: { rarity: number; textSize?: string }) => {
  return (
    <div
      className={classNames('w-full flex justify-center', textSize, {
        'text-genshin-dendro': rarity === 2,
        'text-genshin-hydro': rarity === 3,
        'text-genshin-electro': rarity === 4,
        'text-genshin-geo': rarity === 5,
        'text-primary-lighter': !rarity,
      })}
    >
      {_.map(Array(rarity || 1), () => (
        <span>✦</span>
      ))}
    </div>
  )
}
