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
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { message } from 'antd';
import router from 'umi/router';
import PicturesWall from '@/components/Upload';
import Link from 'umi/link';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading, product }) => ({
  submitting: loading.effects['variation/add'],
  product: product.data,
}))
@Form.create()
class VariationsRegistration extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    const id = this.props.match.params.id;
    const isnum = /^\d+$/.test(id);
    if (!isnum) router.push('/exception/404');
    else dispatch({
      type: 'product/fetchDetail',
      payload: id,
    });
  }

  handleSubmit = e => {
    console.log(e);
    const { dispatch, form } = this.props;
    const id = this.props.match.params.id;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'variations/add',
          payload: { ...values, product: id },
          callback: (res) => {
            if(res && res.id) {
              message.success('Thêm variations thành công');
              router.push(`/production/${id}/variations/list/`);
            } else message.error('Không thể tạo variations');
          }
        });
      }
    });
  };

  render() {
    const { submitting, product } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const id = this.props.match.params.id;
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
        title="Thêm variations"
      >
        <Card bordered={false}>
        <Link style={{fontSize: 'medium'}} {... submitFormLayout} to={`/production/${id}/detail/`}>{product ? product.ps_product_name : ''}</Link>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Variations Name">
              {getFieldDecorator('ps_variation_name', {
                rules: [
                  {
                    required: true,
                    message: "Variations Name không được để trống",
                  },
                ],
              })(<Input placeholder="Variations Name" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Variations Price">
              {getFieldDecorator('ps_variation_price', {
                rules: [
                  {
                    required: true,
                    message: "Variations Price không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32, width: '100%' }}
                  placeholder="Variations Price (VND)"
                  formatter={value => `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\đ\s?|(,*)/g, '')}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Variations Stock">
              {getFieldDecorator('ps_variation_stock', {
                rules: [
                  {
                    required: true,
                    message: "Variations Stock không được để trống!!!",
                  },
                ],
              })(
                <InputNumber
                  style={{ minHeight: 32, width: '100%' }}
                  placeholder="Nhập số lượng sản phẩm"
                />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Thêm
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => router.push(`/production/${id}/variations/list/`)}>
                Quay lại
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default VariationsRegistration;
