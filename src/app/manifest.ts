import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Life Boss Fight',
    short_name: 'Boss Fight',
    description: 'Turn chaos into calm, guided missions.',
    start_url: '/login',
    display: 'standalone',
    background_color: '#071224',
    theme_color: '#0f223c',
    icons: []
  };
}
