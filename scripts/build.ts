import { build } from 'esbuild';

interface BuildOptions {
  env: 'production' | 'development'
}

/**
 * A builder function for the app package.
 */
export async function buildApp({ env }: BuildOptions) {
  await build({
    entryPoints: ['packages/app/src/index.tsx'], // We read the React application from this entrypoint
    outfile: 'packages/app/public/index.js', // We output a single file in the public/ folder (remember that the "script.js" is used inside our HTML page)
    define: {
      'process.env.NODE_ENV': `"${env}"`, // We need to define the Node.js environment in which the app is built
    },
    bundle: true,
    minify: env === 'production',
    sourcemap: env === 'development',
  });
};

/**
 * A builder function for the server package.
 */
export async function buildServer({ env }: BuildOptions) {
  await build({
    entryPoints: ['packages/server/src/index.ts'],
    outfile: 'packages/server/dist/index.js',
    define: {
      'process.env.NODE_ENV': `"${env}"`,
    },
    external: ['express'],
    platform: 'node',
    target: 'node14.15.4',
    bundle: true,
    minify: env === 'production',
    sourcemap: env === 'development',
  });
};

/**
 * A builder function for all packages.
 */
async function buildAll() {
  await Promise.all([
    buildApp({ env: 'production' }),
    buildServer({ env: 'production' }),
  ]);
};

// This method is executed when we run the script from the terminal with ts-node
buildAll();
