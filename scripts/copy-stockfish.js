import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const srcDir = path.join(rootDir, 'node_modules', 'stockfish', 'src')
const destDir = path.join(rootDir, 'public', 'stockfish')

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

// Map files to copy
const filesToCopy = [
  { src: 'stockfish-nnue-16.js', dest: 'stockfish.js' },
  { src: 'stockfish-nnue-16.wasm', dest: 'stockfish.wasm' },
  { src: 'nn-5af11540bbfe.nnue', dest: 'nn-5af11540bbfe.nnue' }
];

filesToCopy.forEach(({ src, dest }) => {
  const srcPath = path.join(srcDir, src);
  const fallbackPath = path.join(srcDir, dest);
  const destPath = path.join(destDir, dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`${src} copied to public/stockfish/${dest}`);
  } else if (fs.existsSync(fallbackPath)) {
    fs.copyFileSync(fallbackPath, destPath);
    console.log(`${dest} copied to public/stockfish/${dest}`);
  } else {
    console.log(`${src} or ${dest} not found in node_modules/stockfish/src/`);
  }
});
