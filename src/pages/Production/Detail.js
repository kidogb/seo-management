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
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import PicturesWall from '@/components/Upload';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ loading, product }) => ({
  // submitting: loading.effects['form/submitRegularForm'],
  product,
}))
@Form.create()
class ProductDetailForm extends PureComponent {
  handleSubmit = e => {
    // const { dispatch, form } = this.props;
    // e.preventDefault();
    // form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //     dispatch({
    //       type: 'form/submitRegularForm',
    //       payload: values,
    //     });
    //   }
    // });
    console.log('Go to edit page!')
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchDetail',
      payload: 1,
    });
  }
  getProductImgs = ps_imgs => {
      let defaultFileList = [];
      if (ps_imgs){
        ps_imgs.map(ps_img => {
          defaultFileList.push({
            uid: ps_img.id,
            name: ps_img.title,
            // status: 'done',
            url: ps_img.file,
          });
        });
      }
      return defaultFileList;
    }
  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
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
    const defaultFileList = this.getProductImgs(data.ps_imgs);
    return (
      <PageHeaderWrapper
        title= "Thông tin sản phẩm"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label= "Tên sản phẩm" >
            <TextArea
                  key="ps_product_name"
                  style={{ minHeight: 32 }}
                  placeholder="Tên sản phẩm"
                  autosize= {{ minRows: 2, maxRows: 6 }}
                  value={data.ps_product_name}
                  readOnly
                />
            </FormItem>
            <FormItem {...formItemLayout} label="Mô tả sản phẩm">
                <TextArea
                  key="ps_product_description"
                  style={{ minHeight: 32 }}
                  placeholder="Mô tả sản phẩm"
                  autosize= {{ minRows: 2, maxRows: 8 }}
                  value={data.ps_product_description}
                  readOnly
                />
            </FormItem>
            <FormItem {...formItemLayout} label= "Giá">
                <Input key= "ps_price" placeholder="Giá" value={data.ps_price} readOnly/>
            </FormItem>
            <FormItem {...formItemLayout} label= "Khối lượng (g)">
                <Input key= "ps_product_weight" placeholder="Khối lượng (g)" value={data.ps_product_weight} readOnly/>
            </FormItem>
            <FormItem {...formItemLayout} label= "Tồn kho">
                <Input key= "ps_stock" placeholder="Tồn kho" value={data.ps_stock} readOnly/>
            </FormItem>
            <FormItem {...formItemLayout} label= "Thời gian ship (ngày)">
                <Input key= "ps_days_to_ship" placeholder="Thời gian ship" value={data.ps_days_to_ship} readOnly/>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Chỉnh sửa
              </Button>
              <Button type="danger" style={{ marginLeft: 8 }}>
                Xoá sản phẩm
              </Button>
              <Button style={{ marginLeft: 8 }}>
                Quay lại
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductDetailForm;
