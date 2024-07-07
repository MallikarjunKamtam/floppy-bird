import React from "react";
import "./bird.css";
import CONSTANTS from "./CONSTANTS";
import bird from "./resources/angry-birds.png";

const Bird = () => {
  return (
    <div
      style={{ height: CONSTANTS.BIRD_HEIGHT, width: CONSTANTS.BIRD_WIDTH }}
      className="bird__body"
    >
      <img width={CONSTANTS.BIRD_WIDTH} height={CONSTANTS.BIRD_HEIGHT} src={bird} alt="" />
    </div>
  );
};

export default Bird;
