import { BulletPoint } from '@src/presentation/components/collapsible'
import { observer } from 'mobx-react-lite'

export const InteractionModal = observer(() => {
  return (
    <div className="w-[50vw] bg-primary-dark rounded-lg py-3 px-4 space-y-2 text-white grid grid-cols-2 gap-x-5">
      <p className="text-lg font-bold col-span-full">ICDs & Interactions</p>
      <div className="text-xs text-gray space-y-1.5">
        <b className="text-base text-white">Particle ICDs</b>
        <BulletPoint>
          <b>Alhaitham</b>'s <b className="text-genshin-dendro">Mirror Attacks</b>:{' '}
          <span className="text-desc">1.6</span>s; up to <span className="text-desc">3/5/8</span> Particles over{' '}
          <span className="text-desc">4/8/12</span>s
        </BulletPoint>
        <BulletPoint>
          <b>Faruzan</b>'s <b className="text-genshin-anemo">Pressurized Collapse Vortex</b>:{' '}
          <span className="text-desc">5.5</span>s
        </BulletPoint>
        <BulletPoint>
          <b>Gaming</b>'s <b className="text-genshin-pyro">Charmed Cloudstrider</b>:{' '}
          <span className="text-desc">3</span>s
        </BulletPoint>
        <BulletPoint>
          <b>Hu Tao</b>'s <b className="text-genshin-pyro">Converted Attacks</b>: <span className="text-desc">5</span>s;
          up to <span className="text-desc">2</span> Particles over <span className="text-desc">9</span>s
        </BulletPoint>
        <BulletPoint>
          <b>Kirara</b>'s <b className="text-genshin-dendro">Neko Parcel Hit</b>: <span className="text-desc">4</span>s;
          up to <span className="text-desc">3</span> Particles
        </BulletPoint>
        <BulletPoint>
          <b>Ayato</b>'s <b className="text-genshin-hydro">Shunsuiken</b>: <span className="text-desc">2.5</span>s; up
          to <span className="text-desc">3</span> Particles over <span className="text-desc">6</span>s
        </BulletPoint>
        <BulletPoint>
          <b>Sayu</b>'s <b className="text-genshin-anemo">Fuufuu Whirldwind Hit</b>:{' '}
          <span className="text-desc">3</span>s; up to <span className="text-desc">4</span> Particles
        </BulletPoint>
        <BulletPoint>
          <b>Tartaglia</b>'s <b className="text-genshin-hydro">Riptide Flash/Slash</b>:{' '}
          <span className="text-desc">2</span>s; shared
        </BulletPoint>
        <BulletPoint>
          <b>Wanderer</b>'s <b className="text-genshin-anemo">Enhanced NA/CA</b>: <span className="text-desc">2</span>s;
          shared
          <div className="mt-1 ml-1">
            <BulletPoint color="text-desc">
              <span className="text-desc">10</span> seconds base uptime without moving; can be increased with{' '}
              <b className="text-genshin-hydro">Hydro</b> <b>Absorption</b> and <b>C6</b>, up to{' '}
              <span className="text-desc">~14</span> seconds.
            </BulletPoint>
          </div>
        </BulletPoint>
        <BulletPoint>
          <b>Wriothesley</b>'s <b className="text-genshin-cryo">Enhanced NA/CA</b>: <span className="text-desc">2</span>
          s; shared
          <div className="mt-1 ml-1">
            <BulletPoint color="text-desc">
              Only generate Particles if current HP <span className="text-desc">&#x3e;=50%</span>.
            </BulletPoint>
          </div>
        </BulletPoint>
        <BulletPoint>
          <b>Yoimiya</b>'s <b className="text-genshin-pyro">Converted Attacks</b>: <span className="text-desc">2</span>
          s; up to <span className="text-desc">4</span> Particles over <span className="text-desc">10</span>s
          <div className="mt-1 ml-1">
            <BulletPoint color="text-desc">
              Her Skill may generate an extra Particle. To account for this, add <span className="text-desc">0.25</span>{' '}
              in <b>Full Uptime</b> or <span className="text-desc">1</span> in <b>Enhanced NA</b>.
            </BulletPoint>
          </div>
        </BulletPoint>
        <BulletPoint>
          <b>Chevreuse</b>'s <b className="text-genshin-pyro">Skill</b>: <span className="text-desc">10</span>s
          <div className="mt-1 ml-1">
            <BulletPoint color="text-desc">
              <b>Constellation 4</b> resets CD.
            </BulletPoint>
          </div>
        </BulletPoint>
        <BulletPoint>
          <b>Ningguang</b>'s <b className="text-genshin-geo">Skill</b>: <span className="text-desc">6</span>s
          <div className="mt-1 ml-1">
            <BulletPoint color="text-desc">
              <b>Constellation 2</b> resets CD.
            </BulletPoint>
          </div>
        </BulletPoint>
      </div>
      <div className="text-xs text-gray space-y-1.5">
        <b className="text-base text-white">Notable Interactions</b>
        <BulletPoint>
          <b>Qiqi</b>, <b>Noelle</b>, and <b>Barbara</b> are the only 3 characters so far that{' '}
          <b className="text-red">CANNOT</b> generate Particles with their Skills.
        </BulletPoint>
        <BulletPoint>
          <b>Chiori</b>'s <b className="text-genshin-geo">Extra Tamoto</b> does <b className="text-red">NOT</b> generate
          any Particles.
        </BulletPoint>
        <BulletPoint>
          Only one of <b>Yae Miko</b>'s <b className="text-genshin-electro">Sesshou Sakura</b> can generate Particles.
        </BulletPoint>
        <BulletPoint>
          <b>Zhongli</b>'s <b className="text-genshin-geo">Stone Steles</b> share a{' '}
          <span className="text-desc">1.5</span>s ICD with one another.
        </BulletPoint>
        <BulletPoint>
          <b>Fischl</b>'s' Burst also summons <b className="text-genshin-electro">Oz</b> which acts as an extra Skill
          cast but is not counted towards one. If you use her Burst every other rotation, put{' '}
          <span className="text-desc">0.5</span> in <b>Skill Cast</b> and <span className="text-desc">2</span> in{' '}
          <b>Rotation per Burst</b> instead.
        </BulletPoint>
        <BulletPoint>
          <b>Emilie</b>'s Burst briefly replaces her <b className="text-genshin-dendro">Case</b> with a Level-3 one,
          causing her to miss <span className="text-desc">1</span> Particle.
        </BulletPoint>
        <BulletPoint>
          During <b>Dehya</b>'s Burst, her <b className="text-genshin-pyro">Fiery Sanctum</b> will stop generating
          Particles.
        </BulletPoint>
        <BulletPoint>
          <b>Kokomi</b>'s <b>A4 Passive</b> allows her Burst to refresh her <b className="text-genshin-hydro">Kurage</b>
          's duration, effectively doubling her skill uptime when timed correctly.
        </BulletPoint>
      </div>
    </div>
  )
})
