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
  Radio,
  Tooltip,
  Popconfirm,
  notification,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PicturesWall from '@/components/Upload';
import styles from './List.less';
import DownloadExcel from '@/components/ExportExcel/DownloadExcel';
import { ROLES, FORBIDDEN_PAGE_PATH, hasRole } from '@/common/permission';
import { PAGE_SIZE } from '@/common/constant';

const FormItem = Form.Item;
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
  loading: loading.models.product
}))
@Form.create()
class ProductTableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    page: 1,
  };

  columns = [
    {
      title: 'Tên sản phẩm',
      key: 'product_name',
      // dataIndex: 'ps_product_name',
      width: '20%',
      render: record => {
        return <a href='javascript:;' onClick={() => this.previewProduct(record.id)}>{record.ps_product_name}</a>
      }
    },
    {
      title: 'Category',
      key: 'product_category',
      dataIndex: 'ps_category_list_id',
      width: '10%',
    },
    {
      title: 'Ảnh',
      key: 'product_imgs',
      dataIndex: 'ps_imgs',
      width: '70%',
      render: ps_imgs => {
        let fileList = [];
        ps_imgs.map(ps_img => {
          fileList.push({
            uid: ps_img.id,
            name: ps_img.title,
            // status: 'done',
            url: ps_img.file,
          })
        });
        return <PicturesWall fileList={fileList} displayUploadButton={false} showRemoveIcon={false} />;
      },
    },
    {
      title: 'Khối lượng(g)',
      key: 'product_weight',
      dataIndex: 'ps_product_weight',
      width: '10%',
    },
    {
      title: 'Giá',
      key: 'product_price',
      dataIndex: 'ps_price',
      width: '10%',
    },
    {
      title: 'Tồn kho',
      key: 'product_stock',
      dataIndex: 'ps_stock',
      width: '10%',
    },
    {
      title: 'Thời gian ship (ngày)',
      key: 'product_days_to_ship',
      dataIndex: 'ps_days_to_ship',
      width: '10%',
    },
    {
      title: 'Mô tả',
      key: 'product_description',
      dataIndex: 'ps_product_description',
      width: '60%',
      // ellipsize:true,
      onCell: () => {
        return {
           style: {
              whiteSpace: 'nowrap',
              maxWidth: 400,
           }
        }
     },
     render: (text) => (
        <Tooltip title={text}>
           <div style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{text}</div>
        </Tooltip>
     )
    },
    {
      title: 'Hành động',
      key: 'product_action',
      fixed: 'right',
      render: (record) => (
        <Button.Group>
          <Tooltip placement="topLeft" title='Xem sản phẩm'><Button type="primary" ghost icon="eye" onClick={() => this.previewProduct(record.id)} /></Tooltip>
          <Tooltip placement="topLeft" title='Xoá sản phẩm'><Button type="danger" icon="delete" ghost onClick={() => this.handleRemoveProduct(record.id)} /></Tooltip>
        </Button.Group>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { formValues, page } = this.state;
    dispatch({
      type: 'product/fetch',
      payload: {...formValues, page}
    });
    dispatch({
      type: 'product/fetchAll',
      payload: formValues,
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
    this.setState({
      page: pagination.current,
    });
    dispatch({
      type: 'product/fetch',
      payload: params,
    });
  };

  previewProduct = id => {
    router.push(`/production/${id}/detail`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'product/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  // handleMenuClick = e => {
  //   const { dispatch } = this.props;
  //   const { selectedRows } = this.state;

  //   if (selectedRows.length === 0) return;
  //   switch (e.key) {
  //     case 'remove':
  //       dispatch({
  //         type: 'product/remove',
  //         payload: {
  //           key: selectedRows.map(row => row.key),
  //         },
  //         callback: () => {
  //           this.setState({
  //             selectedRows: [],
  //           });
  //         },
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleAddProduct = () => {
    router.push(`/production/registration`);
  }

  handleMultiRemoveProduct = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'product/multiRemove',
      payload: selectedRows.map(row => row.id),
      callback: () => {
        notification.success({
          message: "Xoá sản phẩm thành công!"
        });
        this.setState({
          selectedRows: [],
        });
        window.location.reload();
      }
    })
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        formValues: fieldsValue,
      });

      dispatch({
        type: 'product/fetch',
        payload: fieldsValue,
      });
    });
  };

  handleRemoveProduct = id => {
    const { dispatch, product: { totalData } } = this.props;
    const { selectedRows, page, formValues } = this.state;
    const lastPage = (totalData.length % PAGE_SIZE === 1) && page !== 1 ? page - 1 :page;
    dispatch({
      type: 'product/remove',
      payload: id,
      callback: (res) => {
        if (!res) {
          message.success('Xoá sản phẩm thành công!!');
          //remove if deleted row in selectedRows
          this.setState({
            selectedRows: selectedRows.filter(function (row) {
              return row.id !== id;
            }),
            page: lastPage,
          });
          dispatch({
            type: 'product/fetch',
            payload: { ...formValues, page: lastPage},
          });
          dispatch({
            type: 'product/fetchAll',
            payload: formValues,
          });
        } else {
          message.error('Không thể xoá sản phẩm!!');
        }
      }
    });
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Tên sản phẩm">
              {getFieldDecorator('ps_product_name')(<Input placeholder="Nhập tên sản phẩm" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Xoá tìm kiếm
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                Mở rộng <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Tên sản phẩm">
              {getFieldDecorator('ps_product_name')(<Input placeholder="Nhập tên sản phẩm" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Category">
              {getFieldDecorator('ps_category_list_id')(<Input placeholder="Nhập category" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Tồn kho">
              {getFieldDecorator('ps_stock')(<InputNumber placeholder="Nhập số lượng tồn kho" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              Xoá tìm kiếm
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              Thu gọn <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      product: { data, totalData },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, } = this.state;
    return (
      <PageHeaderWrapper title="Danh sách sản phẩm">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAddProduct()}>
                Thêm sản phẩm
              </Button>
              {data && data.results && selectedRows.length > 0 && <DownloadExcel excelData={selectedRows} sheetName='Product' filename='export_product' />}
              { data && data.results && selectedRows.length > 0 && <Popconfirm title="Xoá sản phẩm đã chọn?" onConfirm={() => this.handleMultiRemoveProduct()}>
                {<Button icon="delete" type="danger">
                  Xoá sản phẩm
              </Button>}
              </Popconfirm>}
            </div>
            <StandardTable
              scroll
              rowKey={record => record.id}
              selectedRows={selectedRows}
              loading={loading}
              totalData={totalData}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductTableList;
