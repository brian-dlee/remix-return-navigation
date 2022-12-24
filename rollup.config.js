const typescriptPlugin = require('@rollup/plugin-typescript');

module.exports = {
  external: ['@remix-run/react', 'react'],
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [typescriptPlugin()],
};
