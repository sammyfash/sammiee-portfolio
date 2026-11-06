import '../styles/main.css'
import { boot, guard } from './boot.js'
import { initCase, initVideos } from './case.js'
import { initFooter } from './footer.js'
import { initEcho } from './echo.js'

boot({
  beforePreloader: initFooter,
  afterPreloader: () => { initCase(); initVideos(); guard('echo', () => initEcho('.case .mock')) },
})
