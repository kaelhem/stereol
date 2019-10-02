/* Stereol - nodeJS sample */

const stereol = require('../../dist/stereol')
const fs = require('fs')


const importExportStl = (input, output, asBinary) => {
  // import stl file
  const stl = fs.readFileSync(input)
  const { facets, description } = stereol.importStl(stl)
  const stlContent = stereol.exportStl(facets, {
    description,
    binary: asBinary
  })
  fs.writeFileSync(output, stlContent)
}

// read binary, export ascii
importExportStl('../sample.stl', '../ascii-export.stl', false)

// read ascii, export binary
importExportStl('../ascii-export.stl', '../binary-export.stl', true)