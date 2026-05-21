export function getDirectImageUrl(url: string): string {
  if (!url) return url;
  
  // Handle drive.google.com/file/d/ID/view
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w2000`;
  }
  
  // Handle drive.google.com/open?id=ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch && openMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${openMatch[1]}&sz=w2000`;
  }

  // Handle existing uc?export=view URLs
  const ucMatch = url.match(/drive\.google\.com\/uc.*[?&]id=([^&]+)/);
  if (ucMatch && ucMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w2000`;
  }

  return url;
}
