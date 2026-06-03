export type GlassQuality = {
  segments: number;
};

/** High subdivision like the demo (smooth simplex wobble) */
export function getGlassQuality(
  mobile: boolean,
  reducedMotion: boolean,
): GlassQuality {
  if (reducedMotion || mobile) {
    return { segments: 64 };
  }
  return { segments: 128 };
}
