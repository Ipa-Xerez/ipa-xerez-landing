import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { importIpaMembers } from './server/db.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function importMembers() {
  try {
    console.log('📥 Importando socios de IPA Xerez...\n');

    // Leer el archivo JSON de socios
    const membersPath = path.join(__dirname, '../upload/socios_ipa_xerez.json');
    const membersData = JSON.parse(fs.readFileSync(membersPath, 'utf-8'));

    console.log(`✓ Archivo cargado: ${membersData.length} socios encontrados\n`);

    // Importar socios a la BD
    const imported = await importIpaMembers(membersData);

    console.log(`✓ ${imported} socios importados exitosamente\n`);
    console.log('✅ Importación completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    process.exit(1);
  }
}

importMembers();
