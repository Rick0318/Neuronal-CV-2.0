// Script para generar un HTML completamente autocontenido
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const distDir = './dist';
const assetsDir = join(distDir, 'assets');

// Leer index.html
let html = readFileSync(join(distDir, 'index.html'), 'utf-8');

// Leer y encontrar el JS y CSS en assets
const files = readdirSync(assetsDir);
const jsFile = files.find(f => f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

if (!jsFile || !cssFile) {
  console.error('No se encontraron archivos JS o CSS en dist/assets');
  process.exit(1);
}

const jsContent = readFileSync(join(assetsDir, jsFile), 'utf-8');
const cssContent = readFileSync(join(assetsDir, cssFile), 'utf-8');

// Reemplazar <link rel="stylesheet"> con <style> inline
html = html.replace(
  /<link rel="stylesheet"[^>]*>/g,
  `<style>${cssContent}</style>`
);

// Reemplazar <script type="module"> con script inline
html = html.replace(
  /<script type="module"[^>]*src="[^"]*"[^>]*><\/script>/g,
  `<script type="module">${jsContent}</script>`
);

const outPath = './Neural-CV-Standalone.html';
writeFileSync(outPath, html, 'utf-8');

const size = (html.length / 1024 / 1024).toFixed(2);
console.log(`✓ Archivo standalone creado: ${outPath} (${size} MB)`);
console.log('  Puedes abrirlo directamente en el navegador con doble clic.');
