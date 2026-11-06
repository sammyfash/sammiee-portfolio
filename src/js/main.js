import '../styles/main.css'
import { boot } from './boot.js'
import { initHero } from './hero.js'
import { initAbout } from './about.js'
import { initWork, initWorkLenses } from './work.js'
import { initHire } from './hire.js'
import { initFooter } from './footer.js'
import { initCrew, crewEnabled } from './crew.js'

boot({
  // Built up front so nothing flashes unstyled when the curtain lifts.
  // The build crew (experiment) replaces the section reveals below the hero.
  // ?crew=off, or reduced motion, brings the normal reveals back.
  beforePreloader: crewEnabled()
    ? () => { initWork({ crew: true }); initWorkLenses(); initCrew() }
    : () => { initAbout(); initWork(); initWorkLenses(); initHire(); initFooter() },
  afterPreloader: initHero,
})
