import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/parseObj.js',
    output: {
      file: 'public/mp4-reader.js',
      name: 'mp4Reader',
      format: 'umd'
    },
    plugins: [
        resolve(),
        babel({
          exclude: 'node_modules/**' 
        })
      ]
};