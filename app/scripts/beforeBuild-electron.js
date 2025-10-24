#!/usr/bin/env node

/**
 * Hook: Copia iconos e assets APPX antes del build de Electron
 * Desde: resources/windows/appx/
 * Hacia: platforms/electron/build-res/appx/
 */

const fs = require('fs');
const path = require('path');

module.exports = function (ctx) {
  const src = path.join(ctx.opts.projectRoot, 'resources', 'windows', 'settings', 'icons');
  const dest = path.join(ctx.opts.projectRoot, 'platforms', 'electron', 'build-res', 'appx');

  if (!fs.existsSync(src)) {
    console.log('⚠️  Doesnt exists resources/windows/appx, exit...');
    return;
  }

  console.log(`📦 Copying Appx files from ${src} → ${dest}`);

  // Crear carpeta destino si no existe
  fs.mkdirSync(dest, { recursive: true });

  // Función recursiva para copiar archivos
  const copyRecursive = (srcDir, destDir) => {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        console.log(`📦 Copying ${srcPath} to ${destPath} ...`);
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };

  copyRecursive(src, dest);

  console.log('✅ Appx files succesfully copied.');
};
