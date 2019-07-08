import React, { useState, useCallback, PureComponent } from "react";
import { render } from "react-dom";
import Gallery from "react-photo-gallery";
import SelectedImage from "./SelectedImage";
import { Button } from 'antd';

export default class SelectCoverImageModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasSelected: false,
      selectedImage: null,
    }
  }

  handleSelectedImage = (img) => {
    const { hasSelected, selectedImage } = this.state;
    if (selectedImage === null) {
      this.setState({
        selectedImage: img,
        hasSelected: !hasSelected,
      });
    } else if (JSON.stringify(selectedImage) === JSON.stringify(img)) {
      this.setState({
        selectedImage: null,
        hasSelected: !hasSelected,
      });
    } else {
      console.log("Do nothing");
    }
  }

  imageRenderer =
    ({ index, left, top, photo }) => {
      const { selectedImage, hasSelected } = this.state;
      if (selectedImage && selectedImage.id === photo.id) {
        return (
          <SelectedImage
            selected={hasSelected}
            key={photo.id}
            margin={"3px"}
            index={index}
            photo={photo}
            left={left}
            top={top}
            onSelectedImage={this.handleSelectedImage}
            selectedImage={selectedImage}
            hasSelected={hasSelected}
          />
        );
      } else
        return (
          <SelectedImage
            selected={false}
            key={photo.id}
            margin={"5px"}
            index={index}
            photo={photo}
            left={left}
            top={top}
            onSelectedImage={this.handleSelectedImage}
            selectedImage={selectedImage}
            hasSelected={hasSelected}
          />
        );
    }

  render() {
    const { photos, onSelectCover, onOk, onCancel } = this.props;
    const { hasSelected, selectedImage } = this.state;
    const param = { selected: hasSelected };
    return (
      <div>
        <div>
          <Gallery photos={photos} renderImage={this.imageRenderer} />
        </div>
        <div style={{ marginRight: 10, marginTop: 10, textAlign: 'right'  }}>
          <Button style={{ marginLeft: 8 }} onClick={() => onCancel()}>
            Quay lại
        </Button>
        <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }} onClick={() => onOk(selectedImage)}>
            Chọn
        </Button>
        </div>
      </div>
    );
  }
}