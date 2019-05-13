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

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ loading, user, sample }) => ({
  submitting: loading.effects['sample/update'],
  sample,
  canAccessPermission: hasRole(
    user.currentUser.user_type,
    ROLES.ADMIN)
    || hasRole(
      user.currentUser.user_type,
      ROLES.MANAGER),
}))
@Form.create()
class SampleEditForm extends PureComponent {
  state = {
    fileList: [
    ]
  };
  handleSubmit = e => {
    const id = this.props.match.params.id;
    const { dispatch, form, sample: { data } } = this.props;
    const ps_imgs = data.ps_imgs.map(ps_img => ps_img.id);
    e.preventDefault();
    form.setFieldsValue({
      upload: data.ps_imgs,
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
          type: 'sample/update',
          payload: { ...values, id, ps_imgs },
        });
      }
    });
  };
  handleChangeUpload = (info) => {
    let fileList = info.fileList;
    // 1. Limit the number of uploaded files
    if (fileList.length > 5) fileList = fileList.slice(-5);
    this.setState({ fileList });
  }
  componentDidMount() {
    const { dispatch, user, canAccessPermission } = this.props;
    if (canAccessPermission) {
      const id = this.props.match.params.id;
      dispatch({
        type: 'sample/fetchDetail',
        payload: id,
        callback: (res) => {
          if (res.id)
            this.setState({
              fileList: res.ps_imgs,
            });
        }
      });
    } else {
      router.push(FORBIDDEN_PAGE_PATH);
    }

  }
  getSampleImgs = files => {
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
    router.push(`/sample/list`);
  };
  // handleRemoveProduct = id => {
  //   const {dispatch} = this.props;
  //   dispatch({
  //     type: 'sample/remove',
  //     payload: id,
  //     callback: (res) => {
  //       if (!res) {
  //         message.success('Xoá mẫu thành công!!');
  //         router.push(`/sample/list`);
  //       } else {
  //         message.error('Không thể xoá mẫu!!')
  //       }
  //     }
  //   });
  // }
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
      sample: { data },
      images,
      loading,
    } = this.props;
    const id = this.props.match.params.id;
    const { fileList } = this.state;
    return (
      <PageHeaderWrapper
        title="Cập nhật thông tin mẫu"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Tên mẫu">
              {getFieldDecorator('ps_product_name', {
                initialValue: data.ps_product_name,
                rules: [
                  {
                    required: true,
                    message: "Tên mẫu không được để trống",
                  },
                ],
              })(<Input placeholder="Nhập tên mẫu" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Ảnh mẫu">
              {(fileList !== []) && getFieldDecorator('upload',
                {
                  rules: [
                    {
                      required: true,
                      message: "Ảnh mẫu không được để trống",
                    },
                  ],
                }
              )(<PicturesWall displayUploadButton={false} showPreviewIcon={true} showRemoveIcon={true} onChange={(info) => this.handleChangeUpload(info)} fileList={this.getSampleImgs(fileList)}>
              </PicturesWall>)}

            </FormItem>
            <FormItem {...formItemLayout} label="Thông tin mẫu">
              {getFieldDecorator('ps_product_description', {
                initialValue: data.ps_product_description,
                rules: [
                  {
                    required: true,
                    message: "Thông tin mẫu không được để trống",
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32, minWidth: 32 }}
                  placeholder="Nhập thông tin mẫu"
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
                    message: "Giá mẫu không được để trống!!!",
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
                    message: "Giá mẫu không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32, width: '100%' }}
                  placeholder="Nhập giá mẫu (VND)"
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
                    message: "Khối lượng mẫu không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32, width: '100%' }}
                  placeholder="Nhập khối lượng mẫu (g)"
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
                    message: "Số lượng mẫu không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32, width: '100%' }}
                  placeholder="Nhập số lượng mẫu"
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

export default SampleEditForm;
