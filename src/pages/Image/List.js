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
import PictureWall from '@/components/Upload';
import styles from './List.less';
import Link from 'umi/link';

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
@connect(({ fileUpload, loading }) => ({
  fileUpload,
  loading: loading.models.product,
}))
@Form.create()
class TableList extends PureComponent {
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
      title: 'Tên ảnh sản phẩm',
      key: 'image_name',
      // dataIndex: 'title',
      width: 200,
      render: record => {
       return <a href='javascript:;'>{record.title}</a>
      }
    },
    {
      title: 'Ảnh',
      key: 'image_file',
      width: 400,
      render: record => {
        let defaultFileList = [{
          uid: record.id,
          name: record.title,
          url: record.file,
        }];
        return <PictureWall displayUploadButton={false} showRemoveIcon={false} fileList={defaultFileList} />;
      },
    },
    {
      title: 'Mô tả ảnh',
      key: 'image_description',
      dataIndex: 'note',
    },
    {
      title: 'Hành động',
      key: 'image_action',
      fixed: 'right',
      render: (record) => (
          <Button.Group>
            <Button type="primary" ghost icon="eye" onClick={() => this.previewItem(record.id)} />
            <Button type="danger" icon="delete" ghost onClick={() => console.log("Go to delete")} />
          </Button.Group>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fileUpload/fetch',
    });
    dispatch({
      type: 'fileUpload/fetchAll',
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
      type: 'fileUpload/fetch',
      payload: params,
    });
  };

  previewItem = id => {
    router.push(`/production/${id}/detail`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'fileUpload/fetch',
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

  handleAddImage = () => {
    router.push(`/image/registration`);
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Tên ảnh">
              {getFieldDecorator('ps_product_name')(<Input placeholder="Nhập tên ảnh sản phẩm" />)}
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      fileUpload: { data , totalData },
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
      <PageHeaderWrapper title="Danh sách ảnh sản phẩm">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button  style={{ marginBottom: 8 }} icon="plus" type="primary" onClick={() => this.handleAddImage()}>
                Thêm ảnh
              </Button>
            </div>
            <StandardTable
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

export default TableList;
