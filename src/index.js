import namedColors from './named-colors.js';

// named-color, "#rrggbb" => [r, g, b]: each value ranges from 0.0 to 1.0
// !!!: alpha channel is not supported
// !!!: "#rgb" is not supported
export function parseColor(strColor) {
  if (strColor in namedColors) {
    // named-color => "#rrggbb"
    strColor = namedColors[strColor];
  }
  // Optimized for speed (>_<)
  return strColor.substr(1).match(/.{2}/g).map(v => parseInt(v, 16) / 255);
}

// [r, g, b] => "#rrggbb"
export function toString(rgbColor) {
  return '#' + rgbColor.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
}

// [r, g, b] => [h, s, l]: h ranges from 0.0 to 360.0, s and l ranges from 0.0 to 1.0
// !!!: Here HSL uses a cylindrical model
export function convert_rgb_to_hsl(rgbColor) {
  if (typeof(rgbColor) === "string") {
    rgbColor = parseColor(rgbColor);
  }
  const vmax = Math.max(...rgbColor);
  const vmin = Math.min(...rgbColor);
  const chroma = vmax - vmin;

  const l = (vmax + vmin) / 2;
  if (chroma <= 0) {
    return [0, 0, l]
  }
  const h =
    vmin == rgbColor[2] ? 60 * (rgbColor[1] - rgbColor[0]) / chroma + 60 :
    vmin == rgbColor[0] ? 60 * (rgbColor[2] - rgbColor[1]) / chroma + 180 :
    60 * (rgbColor[0] - rgbColor[2]) / chroma + 300;
  const s = chroma / (1 - Math.abs(vmax + vmin - 1));

  return [h, s, l];
}

// [h, s, l] => [r, g, b]
// !!!: Here HSL uses a cylindrical model
export function convert_hsl_to_rgb(hslColor) {
  const chroma = (1 - Math.abs(2 * hslColor[2] - 1)) * hslColor[1];
  const vmin = hslColor[2] - chroma / 2;
  if (hslColor[0] < 60) {
    return [vmin + chroma, vmin + chroma * hslColor[0] / 60, vmin];
  } else if (hslColor[0] < 120) {
    return [vmin + chroma * (120 - hslColor[0]) / 60, vmin + chroma, vmin];
  } else if (hslColor[0] < 180) {
    return [vmin, vmin + chroma, vmin + chroma * (hslColor[0] - 120) / 60];
  } else if (hslColor[0] < 240) {
    return [vmin, vmin + chroma * (240 - hslColor[0]) / 60, vmin + chroma];
  } else if (hslColor[0] < 300) {
    return [vmin + chroma * (hslColor[0] - 240) / 60, vmin, vmin + chroma];
  } else {
    return [vmin + chroma, vmin, vmin + chroma * (360 - hslColor[0]) / 60];
  }
}

export function lightness(rgbColor, amount) {
  if (typeof(rgbColor) === "string") {
    rgbColor = parseColor(rgbColor);
  }
  const hslColor = convert_rgb_to_hsl(rgbColor);
  hslColor[2] += amount;
  hslColor[2] = Math.min(Math.max(hslColor[2], 0), 1);
  return toString(convert_hsl_to_rgb(hslColor));
}
