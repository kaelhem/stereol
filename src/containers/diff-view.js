import React from 'react'
import ContentLayout from 'components/content-layout'
import StlView from 'components/stl-viewer'

const DiffView = () => (
  <ContentLayout render={({width, height}) => (
    <div className="diff-view">
      <StlView { ...{ width: width / 2, height }} />
      <StlView { ...{ width: width / 2, height }} />
    </div>
  )} />
)

export default DiffView