import React from 'react'
import "../FirstComponent/FirstComponent.css"
function ThankyouComponent({title}) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded " id="secondElement">
      <div id="firstElement"></div>
      <div>
        <div className="p-5 w-590 sm:w-500">
          <p
            className="font-normal sm:font-medium text-2xl sm:text-4xl leading-10 sm:leading-12 PfontFamily w-26.19rem h-2.34rem sm:h-2.083rem "
            dangerouslySetInnerHTML={{ __html: title }}
          ></p>
          <p
            className="PfontFamily w-512.68 mt-5 pb-2 "
            
          >Thank you for the response</p>
        </div>
      </div>
    </div>
  );
}

export default ThankyouComponent