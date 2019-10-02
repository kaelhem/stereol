import { computeNormal } from './stl-utils'
import { toASCII, fromASCII } from './ascii-stl'
import { toBinary, fromBinary } from './binary-stl'

const exportStl = (facets, options = {}) => {
  const {
    description = '',
    binary = true,
    color = null,
    material = null
  } = options
  if (binary) {
    // colors exists only in unofficials specs and are exclusive to binary file format
    // more details: https://en.wikipedia.org/wiki/STL_(file_format)#Color_in_binary_STL
    const stlColor = Array.isArray(color) && color.length === 4 ? color : null
    let stlMaterial = stlColor && Array.isArray(material) && material.length === 3 ? material : null
    if (stlMaterial) {
      const [a,b,c] = material
      stlMaterial = stlMaterial && Array.isArray(a) && a.length === 3 ? material : null
      stlMaterial = stlMaterial && Array.isArray(b) && b.length === 3 ? material : null
      stlMaterial = stlMaterial && Array.isArray(c) && c.length === 3 ? material : null
    }
    return toBinary(facets, description, stlColor, stlMaterial)
  } else {
    return toASCII(facets, description)
  }
}

const arrayBufferToString = (ab) => {
  const decoder = new TextDecoder()
  return decoder.decode(ab)
}

const importStl = (data) => {
  if (typeof data === 'string' && data.slice(0, 6) === 'solid ') {
    console.log('type: ascii string')
    return fromASCII(data)
  } else if (typeof(TextEncoder) !== 'undefined' && typeof data === 'object' && arrayBufferToString(data.slice(0, 6)) === 'solid ') {
    console.log('type: ascii string in ArrayBuffer (browser only)')
    return fromASCII(arrayBufferToString(data))
  } else if (typeof(TextEncoder) === 'undefined' && typeof data === 'object' && data.toString().slice(0, 6) === 'solid ') {
    console.log('type: ascii string in Buffer (nodeJS only)')
    return fromASCII(data.toString())
  } else {
    console.log('type: binary buffer')
    return fromBinary(data)
  }
}

export default {
  exportStl,
  importStl
}
