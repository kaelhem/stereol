import Colors from './colors'
import { computeNormal } from './stl-utils'

let IS_NODEJS = undefined
try {
  IS_NODEJS = Boolean(Buffer)
} catch (e) {
  IS_NODEJS = false
}

const writeBufferString = (buffer, value = '', offset = 0) => {
  let step = 0
  value.split('').forEach(char => {
    buffer.setUint8(offset + step, char.charCodeAt(0))
    ++step
  })
}

const createBuffer = (size) => {
  const buffer = IS_NODEJS ? Buffer.alloc(size) : new DataView(new ArrayBuffer(size))
  if (IS_NODEJS) {
    buffer.fill(0, 0, 80)
  }
  return {
    writeBuffer: (type, value, offset = 0) => {
      switch (type) {
        case 'uint8': return IS_NODEJS ? buffer.writeUInt8(value, offset) : buffer.setUint8(offset, value)
        case 'uint16': return IS_NODEJS ? buffer.writeUInt16LE(value, offset) : buffer.setUint16(offset, value, true)
        case 'uint32': return IS_NODEJS ? buffer.writeUInt32LE(value, offset) : buffer.setUint32(offset, value, true)
        case 'float': return IS_NODEJS ? buffer.writeFloatLE(value, offset) : buffer.setFloat32(offset, value, true)
        case 'string': return IS_NODEJS ? buffer.write(value, offset) : writeBufferString(buffer, value, offset)
        default: {
          throw new Error('No type specified')
        }
      }
    },
    getBuffer: () => IS_NODEJS ? buffer : buffer.buffer
  }
}

const readBuffer = (buffer, type, offset = 0) => {
  switch (type) {
    case 'uint8': return IS_NODEJS ? buffer.readUInt8(offset) : buffer.getUint8(offset)
    case 'uint16': return IS_NODEJS ? buffer.readUInt16LE(offset) : buffer.getUint16(offset, true)
    case 'uint32': return IS_NODEJS ? buffer.readUInt32LE(offset) : buffer.getUint32(offset, true)
    case 'float': return IS_NODEJS ? buffer.readFloatLE(offset) : buffer.getFloat32(offset, true)
    default: {
      throw new Error('No type specified')
    }
  }
}

export const toBinary = (facets, description, color, material) => {
  const count = facets.length
  const size = 84 + count * 12 * 4 + count * 2
  const { writeBuffer, getBuffer } = createBuffer(size)
  writeBuffer('string', description)
  console.log('color=', color)
  if (color) {
    writeBuffer('string', ' COLOR=', 47)
    const [r, g, b, a] = color
    console.log(r, g, b, a)
    writeBuffer('uint8', r, 54)
    writeBuffer('uint8', g, 55)
    writeBuffer('uint8', b, 56)
    writeBuffer('uint8', a, 57)
    if (material) {
      writeBuffer('string', ',MATERIAL=', 58)
      const [ diffuse, specular, ambient ] = material
      writeBuffer('uint32', Colors.getStlColor(diffuse), 68)
      writeBuffer('uint32', Colors.getStlColor(specular), 72)
      writeBuffer('uint32', Colors.getStlColor(ambient), 76)
    }
  }
  writeBuffer('uint32', count, 80)

  let offset = 84
  const write = (value) => {
    writeBuffer('float', value, offset)
    offset += 4
  }
  for (let j = 0; j<facets.length; j++) {
    const facet = facets[j]
    const n = facet.normal || computeNormal(facet.verts)
    write(n[0])
    write(n[1])
    write(n[2])
    for (var i = 0; i<facet.verts.length; i++) {
      const vert = facet.verts[i]
      write(vert[0])
      write(vert[1])
      write(vert[2])
    }
    //const facetColor = facet.color ? Colors.getFacetColor(facet.color) : 0
    writeBuffer('uint16', facet.color || 0, offset)
    offset += 2
  }
  return getBuffer()
}

export const fromBinary = (data) => {
  const buffer = IS_NODEJS ? Buffer.from(data) : new DataView(data)

  // retrieve description
  let header = []
  for (let i = 0; i < 80; ++i) {
    header.push(readBuffer(buffer, 'uint8', i))
  }
  const description = String.fromCharCode(...header)
  console.log(description)

  // retrieve main color
  const colorIndex = description.indexOf(' COLOR=')
  console.log('colorIndex=', colorIndex)
  let color = null
  if (colorIndex !== -1) {
    color = [
      readBuffer(buffer, 'uint8', colorIndex + 7),
      readBuffer(buffer, 'uint8', colorIndex + 8),
      readBuffer(buffer, 'uint8', colorIndex + 9),
      readBuffer(buffer, 'uint8', colorIndex + 10)
    ]
  }

  console.log('color retrived=', color)

  // retrieve material
  const materialIndex = description.indexOf('MATERIAL=')
  let material = null
  if (materialIndex !== -1) {
    material = [
      readBuffer(buffer, 'uint32', colorIndex + 9),
      readBuffer(buffer, 'uint32', colorIndex + 13),
      readBuffer(buffer, 'uint32', colorIndex + 17)
    ]
  }

  // retrieve facets
  const facets = []
  const countFacets = readBuffer(buffer, 'uint32', 80)
  let headIndex = 84
  const read = () => {
    headIndex += 4
    return readBuffer(buffer, 'float', headIndex - 4)
  }
  for (let i = 0; i < countFacets; ++i) {
    const normal = [read(), read(), read()]
    const verts = [
      [read(), read(), read()],
      [read(), read(), read()],
      [read(), read(), read()]
    ]
    const facetColor = readBuffer(buffer, 'uint16', headIndex)
    headIndex += 2
    facets.push({
      normal,
      verts,
      color: facetColor
    })
  }
  return {
    description,
    facets,
    color,
    material
  }
}