import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const FILE_NAME = 'capture-photo';

const banner = `/*!
 * ${pkg.name}
 * ${pkg.description}
 *
 * @version v${pkg.version}
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @homepage ${pkg.homepage}
 * @repository ${pkg.repository.url}
 * @license ${pkg.license}
 */`;

const makeConfig = (env = 'development') => {
  let bundleSuffix = '';

  if (env === 'production') {
    bundleSuffix = 'min.';
  }

  const config = {
    input: `src/${FILE_NAME}.js`,
    output: [
      {
        banner,
        file: `dist/${FILE_NAME}.${bundleSuffix}js`,
        format: 'es',
        exports: 'auto'
      }
    ],
    plugins: []
  };

  if (env === 'production') {
    config.plugins.push(terser({
      output: {
        comments: /^!/
      }
    }));
  }

  return config;
};

export default commandLineArgs => {
  const configs = [
    makeConfig()
  ];

  // Production
  if (commandLineArgs.environment === 'BUILD:production') {
    configs.push(makeConfig('production'));
  }

  return configs;
};
