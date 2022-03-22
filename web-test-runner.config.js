import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  rootDir: '.',
  files: 'test/*.test.js',
  concurrentBrowsers: 3,
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' })
  ]
};
