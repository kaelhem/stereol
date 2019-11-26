/* Stereol - nodeJS sample */

const stereol = require('../../dist/stereol')
const fs = require('fs')


const importExportStl = (input, output, asBinary) => {
  // import stl file
  const stl = fs.readFileSync(input)
  const { facets, description, color } = stereol.importStl(stl)
  console.log('import color: ', color)
  const stlContent = stereol.exportStl(facets, {
    description,
    color,
    binary: asBinary
  })
  fs.writeFileSync(output, stlContent)
  const reimport = stereol.importStl(stlContent)
  console.log('reimport color: ', reimport.color)
}

// read binary, export ascii
//importExportStl('../sample.stl', '../ascii-export.stl', false)

// read ascii, export binary
importExportStl('../sample.stl', '../binary-export.stl', true)