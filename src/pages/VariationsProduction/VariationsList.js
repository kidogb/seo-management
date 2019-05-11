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
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
@Form.create()
class VariationsTableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: 'Variations Name',
      key: 'ps_variation_name',
      // dataIndex: 'ps_variation_name',
      // width: 200,
      render: record => {
        return <a href='javascript:;'>{record.ps_variation_name}</a>
       }
    },
    {
      title: 'Variations Price',
      key: 'ps_variation_price', 
      dataIndex: 'ps_variation_price',
      // width: 200,
    },
    {
      title: 'Variations Stock',
      key: 'ps_variation_stock',
      dataIndex: 'ps_variation_stock',
      // width: 200,
    },
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

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Variations Name">
              {getFieldDecorator('ps_variation_name')(<Input placeholder="Variations Name" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Variations Price">
            {getFieldDecorator('ps_variation_price')(<Input placeholder="Variations Price" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Variations Stock">
              {getFieldDecorator('ps_variation_stock')(<InputNumber placeholder="Variations Stock" style={{ width: '100%' }} />)}
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
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  render() {
    const {
      product: { data },
      loading,
    } = this.props;
    const { selectedRows, stepFormValues } = this.state;
    const id = this.props.match.params.id;
    return (
      <PageHeaderWrapper title="Danh sách variations">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
            <Button icon="left" onClick={() => router.push(`/production/${id}/detail`)}>
                Quay lại
              </Button>
              <Button icon="plus" type="primary" onClick={() => this.handleAddProductVariations(id)}>
                Thêm variations
              </Button>
            </div>
            {data && data.variation_product && <StandardTable
              rowKey={record => record.id}
              selectedRows={selectedRows}
              loading={loading}
              dataSource = {data.variation_product}
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

export default VariationsTableList;
