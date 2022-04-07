import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

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

const makeConfig = ({ fileName, env, banner }) => {
  let bundleSuffix = '';

  if (env === 'production') {
    bundleSuffix = 'min.';
  }

  const config = {
    input: `src/${fileName}.js`,
    output: [
      {
        banner,
        file: `dist/${fileName}.${bundleSuffix}js`,
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
    makeConfig({ fileName: 'capture-photo', env: 'development', banner }),
    makeConfig({ fileName: 'capture-photo-defined', env: 'development', banner })
  ];

  // Production
  if (commandLineArgs.environment === 'BUILD:production') {
    configs.push(makeConfig({ fileName: 'capture-photo', env: 'production', banner }));
    configs.push(makeConfig({ fileName: 'capture-photo-defined', env: 'production', banner }));
  }

  return configs;
};
