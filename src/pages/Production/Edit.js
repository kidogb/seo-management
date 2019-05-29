import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  message,
  Upload,
  Switch,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import PicturesWall from '@/components/Upload';
import { hasRole, FORBIDDEN_PAGE_PATH, ROLES } from '@/common/permission';
import VariationTable from '@/components/VariationTable';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ loading, product, fileUpload }) => ({
  submitting: loading.effects['product/update'],
  listFileId: fileUpload.listFileId,
  product,
}))
@Form.create()
class ProductEditForm extends PureComponent {
  state = {
    fileList: [], // for old images file
    newFileList: [], //for new images file
    variationList: [], // for variation
    // newVariationList: [], // for add new variation
    count: 0,  // for count nunmber of new variation
    numberOldVariation: 0,  //index to determine old variation
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const id = this.props.match.params.id;
    dispatch({
      type: 'product/fetchDetail',
      payload: id,
      callback: (res) => {
        if (res.id)
          this.setState({
            fileList: res.ps_imgs,
            variationList: res.variation_product.map((v, i) => { return { ...v, key: i } }),
            count: res.variation_product.length,
            numberOldVariation: res.variation_product.length,
          });
      }
      });
  }

  handleSubmit = e => {
    e.preventDefault();
    const id = this.props.match.params.id;
    const { dispatch, form, product: { data } } = this.props;
    const { fileList, newFileList, variationList, numberOldVariation } = this.state;
    let ps_imgs = [];

    let oldVariationList =[];
    let newVariationList = [];
    variationList.filter(variation => {
      if (variation.id) {
        oldVariationList.push({ ...variation, product: id });
      } else {
        newVariationList.push({ ...variation, product: id });
      }
    });

    // if (fileList.length > 0) {
    fileList.map(file => ps_imgs.push(file.id));
    // }
    // if (newFileList.length > 0) {
    // upload images
    dispatch({
      type: 'fileUpload/addMultiFile',
      payload: newFileList,
      callback: (fileListId => {
        fileListId.map(id => ps_imgs.push(id));
        form.setFieldsValue({
          upload: ps_imgs,
        });
        form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            if (values.channel_50012_switch) values.channel_50012_switch = "Mở";
            else values.channel_50012_switch = "Đóng";
            if (values.channel_50011_switch) values.channel_50011_switch = "Mở";
            else values.channel_50011_switch = "Đóng";
            if (values.channel_50015_switch) values.channel_50015_switch = "Mở";
            else values.channel_50015_switch = "Đóng";
            if (values.channel_50016_switch) values.channel_50016_switch = "Mở";
            else values.channel_50016_switch = "Đóng";
            if (values.channel_50010_switch) values.channel_50010_switch = "Mở";
            else values.channel_50010_switch = "Đóng";
            if (oldVariationList.length > 0) {
              dispatch({
                type: 'variations/updateMultiVariation',
                // payload: variationList.slice(0, numberOldVariation),
                payload: oldVariationList,
              });
            }
            if (newVariationList.length > 0) {
              dispatch({
                type: 'variations/addMultiVariation',
                // payload: variationList.slice(numberOldVariation, variationList.length),
                payload: newVariationList,
              })
            }
            dispatch({
              type: 'product/update',
              payload: { ...values, id, ps_imgs },
            });
          }
        });
      }),
    });
    // }
  }

  handleChangeUpload = (info) => {
    let newFileList = info.fileList;
    // 1. Limit the number of uploaded files
    if (newFileList.length > 9) newFileList = newFileList.slice(-9);
    this.setState({ newFileList });
  }

  handleRemoveUpload = (obj) => {
    const { fileList } = this.state;
    const updatedFileList = fileList.filter(file => {
      return file.id !== obj.uid;
    });
    this.setState({ fileList: updatedFileList });
  }

  getProductImgs = files => {
    let defaultFileList = [];
    files.map(file => {
      if (file.id)
        defaultFileList.push({
          uid: file.id,
          name: file.title,
          // status: 'done',
          url: file.file,
        });
    });
    return defaultFileList;
  }

  goBackToListScreen = id => {
    router.push(`/production/list`);
  };

  handleDelete = key => {
    const { dispatch } = this.props;
    const variationList = [...this.state.variationList];
    const deleteVariation = variationList.filter(item => item.key === key);
    if (deleteVariation[0].id) {
      dispatch({
        type: 'variations/remove',
        payload: deleteVariation[0].id,
      });
    }
    this.setState({ variationList: variationList.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, variationList } = this.state;
    const newData = {
      key: count,
      ps_variation_name: `name`,
      ps_variation_price: 0,
      ps_variation_stock: 0,
    };
    this.setState({
      variationList: [...variationList, newData],
      count: count + 1,
    });
  };

  // handle save to variationList when user click outside
  handleSave = row => {
    const { variationList } = this.state;
    const newData = [...variationList];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ variationList: newData });
  };


  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue }
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 48 },
        sm: { span: 24 },
        md: { span: 16 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const {
      product: { data },
      loading,
    } = this.props;
    const id = this.props.match.params.id;
    const { fileList, newFileList, variationList } = this.state;
    return (
      <PageHeaderWrapper
        title="Cập nhật thông tin sản phẩm"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Tên sản phẩm">
              {getFieldDecorator('ps_product_name', {
                initialValue: data.ps_product_name,
                rules: [
                  {
                    required: true,
                    message: "Tên sản phẩm không được để trống",
                  },
                ],
              })(<Input placeholder="Nhập tên sản phẩm" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Ảnh sản phẩm">
              {(fileList !== []) && getFieldDecorator('upload',
                {
                  rules: [
                    {
                      required: true,
                      message: "Ảnh sản phẩm không được để trống",
                    },
                  ],
                }
              )(<div>
                <PicturesWall displayUploadButton={false}
                  showPreviewIcon={true}
                  showRemoveIcon={true}
                  onRemove={(obj) => this.handleRemoveUpload(obj)}
                  fileList={this.getProductImgs(fileList)}>
                </PicturesWall>
                <PicturesWall displayUploadButton={true}
                  showPreviewIcon={true}
                  showRemoveIcon={true}
                  onChange={(info) => this.handleChangeUpload(info)}
                  fileList={newFileList}>
                </PicturesWall>
              </div>)
              }

            </FormItem>
            <FormItem {...formItemLayout} label="Thông tin sản phẩm">
              {getFieldDecorator('ps_product_description', {
                initialValue: data.ps_product_description,
                rules: [
                  {
                    required: true,
                    message: "Thông tin sản phẩm không được để trống",
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32, minWidth: 32 }}
                  placeholder="Nhập thông tin sản phẩm"
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Category">
              {getFieldDecorator('ps_category_list_id', {
                initialValue: data.ps_category_list_id,
                rules: [
                  {
                    required: true,
                    message: "Giá sản phẩm không được để trống!!!",
                  },
                ],
              })
                (<Input key="ps_category_list_id" placeholder="Category" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Giá">
              {getFieldDecorator('ps_price', {
                initialValue: data.ps_price,
                rules: [
                  {
                    required: true,
                    message: "Giá sản phẩm không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32, width: '100%' }}
                  placeholder="Nhập giá sản phẩm (VND)"
                  formatter={value => `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\đ\s?|(,*)/g, '')}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Khối lượng">
              {getFieldDecorator('ps_product_weight', {
                initialValue: data.ps_product_weight,
                rules: [
                  {
                    required: true,
                    message: "Khối lượng sản phẩm không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32, width: '100%' }}
                  placeholder="Nhập khối lượng sản phẩm (g)"
                  formatter={value => `g ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\g\s?|(,*)/g, '')}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Số lượng trong kho">
              {getFieldDecorator('ps_stock', {
                initialValue: data.ps_stock,
                rules: [
                  {
                    required: true,
                    message: "Số lượng sản phẩm không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32, width: '100%' }}
                  placeholder="Nhập số lượng sản phẩm"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Thời gian ship (ngày)">
              {getFieldDecorator('ps_days_to_ship', {
                initialValue: data.ps_days_to_ship,
                rules: [
                  {
                    required: true,
                    message: "Thời gian ship không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32, width: '100%' }}
                  placeholder="Nhập thời gian ship"
                />
              )}
            </FormItem>
            <Form.Item {...formItemLayout} label="Channel 50012 Switch">
              {getFieldDecorator('channel_50012_switch', { valuePropName: 'checked' })(
                <Switch />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Channel 50011 Switch">
              {getFieldDecorator('channel_50011_switch', { valuePropName: 'checked' })(
                <Switch />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Channel 50016 Switch">
              {getFieldDecorator('channel_50016_switch', { valuePropName: 'checked' })(
                <Switch />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Channel 50015 Switch">
              {getFieldDecorator('channel_50015_switch', { valuePropName: 'checked' })(
                <Switch />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="Channel 50010 Switch">
              {getFieldDecorator('channel_50010_switch', { valuePropName: 'checked' })(
                <Switch />
              )}
            </Form.Item>
            <VariationTable
              dataSource={variationList}
              handleAdd={this.handleAdd}
              handleDelete={this.handleDelete}
              handleSave={this.handleSave}
              editable={true}
            />
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              {/* <Button type="primary" htmlType="submit" loading={submitting}>
                Chỉnh sửa
              </Button> */}
              <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }} loading={submitting}>
                Câp nhật
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.goBackToListScreen()}>
                Quay lại
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductEditForm;
