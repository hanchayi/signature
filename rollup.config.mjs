export default {
	input: 'src/index.js',
	output: [
    {
      dir: 'dist/cjs',
      format: 'cjs'
    },
    {
      dir: 'dist/es',
      format: 'es'
    }
  ]
};