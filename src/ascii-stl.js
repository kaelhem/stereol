import { computeNormal } from './stl-utils'

const trim = (a) => {
  let nullTerm = a.indexOf('\u0000')
  if (nullTerm > -1) {
    a = a.substr(0, nullTerm)
  }
  return a.trim()
}

const exp = (x, y, z) => ([x, y, z].map(x => x.toExponential()))

const asciiFacet = (n, v) => (
`facet normal ${exp(...n).join(' ')}
  outer loop
    vertex ${exp(...v[0]).join(' ')}
    vertex ${exp(...v[1]).join(' ')}
    vertex ${exp(...v[2]).join(' ')}
  endloop
endfacet
`)

export const toASCII = (facets, description = '') => {
  let str = 'solid ' + description.split(' COLOR=')[0].trim() + '\n'
  for (let j = 0; j < facets.length; j++) {
    const facet = facets[j]
    const v = facet.verts
    const n = facet.normal || computeNormal(v)
    str += asciiFacet(n, v)
  }
  str += 'endsolid'
  return str
}

export const fromASCII = (data) => {
  const [desc, ...lines] = data.split('\n').filter(x => x.trim() !== '')
  const facets = []
  let lineIndex = 0
  let broken = false
  while (!broken && lineIndex < lines.length && lines[lineIndex].indexOf('endsolid') === -1) {
    broken = lines.length < lineIndex + 6
    broken = broken || lines[lineIndex].indexOf('normal ') === -1
    broken = broken || lines[lineIndex + 2].indexOf('vertex ') === -1
    broken = broken || lines[lineIndex + 3].indexOf('vertex ') === -1
    broken = broken || lines[lineIndex + 4].indexOf('vertex ') === -1
    if (!broken) {
      facets.push({
        normal: lines[lineIndex].split('normal ')[1].trim().split(' ').map(x => parseFloat(x)),
        verts: [
          lines[lineIndex + 2].split('vertex ')[1].trim().split(' ').map(x => parseFloat(x)),
          lines[lineIndex + 3].split('vertex ')[1].trim().split(' ').map(x => parseFloat(x)),
          lines[lineIndex + 4].split('vertex ')[1].trim().split(' ').map(x => parseFloat(x))
        ]
      })
      lineIndex += 7
    }
  }
  if (broken) {
    throw new Error('This file is not formatted correctly.')
  }
  return {
    description : desc.slice(6),
    facets
  }
}