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
import styles from './List.less';
import DownloadExcel from '@/components/ExportExcel/DownloadExcel';
import { hasRole, ROLES } from '@/common/permission';
import { getAuthority } from '@/utils/authority';
import SampleEditForm from './SampleEdit';
import ProductEditForm from '../Production/Edit';
import ProductCloneForm from '../Production/Clone';

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
    cloneModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    authority: undefined,
    clonedData: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const authority = localStorage.getItem('antd-pro-authority');
    this.setState({
      authority: authority,
    });
    dispatch({
      type: 'sample/fetch',
    });
    dispatch({
      type: 'sample/fetchAll',
    });
  }

  canAddEditSamplePermission = (authority) => {
    if (!authority) return false;
    if (authority.includes('Admin') || authority.includes('Quản lý')) return true;
    return false;
  }

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
      width: 1000,
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
        return <PicturesWall fileList={fileList} displayUploadButton={false} showRemoveIcon={false} />;
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
          <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{text}</div>
        </Tooltip>
      )
    },
    {
      title: 'Hành động',
      key: 'product_action',
      fixed: 'right',
      render: (record) => (
        <Button.Group>
          <Tooltip placement="topLeft" title='Xem sample'><Button type="primary" ghost icon="eye" onClick={() => this.previewSample(record.id)} /></Tooltip>
          {!this.canAddEditSamplePermission(this.state.authority) && <Tooltip placement="topLeft" title='Tạo sản phẩm từ sample'><Button type="primary" ghost icon="copy" onClick={() => this.displayCloneSampleModal(record)} /></Tooltip>}
          {this.canAddEditSamplePermission(this.state.authority) && <Tooltip placement="topLeft" title='Xoá sample'><Button type="danger" icon="delete" ghost onClick={() => this.handleRemoveSample(record.id)} /></Tooltip>}
        </Button.Group>
      ),
    },
  ];

  generateColumns = (data) => {
    let columns = [];

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

  displayCloneSampleModal = record => {
    this.setState({
      cloneModalVisible: true,
      clonedData: record,
    });
  }
  hideCloneSampleModal = () => {
    this.setState({
      cloneModalVisible: false,
      clonedData: {},
    });
  }
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
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'sample/remove',
      payload: id,
      callback: (res) => {
        if (!res) {
          message.success('Xoá mẫu thành công!!');
          this.setState({
            selectedRows: selectedRows.filter(function (row) {
              return row.id !== id;
            }),
          });
          dispatch({
            type: 'sample/fetch',
            payload: {},
          });
          dispatch({
            type: 'sample/fetchAll',
            payload: {},
          });
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
      sample: { data, totalData },
      loading,
    } = this.props;
    const { selectedRows, cloneModalVisible, authority, clonedData } = this.state;
    return (
      <PageHeaderWrapper title="Danh sách mẫu">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {this.canAddEditSamplePermission(authority) && <Button icon="plus" type="primary" onClick={() => this.handleAddSample()}>
                Thêm mẫu
              </Button>}
              {data && data.results && selectedRows.length > 0 && <DownloadExcel isProductExport={false} excelData={selectedRows} sheetName='Sample' filename='export_sample' />}
            </div>
            {cloneModalVisible && <Modal
              title="Copy Sample"
              style={{ top: 20 }}
              visible={true}
              width='80%'
              // onOk={() => this.setModal1Visible(false)}
              footer={[
                null,
                null,
              ]}
              onCancel={() => this.hideCloneSampleModal()}
            >
              <ProductCloneForm data={clonedData} onReset={()=>this.hideCloneSampleModal()}></ProductCloneForm>
            </Modal>}
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

export default SampleTableList;
