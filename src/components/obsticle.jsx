import constants from "../CONSTANTS";

const ObesticleBlock = ({ height , position}) => {

    const bottomStyle = {
        backgroundColor: "green",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: window.innerHeight - height - constants.OBSTICLE_GAP,
        width: 150,
      }

      const topStyle ={
        backgroundColor: "green",
        height: height,
        width: 150,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }

    return (
      <div
        style={position === 'top' ? topStyle : bottomStyle}
      ></div>
    );
  };
  
  export default ObesticleBlock