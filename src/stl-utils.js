/**
 * Heavily inspired by https://github.com/tmpvar/stl
 * Allow to create .stl content as ASCII or binary in NodeJS and browser.
 */
export const computeNormal = ([a, b, c]) => {
  const [x0, y0, z0] = a
  const [x1, y1, z1] = b
  const [x2, y2, z2] = c
  const [p1x, p1y, p1z] = [x1 - x0, y1 - y0, z1 - z0]
  const [p2x, p2y, p2z] = [x2 - x0, y2 - y0, z2 - z0]
  const [p3x, p3y, p3z] = [
    p1y * p2z - p1z * p2y,
    p1z * p2x - p1x * p2z,
    p1x * p2y - p1y * p2x
  ]
  const mag = Math.sqrt(p3x * p3x + p3y * p3y + p3z * p3z)
  if (mag === 0) {
    return [0, 0, 0]
  }
  return [p3x, p3y, p3z].map(p => p / mag)
}