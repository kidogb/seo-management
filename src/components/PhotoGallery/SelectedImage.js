import React, { useState, useEffect } from "react";

const Checkmark = ({ selected }) => (
  <div
    style={
      selected
        ? { left: "4px", top: "4px", position: "absolute", zIndex: "1" }
        : { display: "none" }
    }
  >
    <svg
      style={{ fill: "white", position: "absolute" }}
      width="24px"
      height="24px"
    >
      <circle cx="12.5" cy="12.2" r="8.292" />
    </svg>
    <svg
      style={{ fill: "#06befa", position: "absolute" }}
      width="24px"
      height="24px"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  </div>
);

const imgStyle = {
  transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
};
const selectedImgStyle = {
  transform: "translateZ(0px) scale3d(0.9, 0.9, 1)",
  transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
};
const cont = {
  backgroundColor: "#eee",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative"
};

const SelectedImage = ({
  index,
  photo,
  margin,
  direction,
  top,
  left,
  selected,
  onSelectedImage,
  selectedImage,
  hasSelected
}) => {
  const [isSelected, setIsSelected] = useState(selected);
  //calculate x,y scale
  // const sx = (100 - (30 / photo.width) * 100) / 100;
  // const sy = (100 - (30 / photo.height) * 100) / 100;
  const sx = 0.9;
  const sy = 0.9;
  selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;

  if (direction === "column") {
    cont.position = "absolute";
    cont.left = left;
    cont.top = top;
  }

  const handleOnClick = photo => {
    if (selectedImage === null) {
      setIsSelected(!isSelected);
      onSelectedImage(photo);
    } else if (selectedImage.id === photo.id) {
      setIsSelected(!isSelected);
      onSelectedImage(photo);
    }
  };

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  return (
    <div
      style={{ margin, height: "150px", width: "150px" ,  ...cont }}
      className={!isSelected ? "not-selected" : ""}
    >
      <Checkmark selected={isSelected ? true : false} />
      <img
        alt={photo.title}
        style={
          isSelected ? { ...imgStyle, ...selectedImgStyle, height: 'auto', width: '100%' } : { ...imgStyle,  height: 'auto', width: '100%', }
        }
        {...photo}
        onClick={() => handleOnClick(photo)}
      />
      <style>{`.not-selected:hover{outline:2px solid #06befa}`}</style>
    </div>
  );
};

export default SelectedImage;
