const GITHUB_LATEST_RELEASE_URL =
  'https://api.github.com/repos/JUNIORPRUEVA/fullpos-releases/releases/latest';

const GITHUB_DIRECT_DOWNLOAD_URL =
  'https://github.com/JUNIORPRUEVA/fullpos-releases/releases/latest/download/FullPOS-Setup.exe';

const WHATSAPP_FALLBACK =
  'https://wa.me/18494314070?text=Hola,%20quiero%20descargar%20la%20demo%20de%20FullPOS';

function startDownload(url: string): void {
  window.location.assign(url);
}

export async function downloadLatestFullpos(): Promise<void> {
  try {
    const response = await fetch(GITHUB_LATEST_RELEASE_URL, {
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new Error('Could not fetch latest release');
    }

    const release = await response.json();

    const assets: { name: string; browser_download_url: string }[] =
      Array.isArray(release.assets) ? release.assets : [];

    // Prefer .exe assets that contain "fullpos" in the name
    const installer =
      assets.find(
        (asset) =>
          typeof asset.name === 'string' &&
          asset.name.toLowerCase().endsWith('.exe') &&
          asset.name.toLowerCase().includes('fullpos')
      ) ||
      assets.find(
        (asset) =>
          typeof asset.name === 'string' &&
          asset.name.toLowerCase().endsWith('.exe')
      );

    if (!installer?.browser_download_url) {
      throw new Error('Installer not found');
    }

    startDownload(installer.browser_download_url);
  } catch (error) {
    console.error('FullPOS download failed:', error);
    startDownload(GITHUB_DIRECT_DOWNLOAD_URL || WHATSAPP_FALLBACK);
  }
}
