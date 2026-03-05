// Script para gerar ícones PNG a partir do SVG
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tamanhos necessários
const sizes = [192, 512];

async function generateIcons() {
    try {
        // Tenta usar sharp se estiver instalado
        let sharp;
        try {
            sharp = (await import('sharp')).default;
        } catch (e) {
            console.log('⚠️  Sharp não instalado. Instalando...');
            console.log('Por favor, execute: npm install -D sharp');
            console.log('\nOu use um conversor online:');
            console.log('1. Vá a https://convertio.co/svg-png/');
            console.log('2. Converta icons/icon-source.svg para PNG 512x512');
            console.log('3. Redimensione para 192x192');
            console.log('4. Salve como icons/icon-192.png e icons/icon-512.png');
            return;
        }

        const svgBuffer = readFileSync(join(__dirname, 'icon-source.svg'));

        for (const size of sizes) {
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(join(__dirname, `icon-${size}.png`));
            
            console.log(`✅ Gerado: icon-${size}.png`);
        }

        console.log('\n🎉 Ícones gerados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao gerar ícones:', error.message);
    }
}

generateIcons();