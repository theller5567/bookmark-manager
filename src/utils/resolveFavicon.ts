const faviconModules = import.meta.glob('../assets/images/favicon-*.png', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

export const resolveFavicon = (faviconPath: string): string => {
  if (/^https?:\/\//i.test(faviconPath)) {
    return faviconPath;
  }

  const fileName = faviconPath.split('/').pop();
  if (!fileName) return '';

  return faviconModules[`../assets/images/${fileName}`] ?? '';
};
