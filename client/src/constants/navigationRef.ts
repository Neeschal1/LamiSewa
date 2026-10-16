export const stackNavRef: { current: any | null } = { current: null };

export const navigateFromSlider = (name: string, params?: object) => {
  try {
    stackNavRef.current?.navigate(name, params);
  } catch {}
};
