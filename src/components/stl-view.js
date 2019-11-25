import React, { useState, Fragment } from 'react'
import Dropzone from './dropzone'
import STLViewer from 'stl-viewer'
import stereol from 'stereol'
import { saveAs } from 'file-saver'
import { Button, Label } from 'semantic-ui-react'
import ColorPicker from './color-picker'

const StlView = ({ width, height }) => {

  const [stlData, setStlData] = useState(null)
  const [stereolData, setStereolData] = useState(null)

  const clear = () => {
    setStlData(null)
    setStereolData(null)
  }

  const importStl = (data) => {
    const { facets, description, color, material = null } = stereol.importStl(data)
    console.log(color)
    setStereolData({
      facets,
      description,
      color,
      material
    })
    const exported = stereol.exportStl(facets, {
      binary: true,
      description,
      color
    })
    console.log(facets, color)
    setStlData(exported.buffer)
  }

  const exportStl = () => {
    const data = stereol.exportStl(stereolData.facets, {
      binary: true,
      description: 'Exported with Stereol!',
      color: stereolData.color,
      material: stereolData.material
    })
    const blob = new Blob([data])
    saveAs(blob, 'stereol-export.stl')
  }

  const getColor = () => {
    return stereolData && stereolData.color ? {
      r: stereolData.color[0],
      g: stereolData.color[1],
      b: stereolData.color[2]
    } : null
  }

  const updateColor = (colorInfo) => {
    const { r, g, b } = colorInfo.rgb
    const color = [r, g, b, 255]
    const { facets, decription, material } = stereolData
    setStereolData({
      facets,
      decription,
      color,
      material
    })
    setTimeout(() => {
      const exported = stereol.exportStl(stereolData.facets, {
        binary: true,
        description: stereolData.description,
        color,
        material
      })
      setStlData(null)
      setStlData(exported.buffer)
    }, 1)
  }

  return (
    <div style={{ borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 0, borderTopWidth: 0, borderColor: '#dd0dd0', borderStyle: 'solid', height: '100%', position: 'relative' }}>
      { stlData ? (
        <Fragment>
          { navigator.userAgent !== 'ReactSnap' && stlData &&  (
            <STLViewer
              model={ stlData }
              width={ width }
              height={ height }
              backgroundColor='#e2e2e2'
              lights={[[0.5, 1, -1], [1, 1, 1]]}
              rotate={false}
              orbitControls={true}
              cameraX={50}
              cameraY={-200}
              cameraZ={170}
            />
          )}
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <ColorPicker color={ getColor() } onChange={ updateColor } />
            <Button onClick={ exportStl } circular style={{ backgroundColor: '#dd0dd0', color: '#fff' }} icon='download' />
            <Button onClick={ clear } circular style={{ backgroundColor: '#dd0dd0', color: '#fff' }} icon='trash' />
          </div>
          <div className="stl-info-box">
            { stereolData && stereolData.description ? <div><Label>{stereolData.description}</Label></div> : null }
            <div><Label>num mesh: { stereolData && stereolData.facets ? stereolData.facets.length : ' - ' }</Label></div>
          </div>
        </Fragment>
      ) : (
        <div style={{ width, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Dropzone onDataLoaded={ importStl } />
        </div>
      )}
    </div>
  )
}

export default StlView