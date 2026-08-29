import '../styles/main.css'
import { boot } from './boot.js'
import { initHero } from './hero.js'
import { initAbout } from './about.js'
import { initWork } from './work.js'
import { initFooter } from './footer.js'

boot({
  // Built up front so nothing flashes unstyled when the curtain lifts.
  beforePreloader: () => { initAbout(); initWork(); initFooter() },
  afterPreloader: initHero,
})
