import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Tooltip,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PicturesWall from '@/components/Upload';
import styles from './ProductImageList.less';
import DownloadExcel from '@/components/ExportExcel/DownloadExcel';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
@Form.create()
class ImagesTableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: 'Tên ảnh',
      key: 'title',
      // dataIndex: 'ps_variation_name',
      // width: 200,
      render: record => {
        return <a href='javascript:;'>{record.title}</a>
      }
    },
    {
      title: 'Ảnh',
      key: 'product_img',
      // dataIndex: 'ps_imgs',
      width: 1000,
      render: record => {
        let fileList = [];
        fileList.push({
          uid: record.id,
          name: record.title,
          // status: 'done',
          url: record.file,
        });
        return <PicturesWall fileList={fileList} displayUploadButton={false} showRemoveIcon={false} />;
      },
    },
    {
      title: 'Mô tả',
      key: 'note',
      dataIndex: 'note',
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{text}</div>
        </Tooltip>
      )
      // width: 200,
    },
    {
      title: 'Hành động',
      key: 'product_action',
      fixed: 'right',
      render: (record) => (
        <Button.Group>
          <Tooltip placement="topLeft" title='Xoá sản phẩm'><Button type="danger" icon="delete" ghost onClick={() => this.handleRemoveProduct(record.id)} /></Tooltip>
        </Button.Group>
      ),
    }
  ];

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

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'product/fetch',
      payload: params,
    });
  };

  previewProductVariations = id => {
    router.push(`/production/${id}/detail`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    // dispatch({
    //   type: 'product/fetch',
    //   payload: {},
    // });
  };


  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'product/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleAddProductVariations = (id) => {
    router.push(`/production/${id}/variations/registration`);
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        formValues: fieldsValue,
      });

      // dispatch({
      //   type: 'product/fetch',
      //   payload: fieldsValue,
      // });
    });
  };

  // handleRemoveProductVariations = id => {
  //   const {dispatch} = this.props;
  //   dispatch({
  //     type: 'product/remove',
  //     payload: id,
  //     callback: (res) => {
  //       if (!res) {
  //         message.success('Xoá variations thành công!!');
  //         dispatch({
  //           type: 'product/fetch',
  //           payload: {},
  //         })
  //       } else {
  //         message.error('Không thể xoá variations!!')
  //       }
  //     }
  //   });
  // }

  // renderAdvancedForm() {
  //   const {
  //     form: { getFieldDecorator },
  //   } = this.props;
  //   return (
  //     <Form onSubmit={this.handleSearch} layout="inline">
  //       <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //         <Col md={8} sm={24}>
  //           <FormItem label="Tên ảnh">
  //             {getFieldDecorator('title')(<Input placeholder="Tên ảnh" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="Mô tả">
  //             {getFieldDecorator('note')(<Input placeholder="Mô tả" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="Ảnh">
  //             {getFieldDecorator('ps_variation_stock')(<InputNumber placeholder="Variations Stock" style={{ width: '100%' }} />)}
  //           </FormItem>
  //         </Col>
  //       </Row>
  //       <div style={{ overflow: 'hidden' }}>
  //         <div style={{ marginBottom: 24 }}>
  //           <Button type="primary" htmlType="submit">
  //             Tìm kiếm
  //           </Button>
  //           <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
  //             Xoá tìm kiếm
  //           </Button>
  //         </div>
  //       </div>
  //     </Form>
  //   );
  // }

  // renderForm() {
  //   return this.renderAdvancedForm();
  // }

  render() {
    const {
      product: { data },
      loading,
    } = this.props;
    const { selectedRows, stepFormValues } = this.state;
    const id = this.props.match.params.id;
    return (
      <PageHeaderWrapper title="Danh sách ảnh">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="left" onClick={() => router.push(`/production/${id}/detail`)}>
                Quay lại
              </Button>
              <Button icon="plus" type="primary" onClick={() => this.handleAddProductVariations(id)}>
                Thêm ảnh
              </Button>
            </div>
            {data && data.ps_imgs && <StandardTable
              rowKey={record => record.id}
              selectedRows={selectedRows}
              loading={loading}
              dataSource={data.ps_imgs}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={false}
            />}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ImagesTableList;
