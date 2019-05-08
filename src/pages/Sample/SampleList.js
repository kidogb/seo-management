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
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PicturesWall from '@/components/Upload';
import styles from './List.less';
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
@connect(({ sample, loading }) => ({
  sample,
  loading: loading.models.sample,
}))
@Form.create()
class SampleTableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: 'Tên mẫu',
      key: 'product_name',
      // dataIndex: 'ps_product_name',
      width: 200,
      render: record => {
        return <a href='javascript:;' onClick={() => this.previewSample(record.id)}>{record.ps_product_name}</a>
       }
    },
    {
      title: 'Category',
      key: 'product_category',
      dataIndex: 'ps_category_list_id',
      width: 100,
    },
    {
      title: 'Ảnh',
      key: 'product_imgs',
      dataIndex: 'ps_imgs',
      width: 400,
      render: ps_imgs => {
        let fileList = [];
        ps_imgs.map(ps_img => {
          fileList.push({
            uid: ps_img.id,
            name: ps_img.title,
            // status: 'done',
            url: ps_img.file,
          });
        });
        return <PicturesWall fileList={fileList} displayUploadButton={false} showRemoveIcon={false}/>;
      },
    },
    {
      title: 'Khối lượng(g)',
      key: 'product_weight',
      dataIndex: 'ps_product_weight',
      width: 100,
    },
    {
      title: 'Giá',
      key: 'product_price',
      dataIndex: 'ps_price',
      width: 100,
    },
    {
      title: 'Tồn kho',
      key: 'product_stock', 
      dataIndex: 'ps_stock',
      width: 20,
    },
    {
      title: 'Thời gian ship (ngày)',
      key: 'product_days_to_ship',
      dataIndex: 'ps_days_to_ship',
      width: 10,
    },
    {
      title: 'Mô tả mẫu',
      key: 'product_description',
      dataIndex: 'ps_product_description',
      width: 400,
    },
    {
      title: 'Hành động',
      key: 'product_action',
      fixed: 'right',
      render: (record) => (
          <Button.Group>
            <Button type="primary" ghost icon="eye" onClick={() => this.previewSample(record.id)} />
            <Button type="danger" icon="delete" ghost onClick={() => this.handleRemoveSample(record.id)} />
          </Button.Group>
      ),
    },
  ];

  generateColumns = (data) => {
    let columns = [];

  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sample/fetch',
    });
    dispatch({
      type: 'sample/fetchAll',
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
      type: 'sample/fetch',
      payload: params,
    });
  };

  previewSample = id => {
    router.push(`/sample/${id}/detail`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sample/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'sample/remove',
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

  handleAddSample = () => {
    router.push(`/sample/registration`);
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
        type: 'sample/fetch',
        payload: fieldsValue,
      });
    });
  };

  handleRemoveSample = id => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sample/remove',
      payload: id,
      callback: (res) => {
        if (!res) {
          message.success('Xoá mẫu thành công!!');
          dispatch({
            type: 'sample/fetch',
            payload: {},
          })
        } else {
          message.error('Không thể xoá mẫu!!')
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
            <FormItem label="Tên mẫu">
              {getFieldDecorator('ps_product_name')(<Input placeholder="Nhập tên mẫu" />)}
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
            <FormItem label="Tên mẫu">
              {getFieldDecorator('ps_product_name')(<Input placeholder="Nhập tên mẫu" />)}
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
      sample: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="Danh sách mẫu">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAddSample()}>
                Thêm mẫu
              </Button>
              {data.results && selectedRows.length > 0 && <DownloadExcel isProductExport= {false} excelData={selectedRows} sheetName='Sample' filename='export_sample'/>}
            </div>
            <StandardTable
              rowKey={record => record.id}
              selectedRows={selectedRows}
              loading={loading}
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

export default SampleTableList;
