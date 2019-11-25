import React, { Fragment } from 'react'
import { Button, Popup } from 'semantic-ui-react'
import { TwitterPicker } from 'react-color'

const ColorPicker = ({ color, onChange }) => {
  
  const onColorChange = (selectedColor) => {
    if (onChange) {
      onChange(selectedColor)
    }
  }

  return (
    <Fragment>
      <Popup
        on={['click']}
        trigger={<Button circular style={{ backgroundColor: '#dd0dd0', color: '#fff' }} icon='tint' />}
        position="top right"
      >
        <TwitterPicker triangle="hide" onChange={ onColorChange } />
      </Popup>
    </Fragment> 
  )
}

export default ColorPicker