import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.less';
import { Table, Input, Button, Popconfirm, Form } from 'antd';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}

export default class VariationTable extends React.Component {
  constructor(props) {
    super(props);
    const { handleDelete, dataSource, editable } = this.props;
    console.log(dataSource);
    console.log(handleDelete);
    this.columns = [
      {
        title: 'Variation Name',
        dataIndex: 'ps_variation_name',
        width: '35%',
        editable: editable,
      },
      {
        title: 'Variation Price',
        dataIndex: 'ps_variation_price',
        width: '30%',
        editable: editable,
      },
      {
        title: 'Variation Stock',
        dataIndex: 'ps_variation_stock',
        width: '30%',
        editable: editable,
      },
      {
        title: '',
        dataIndex: 'operation',
        width: '5%',
        render: (text, record) =>
          editable ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <Button type="danger" icon="delete" ghost /> 
            </Popconfirm>) : null
      },
    ];

    // this.state = {
    //   dataSource: [
    //   ],
    //   count: 0,
    // };
  }

  // handleDelete = key => {
  //   const dataSource = [...this.state.dataSource];
  //   this.setState({ dataSource: dataSource.filter(item => item.key !== key) });

  // };

  // handleAdd = () => {
  //   const { count, dataSource } = this.state;
  //   const newData = {
  //     key: count,
  //     ps_variation_name: `name`,
  //     ps_variation_price: `price`,
  //     ps_variation_stock: `stock`,
  //   };
  //   this.setState({
  //     dataSource: [...dataSource, newData],
  //     count: count + 1,
  //   });
  // };

  // handleSave = row => {
  //   const newData = [...this.state.dataSource];
  //   const index = newData.findIndex(item => row.key === item.key);
  //   const item = newData[index];
  //   newData.splice(index, 1, {
  //     ...item,
  //     ...row,
  //   });
  //   this.setState({ dataSource: newData });
  // };

  render() {
    const { dataSource } = this.props;
    const { handleSave, handleAdd, editable } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleSave,
        }),
      };
    });
    return (
      <div>
        {editable && <Button onClick={() => handleAdd()} type="primary" style={{ marginBottom: 16 }}>
          Thêm variation
        </Button>}
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}          