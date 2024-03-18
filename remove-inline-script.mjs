import glob from 'tiny-glob';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateHash(content, length = 16) {
  return createHash('sha256').update(content).digest('hex').substring(0, length);
}

async function removeInlineScript(directory) {
  console.log('removing inline scripts...');
  const files = await glob('**/*.html', {
    cwd: directory,
    dot: true,
    absolute: true,
    filesOnly: true
  });

  for (const file of files) {
    console.log(`edit file: ${file}`);
    let htmlContent = fs.readFileSync(file, { encoding: 'utf-8' });

    let match;
    const scriptRegx = /<script[^>]*>([\s\S]*?)<\/script>/g;
    while ((match = scriptRegx.exec(htmlContent))) {
      const inlineContent = match[1];
      const hash = generateHash(inlineContent);
      const scriptFilename = `script_${hash}.js`;
      const scriptFilePath = path.join(directory, scriptFilename);

      htmlContent = htmlContent.replace(match[0], `<script src="${scriptFilename}"></script>`);

      if (!fs.existsSync(scriptFilePath)) {
        fs.writeFileSync(scriptFilePath, inlineContent, 'utf-8');
        console.log(`inline script extracted and saved at: ${scriptFilePath}`);
      }
    }

    fs.writeFileSync(file, htmlContent, 'utf-8');
  }
}

removeInlineScript(path.resolve(__dirname, 'build'));
