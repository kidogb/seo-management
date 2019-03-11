import { Upload, Icon, Modal } from 'antd';

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage } = this.state;
    return (
      <div className="clearfix">
        <Upload
          listType="picture-card"
          defaultFileList={this.props.defaultFileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
        >
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}