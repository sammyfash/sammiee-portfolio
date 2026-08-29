import '../styles/main.css'
import { boot } from './boot.js'
import { initCase, initVideos } from './case.js'
import { initFooter } from './footer.js'

boot({
  beforePreloader: initFooter,
  afterPreloader: () => { initCase(); initVideos() },
})
