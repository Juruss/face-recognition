import React from "react";
import "./ImageLinkForm.css"



const ImageLinkForm = ({onInputChange, onSubmit}) => {
  return (
    <div className="ma4 mt0">
      <p className="f3">
        {"I will find faces in your pictures, give it a try"}
      </p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input className="f4 pa2 w-70 center" type ="tex" onChange={onInputChange}></input>
          <button
            className="w-30 grow ba b--light-purple f4 pa2 link ph3 pv2 dib white bg-light-purple"
            onClick={onSubmit}
            >Detect</button>
        </div>
      </div>
    </div>
  );
}

export default ImageLinkForm;
