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

export default {
  input: 'src/index.js',
  output: [
    {
      banner,
      file: pkg['module'],
      format: 'es'
    }
  ],
  plugins: [
    terser({
      output: {
        comments: /^!/
      }
    })
  ]
};
