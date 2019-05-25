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
  notification,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { message } from 'antd';
import router from 'umi/router';
import PicturesWall from '@/components/Upload';
import VariationTable from '@/components/VariationTable';
import { ROLES, FORBIDDEN_PAGE_PATH, hasRole } from '@/common/permission';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['sample/add'],
  canAccessPermission: hasRole(
    user.currentUser.user_type,
    ROLES.ADMIN)
    || hasRole(
      user.currentUser.user_type,
      ROLES.MANAGER),
}))
@Form.create()
class SampleRegistration extends PureComponent {
  state = {
    fileList: [
    ], 
    createProductCheck: false,
    variationList: [],
    count: 0,
  };

  componentDidMount(){
    const {canAccessPermission, user} = this.props;
    if (!canAccessPermission) router.push(FORBIDDEN_PAGE_PATH);
  }

   handleChangeUpload = (info) => {
    let fileList = info.fileList;
    // 1. Limit the number of uploaded files
    if (fileList.length > 9)  fileList = fileList.slice(-9);
    this.setState({ fileList });
    console.log('AAAA: ', fileList);
  }

  handleDelete = key => {
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

  handleCreateVariation = (sample_id) => {
    const { variationList } = this.state;
    const {dispatch} = this.props;
    if (variationList.length > 0) {
      const payload = variationList.map(variation => {
        return {... variation, sample: sample_id}
      });
      dispatch({
        type: 'variations/addMultiVariation',
        payload: payload,
        callback: (res) => {
          if (res.length === payload.length) {
            notification.success({
              message: "Thành công!",
              description: 'Sample đã được tạo thành công'
            });
          } else {
            notification.error({
              message: `Lỗi tạo variations!`,
              description: 'Variation có thể chưa được tạo hoặc tạo không đầy đủ! Vui lòng kiểm tra lại!',
            });
          }
        }
      })
    }
  }

  transformSwitchValue = value => {
    if (value) return "Đóng";
    else return "Mở";
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const {fileList} = this.state;
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
        if (values.ps_add_new_product_from_sample_checkbox) {
          dispatch({
            type: 'product/add',
            payload: {...values},
          });
        }
        dispatch({
          type: 'sample/add',
          payload: {...values},
          callback: (res) => {
            if(res && res.id) {
              this.handleCreateVariation(res.id);
            } else {
              notification.error({
                message: 'Có lỗi khi tạo sample!! Vui lòng tạo lại!',
                description: ''
              });
            }
          }
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {fileList, createProductCheck, variationList} = this.state;
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
        title="Thêm mẫu"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="">
              {getFieldDecorator('ps_add_new_product_from_sample_checkbox', {
              })(
                <Checkbox>Tạo sản phẩm mới từ mẫu</Checkbox>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Tên mẫu">
              {getFieldDecorator('ps_product_name', {
                rules: [
                  {
                    required: true,
                    message: "Tên mẫu không được để trống",
                  },
                ],
              })(<Input placeholder="Nhập tên mẫu" />)}
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
            <FormItem {...formItemLayout} label="Thông tin mẫu">
              {getFieldDecorator('ps_product_description', {
                rules: [
                  {
                    required: true,
                    message: "Thông tin mẫu không được để trống",
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 , minWidth: 32}}
                  placeholder="Nhập thông tin mẫu"
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Giá">
              {getFieldDecorator('ps_price', {
                rules: [
                  {
                    required: true,
                    message: "Giá mẫu không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32,width: '100%' }}
                  placeholder="Nhập giá mẫu (VND)"
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
                    message: "Khối lượng mẫu không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32,width: '100%' }}
                  placeholder="Nhập khối lượng mẫu (g)"
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
                    message: "Số lượng mẫu không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32,width: '100%' }}
                  placeholder="Nhập số lượng mẫu"
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
                    message: "Ảnh mẫu không được để trống!!!",
                  },
                ],
              })(
                <PicturesWall showPreviewIcon={true} showRemoveIcon={true} onChange={(info)=>this.handleChangeUpload(info)} fileList={fileList}>
                </PicturesWall>
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
              <Button type="primary" htmlType="submit" loading={submitting}>
                Tạo mẫu
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={()=> router.push(`/sample/list`)}>
                Quay lại
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SampleRegistration;
