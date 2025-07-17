import { join } from 'path';
import { readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';

const modelDir = '/home/user/cupidai3d_DecorMeshOptimized_Compressed/public/models';

const files = readdirSync(modelDir);

files.forEach(file => {
  const filePath = join(modelDir, file);
  const isFile = statSync(filePath).isFile();

  if (isFile && file.endsWith('.glb')) {
    console.log(`Optimizing ${filePath}...`);
    try {
      // Simplify the mesh. Overwrite the original file.
      execSync(`npx gltf-transform simplify "${filePath}" "${filePath}" --ratio 0.5`, { stdio: 'inherit' });
      // Apply Draco compression. Overwrite the original file.
      execSync(`npx gltf-transform draco "${filePath}" "${filePath}"`, { stdio: 'inherit' });
      // Apply texture compression to KTX2 (Basis Universal ETC1S). Overwrite the original file.
      execSync(`npx gltf-transform etc1s "${filePath}" "${filePath}"`, { stdio: 'inherit' });
      // Strip unused data. Overwrite the original file.
      execSync(`npx gltf-transform strip "${filePath}" "${filePath}"`, { stdio: 'inherit' });
      console.log(`Finished optimizing ${filePath}`);
    } catch (error) {
      // Log the specific command that failed
      console.error(`Error optimizing ${filePath}: ${error.message}`);
      console.error(`Error optimizing ${filePath}: ${error.message}`);
    }
  }
});

console.log('All models optimization process finished.');