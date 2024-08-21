import fs from 'fs/promises';
import * as esbuild from 'esbuild';

const readPkg = async () => {
  return JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url)));
};

const pkg = await readPkg();

const makeBanner = pkg => `/*!
 * ${pkg.name}
 * ${pkg.description}
 *
 * @version ${pkg.version}
 * @homepage ${pkg.homepage}
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @license ${pkg.license}
 */`;

await esbuild.build({
  entryPoints: ['src/capture-photo.js', 'src/capture-photo-defined.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'esm',
  outdir: 'dist',
  banner: {
    js: makeBanner(pkg)
  }
});
