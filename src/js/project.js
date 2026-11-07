import '../styles/main.css'
import { boot, guard } from './boot.js'
import { initCase, initVideos } from './case.js'
import { initFooter } from './footer.js'
import { initEcho } from './echo.js'
import { initLightbox } from './lightbox.js'

boot({
  beforePreloader: () => { initFooter(); guard('lightbox', initLightbox) },
  afterPreloader: () => { initCase(); initVideos(); guard('echo', () => initEcho('.case .mock, .case__scene .photo')) },
})
