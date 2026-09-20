import { readFile, access, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function fail(message) {
  failures.push(message);
}

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function walk(relativeDir) {
  const dir = path.join(root, relativeDir);
  const entries = await readdir(dir);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const info = await stat(full);
    const rel = path.relative(root, full).replaceAll('\\', '/');
    if (info.isDirectory()) files.push(...await walk(rel));
    else files.push(rel);
  }
  return files;
}

const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const expectedVersions = {
  react: '19.3.0',
  'react-dom': '19.3.0',
  '@eslint/js': '10.0.1',
  typescript: '5.9.2',
  'typescript-eslint': '8.70.0',
  eslint: '10.11.0',
  vite: '8.3.0',
  vitest: '5.0.1',
  '@vitejs/plugin-react': '6.1.1',
  '@types/react': '19.3.0',
  '@types/react-dom': '19.3.0',
};
for (const [name, expected] of Object.entries(expectedVersions)) {
  const actual = packageJson.dependencies?.[name] ?? packageJson.devDependencies?.[name];
  if (actual !== expected) fail(`${name} must be pinned to ${expected}; found ${String(actual)}.`);
}
if (packageJson.devDependencies?.typescript?.startsWith('7.')) {
  fail('TypeScript 7 is not compatible with the pinned typescript-eslint toolchain.');
}
if (packageJson.engines?.node !== '^20.19.0 || >=22.12.0') fail('Node engine must match Vite 8 support: Node 20.19+ or 22.12+.');

for (const required of [
  'index.html',
  'src/main.tsx',
  'api/send-lead.js',
  'src/sections/Contact/ContactPage.tsx',
  'public/privacy.html',
  'public/robots.txt',
  'public/sitemap.xml',
  '.env.example',
]) {
  if (!await exists(required)) fail(`Missing required file: ${required}`);
}

const sourceFiles = [
  ...(await walk('src')).filter(file => /\.(?:ts|tsx|css)$/.test(file)),
  'index.html',
  'public/privacy.html',
  'public/privacy.css',
].filter((file, index, list) => list.indexOf(file) === index);

// Scan every literal local /assets/* or /images/* reference, including srcSet strings.
const localAssetPattern = /['"(](\/(?:assets|images)\/[^'"?#\s)]+)/g;
for (const file of sourceFiles) {
  const content = await readFile(path.join(root, file), 'utf8');
  for (const match of content.matchAll(localAssetPattern)) {
    const publicPath = `public${match[1]}`;
    if (!await exists(publicPath)) fail(`${file} references missing asset ${publicPath}`);
  }
}

const projectsText = await readFile(path.join(root, 'src/data/projects.ts'), 'utf8');
const projectUrls = [...projectsText.matchAll(/url:\s*['"]([^'"]+)['"]/g)].map(match => match[1]);
if (projectUrls.length !== 9) fail(`Expected 9 project URLs, found ${projectUrls.length}.`);
for (const url of projectUrls) {
  if (!url.startsWith('https://')) fail(`Project URL is not HTTPS: ${url}`);
}
const projectImages = [...projectsText.matchAll(/image:\s*['"]([^'"]+\.webp)['"]/g)].map(match => match[1]);
if (projectImages.length !== projectUrls.length) fail(`Expected one image per project; found ${projectImages.length} images for ${projectUrls.length} URLs.`);
for (const image of projectImages) {
  const full = `public${image}`;
  const responsive = `public${image.replace('.webp', '-700.webp')}`;
  if (!await exists(full)) fail(`Missing project image ${full}`);
  if (!await exists(responsive)) fail(`Missing responsive project image ${responsive}`);
}

const envExample = await readFile(path.join(root, '.env.example'), 'utf8');
for (const name of ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'TELEGRAM_MESSAGE_THREAD_ID']) {
  const line = envExample.split(/\r?\n/).find(item => item.startsWith(`${name}=`));
  if (line === undefined) fail(`.env.example is missing ${name}`);
  else if (line !== `${name}=`) fail(`.env.example must not contain a real value for ${name}`);
}

const apiText = await readFile(path.join(root, 'api/send-lead.js'), 'utf8');
if (/TELEGRAM_BOT_TOKEN\s*=\s*['"][^'"]+/.test(apiText)) fail('Hard-coded Telegram bot token detected.');
if (/\[['"]IP['"]/.test(apiText)) fail('The Telegram payload should not forward visitor IP addresses.');

if (failures.length) {
  console.error('Static verification failed:');
  for (const message of failures) console.error(`- ${message}`);
  process.exitCode = 1;
} else {
  console.log('Static verification passed. Dependency pins, required files, local assets, project URLs, environment placeholders and API privacy checks are consistent.');
}
