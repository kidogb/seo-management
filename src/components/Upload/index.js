import { Upload, Icon, Modal } from 'antd';

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    // fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  // handleChange = ({ fileList }) => {
  //   const {maxFile = 5} = this.props;
  //   if (fileList.length > maxFile) fileList = fileList.slice(maxFile*(-1));
  //   this.setState({ fileList });
  // }

  render() {
    const { previewVisible, previewImage,  } = this.state;
    const {maxFile=5, displayUploadButton=true, onChange={}, fileList=[], showPreviewIcon=true, showRemoveIcon=true} = this.props;
    const uploadButton = displayUploadButton && (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={onChange}
          showUploadList={{ showPreviewIcon, showRemoveIcon }}
        >
        {fileList.length >= maxFile ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}