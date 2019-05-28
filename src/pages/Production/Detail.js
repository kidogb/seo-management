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
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import PicturesWall from '@/components/Upload';
import ButtonGroup from 'antd/lib/button/button-group';
import { hasRole, ROLES } from '@/common/permission';
import VariationTable from '@/components/VariationTable';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ product }) => ({
  product,
}))
@Form.create()
class ProductDetailForm extends PureComponent {
  state = {
    authority: undefined,
  };
  canAddEditDeleteProductPermission = (authority) => {
    if (!authority) return false;
    if (authority.includes('Admin')  || authority.includes('Cộng tác viên')) return true;
    return false;
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const id = this.props.match.params.id;
    const authority = localStorage.getItem('antd-pro-authority');
    this.setState({
      authority: authority,
    });
    dispatch({
      type: 'product/fetchDetail',
      payload: id,
    });
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
  handleRemoveSample = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/remove',
      payload: id,
      callback: (res) => {
        if (!res) {
          message.success('Xoá sản phẩm thành công!!');
          router.push(`/production/list`);
        } else {
          message.error('Không thể xoá sản phẩm!!')
        }
      }
    });
  }
  render() {
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

    const id = this.props.match.params.id;
    const {
      form: { getFieldDecorator, getFieldValue },
      product: { data },
      loading,
    } = this.props;
    const { authority } = this.state;
    return (
      <PageHeaderWrapper
        title="Thông tin sản phẩm"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Tên sản phẩm" >
              <TextArea
                key="ps_product_name"
                style={{ minHeight: 32 }}
                placeholder="Tên sản phẩm"
                autosize={{ minRows: 2, maxRows: 6 }}
                value={data.ps_product_name}
                readOnly
              />
            </FormItem>
            <FormItem {...formItemLayout} label="Ảnh sản phẩm">
              {(data && data.id) && <PicturesWall fileList={this.getProductImgs(data.ps_imgs)} displayUploadButton={false} showRemoveIcon={false}
                key="upload" />}
            </FormItem>
            <FormItem {...formItemLayout} label="Mô tả sản phẩm">
              <TextArea
                key="ps_product_description"
                style={{ minHeight: 32 }}
                placeholder="Mô tả sản phẩm"
                autosize={{ minRows: 2, maxRows: 8 }}
                value={data.ps_product_description}
                readOnly
              />
            </FormItem>
            <FormItem {...formItemLayout} label="Category">
              <Input key="ps_category_list_id" placeholder="Category" value={data.ps_category_list_id} readOnly />
            </FormItem>
            <FormItem {...formItemLayout} label="Giá">
              <Input key="ps_price" placeholder="Giá" value={data.ps_price} readOnly />
            </FormItem>
            <FormItem {...formItemLayout} label="Khối lượng (g)">
              <Input key="ps_product_weight" placeholder="Khối lượng (g)" value={data.ps_product_weight} readOnly />
            </FormItem>
            <FormItem {...formItemLayout} label="Tồn kho">
              <Input key="ps_stock" placeholder="Tồn kho" value={data.ps_stock} readOnly />
            </FormItem>
            <FormItem {...formItemLayout} label="Thời gian ship (ngày)">
              <Input key="ps_days_to_ship" placeholder="Thời gian ship" value={data.ps_days_to_ship} readOnly />
            </FormItem>
            <VariationTable
              dataSource={data.variation_product}
              editable={false}
            />
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <ButtonGroup>
                {this.canAddEditDeleteProductPermission(authority) && <Button key="btnDelete" type="danger" style={{ marginLeft: 8 }} onClick={() => this.handleRemoveSample(id)}>
                  Xoá sản phẩm
                </Button>}
                {this.canAddEditDeleteProductPermission(authority) && <Button key="btnUpdate" type="primary" style={{ marginLeft: 8 }} onClick={() => router.push(`/production/${id}/edit`)}>
                  Cập nhật
                </Button>}
                <Button key="btnBack" style={{ marginLeft: 8 }} onClick={() => this.goBackToListScreen()}>
                  Quay lại
                </Button>
              </ButtonGroup>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductDetailForm;
