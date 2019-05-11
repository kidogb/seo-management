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
import variations from '@/models/variations';

const FormItem = Form.Item;
const { TextArea } = Input;
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
@connect(({ product }) => ({
  product,
}))
@Form.create()
class ProductDetailForm extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const id = this.props.match.params.id;
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
  handleRemoveProuct = id => {
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
  renderVariations = (variations) => {
    return variations.map((variation, i) => (
      <div key={i + 1}>
        <FormItem {...formItemLayout} label={`Variations Name ${i + 1}`} >
          <TextArea
            key="ps_variation_name"
            style={{ minHeight: 32 }}
            placeholder="Variations Name"
            autosize={{ minRows: 2, maxRows: 6 }}
            value={variation.ps_variation_name}
            readOnly
          />
        </FormItem>
        <FormItem {...formItemLayout} label={`Variations Price ${i + 1}`} >
          <TextArea
            key="ps_variation_price"
            style={{ minHeight: 32 }}
            placeholder="Variations Price"
            autosize={{ minRows: 2, maxRows: 6 }}
            value={variation.ps_variation_price}
            readOnly
          />
        </FormItem>
        <FormItem {...formItemLayout} label={`Variations Stock ${i + 1}`} >
          <TextArea
            key="ps_variation_stock"
            style={{ minHeight: 32 }}
            placeholder="Variations Stock"
            autosize={{ minRows: 2, maxRows: 6 }}
            value={variation.ps_variation_stock}
            readOnly
          />
        </FormItem>
      </div>
    ));
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue }
    } = this.props;
    const {
      product: { data },
      loading,
    } = this.props;
    const id = this.props.match.params.id;
    const variations = (data && data.variation_product && data.variation_product.length > 0) ? this.renderVariations(data.variation_product) : null;
    return (
      <PageHeaderWrapper
        title="Thông tin sản phẩm"
      >
        <Card bordered={false}>
          <ButtonGroup style={{marginBottom: 10}}>
            <Button key="btnAddVariation" icon= "plus" type="primary" style={{ marginLeft: 8 }} onClick={() => router.push(`/production/${id}/variations/list`)}>
              Tạo variations
              </Button>
          </ButtonGroup>
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
            <FormItem {...formItemLayout} label="Mô tả sản phẩm">
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
            {variations}
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <ButtonGroup>
                <Button key="btnDelete" type="danger" style={{ marginLeft: 8 }} onClick={() => this.handleRemoveProuct(id)}>
                  Xoá sản phẩm
              </Button>
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
