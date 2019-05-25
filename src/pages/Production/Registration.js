import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
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
  Switch,
  Checkbox,
  Row,
  Col,
  Upload,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { message } from 'antd';
import router from 'umi/router';
import PicturesWall from '@/components/Upload';
import { ROLES, FORBIDDEN_PAGE_PATH, hasRole } from '@/common/permission';


const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading, user }) => ({
  user,
  submitting: loading.effects['product/add'],
  canAccessPermission: hasRole(
    user.currentUser.user_type,
    ROLES.ADMIN)
    || hasRole(
      user.currentUser.user_type,
      ROLES.USER),
}))
@Form.create()
class ProductRegistration extends PureComponent {
  state = {
    fileList: [
    ],
    visible: false,
    id: null,
  };

  componentDidMount() {
    const { canAccessPermission, user } = this.props;
    if (!canAccessPermission) {
      router.push(FORBIDDEN_PAGE_PATH);
    }
  }

  transformSwitchValue = value => {
    if (value) return "Đóng";
    else return "Mở";
  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const {fileList, visible} = this.state;
    e.preventDefault();
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
          payload: {...values},
          callback: (res) => {
            if (res && res.id) {
              this.setState({
                visible: true,
                id: res.id,
              });
            } else {
              message.error ("Không thêm được sản phẩm");
            }
          }
        });
      }
    });
  };
   handleChangeUpload = (info) => {
    let fileList = info.fileList;
    // 1. Limit the number of uploaded files
    if (fileList.length > 9)  fileList = fileList.slice(-9);
    this.setState({ fileList });
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
    message.success('Tạo sản phẩm thành công');
    router.push(`/production/list`);
  }

  render() {
    const { submitting } = this.props;
    const {fileList, visible, id} = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper
        title="Thêm sản phẩm"
      >
        <Card bordered={false}>
        {visible && id && <Modal title="Tạo variations"
          visible={true}
          onOk={() => {
            router.push(`/production/${id}/variations/list`);
          }}
          onCancel={this.hideModal}
          okText="Có"
          cancelText="Không">
          <p>Tạo sản phẩm thành công!! Bạn có muốn tạo thêm variations cho sản phẩm này</p>
        </Modal>}
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Tên sản phẩm">
              {getFieldDecorator('ps_product_name', {
                rules: [
                  {
                    required: true,
                    message: "Tên sản phẩm không được để trống",
                  },
                ],
              })(<Input placeholder="Nhập tên sản phẩm" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Category">
              {getFieldDecorator('ps_category_list_id', {
                rules: [
                  {
                    required: true,
                    message: "Category không được để trống",
                  },
                ],
              })(<Input placeholder="Nhập category" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Thông tin sản phẩm">
              {getFieldDecorator('ps_product_description', {
                rules: [
                  {
                    required: true,
                    message: "Thông tin sản phẩm không được để trống",
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 , minWidth: 32}}
                  placeholder="Nhập thông tin sản phẩm"
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Giá">
              {getFieldDecorator('ps_price', {
                rules: [
                  {
                    required: true,
                    message: "Giá sản phẩm không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32,width: '100%' }}
                  placeholder="Nhập giá sản phẩm (VND)"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Khối lượng">
              {getFieldDecorator('ps_product_weight', {
                rules: [
                  {
                    required: true,
                    message: "Khối lượng sản phẩm không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32,width: '100%' }}
                  placeholder="Nhập khối lượng sản phẩm (g)"
                  formatter={value => `g ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\g\s?|(,*)/g, '')}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Số lượng trong kho">
              {getFieldDecorator('ps_stock', {
                rules: [
                  {
                    required: true,
                    message: "Số lượng sản phẩm không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32,width: '100%' }}
                  placeholder="Nhập số lượng sản phẩm"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Thời gian ship (ngày)">
              {getFieldDecorator('ps_days_to_ship', {
                rules: [
                  {
                    required: true,
                    message: "Thời gian ship không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32,width: '100%' }}
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
            <Form.Item {...formItemLayout} label="Upload ảnh">
              {getFieldDecorator('upload',{
                initialValue: [],
                rules: [
                  {
                    required: true,
                    message: "Ảnh sản phẩm không được để trống!!!",
                  },
                ],
              })(
                <PicturesWall showPreviewIcon={true} showRemoveIcon={true} onChange={(info)=>this.handleChangeUpload(info)} fileList={fileList}>
                </PicturesWall>
              )}
            </Form.Item>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={()=> router.push(`/production/list`)}>
                Cancel
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductRegistration;
