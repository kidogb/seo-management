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
  notification,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import PicturesWall from '@/components/Upload';
import { hasRole, FORBIDDEN_PAGE_PATH, ROLES } from '@/common/permission';
import VariationTable from '@/components/VariationTable';
import { MAX_FILE_UPLOAD_PRODUCT } from '@/common/constant';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['product/add'],
}))
@Form.create()
class ProductCloneForm extends PureComponent {
  state = {
    fileList: [], // for old images file
    variationList: [], // for variation
    count: 0,  // for count nunmber of new variation
  };

  componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.setState({
        fileList: data.ps_imgs,
        variationList: data.variation_sample.map((v, i) => { return { ...v, key: i } }),
        count: data.variation_sample.length,
      });
    }
  }

  handleCreateVariation = (product_id) => {
    const { variationList } = this.state;
    const { dispatch, onReset } = this.props;
    const newVariationList = variationList.map(variation => {
      const { id, sample, ...newVariation } = variation;
      return { product: product_id, ...newVariation };
    });
    const payload = variationList.map(variation => {
      if (variation.sample) variation.sample = null;
      return { ...variation, product: product_id }
    });
    dispatch({
      type: 'variations/addMultiVariation',
      payload: payload,
      callback: (res) => {
        if (res.length === payload.length) {
          notification.success({
            message: "Thành công!",
            description: 'Sản phẩm đã được copy thành công!'
          });
        } else {
          notification.error({
            message: `Lỗi tạo variations!`,
            description: 'Variation có thể chưa được tạo hoặc tạo không đầy đủ! Vui lòng kiểm tra lại!',
          });
        }
        onReset();
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { fileList, variationList } = this.state;
    let ps_imgs = [];
    fileList.map(file => ps_imgs.push(file.id));
    if (ps_imgs.length > MAX_FILE_UPLOAD_PRODUCT){
      notification.error({
        message: `Quá số ảnh quy định!`,
        description: `Chỉ được chọn tối đa ${MAX_FILE_UPLOAD_PRODUCT} ảnh`,
      });
      return;
    }
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
        dispatch({
          type: 'product/add',
          payload: { ...values, ps_imgs },
          callback: (res) => {
            if (res && res.id) {
              if (variationList && variationList.length > 0) {
                this.handleCreateVariation(res.id);
              } else {
                notification.success({
                  message: "Thành công!",
                  description: 'Sản phẩm đã được tạo thành công!'
                });
                onReset();
              }
            } else {
              notification.error({
                message: 'Có lỗi khi tạo product!! Vui lòng tạo lại!',
                description: ''
              });
            }
          }
        });
      }
    });
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

  handleDelete = key => {
    const { dispatch } = this.props;
    const variationList = [...this.state.variationList];
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
      data
    } = this.props;
    const { fileList, newFileList, variationList } = this.state;
    return (
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
            {getFieldDecorator('upload',
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
                showRemoveIcon={fileList.length <= 1 ? false : true}
                onRemove={(obj) => this.handleRemoveUpload(obj)}
                fileList={this.getProductImgs(fileList)}
                maxFile={MAX_FILE_UPLOAD_PRODUCT}
                displayUploadButton={false} >
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
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
            <Button style={{ marginLeft: 8 }} onClick={() => this.props.onReset()}>
              Quay lại
              </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default ProductCloneForm;
