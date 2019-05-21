import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

// function initTotalList(columns) {
//   const totalList = [];
//   columns.forEach(column => {
//     if (column.needTotal) {
//       totalList.push({ ...column, total: 0 });
//     }
//   });
//   return totalList;
// }

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    this.state = {
      selectedRowKeys: [],
      checkedTotal: false,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      return {
        selectedRowKeys: [],
      };
    } else return {
      selectedRowKeys: nextProps.selectedRows.map(function (obj) {
        return obj.id;
      })
    }
    // return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;

    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, checkedTotal } = this.state;
    const { data = {}, rowKey, dataSource, scroll, totalData, onSelectRow, ...rest } = this.props;
    const { results = [], count, next, previous } = data;
    const pagination = {
      total: count,
      pageSize: 10,
    }; 
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      ...pagination,
    };
    
    const totalDataKeys = totalData ? dataSource ? dataSourece.map(function (obj) {
      return obj.id;
    }) : totalData.map(function (obj) {
      return obj.id;
    }) : [];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
      hideDefaultSelections: true,
      selections: [{
        key: 'all-data',
        text: 'Chọn tất cả',
        onSelect: () => {
          this.handleRowSelectChange(totalDataKeys, totalData);
          this.setState({
            checkedTotal: !checkedTotal,
          })
        },
      }],
    };
    const table = scroll ? (<Table
      rowKey={rowKey || 'key'}
      rowSelection={rowSelection}
      dataSource={dataSource ? dataSource : results} //for variation
      pagination={paginationProps}
      onChange={this.handleTableChange}
      scroll={{ x: true, }}
      // useFixedHeader= {true}
      {...rest}
    />) : (<Table
      rowKey={rowKey || 'key'}
      rowSelection={rowSelection}
      dataSource={dataSource ? dataSource : results}  //for variation
      pagination={paginationProps}
      onChange={this.handleTableChange}
      // useFixedHeader= {true}
      {...rest}
    />);
    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                Đã chọn <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  Bỏ chọn
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        {table}
      </div>
    );
  }
}

export default StandardTable;
