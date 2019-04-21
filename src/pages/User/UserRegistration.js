import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
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
  Switch,
  Checkbox,
  Row,
  Col,
  Upload,
  Popover,
  Progress,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { message } from 'antd';
import router from 'umi/router';
import PicturesWall from '@/components/Upload';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
@connect(({ loading, register }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
class UserRegistration extends PureComponent {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: 'Cộng tác viên',
  };

  componentDidUpdate() {
    const { form, register } = this.props;
    const account = form.getFieldValue('mail');
    if (register.status === 'ok') {
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // onGetCaptcha = () => {
  //   let count = 59;
  //   this.setState({ count });
  //   this.interval = setInterval(() => {
  //     count -= 1;
  //     this.setState({ count });
  //     if (count === 0) {
  //       clearInterval(this.interval);
  //     }
  //   }, 1000);
  // };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { prefix } = this.state;
        dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            prefix,
          },
          callback: res => {
            if (res && res.id) {
              message.success('Tạo user thành công!');
              router.push('/');
            } else {
              message.error('Lỗi khi tạo user!');
            }
          }
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };


  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper
        title="Thêm user"
      >
        <Card bordered={false}>
        <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="Tên đăng nhập" >
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: 'Tên đăng nhập là bắt buộc ',
                },
              ],
            })(
              <Input size="large" placeholder="Tên đăng nhập" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Họ" >
            {getFieldDecorator('first_name', {
              rules: [
                {
                  required: true,
                  message: 'Tên là bắt buộc ',
                },
              ],
            })(
              <Input size="large" placeholder="Họ" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Tên" >
            {getFieldDecorator('last_name', {
              rules: [
                {
                  required: true,
                  message: 'Họ là bắt buộc ',
                },
              ],
            })(
              <Input size="large" placeholder="Tên" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Email" >
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: "Email là bắt buộc",
                },
                {
                  type: 'email',
                  message: "Email phải đúng định dạng",
                },
              ],
            })(
              <Input size="large" placeholder="Email" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Mật khẩu"  help={help}>
            <Popover
              getPopupContainer={node => node.parentNode}
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FormattedMessage id="validation.password.strength.msg" />
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder="Mật khẩu"
                />
              )}
            </Popover>
          </FormItem>
          <FormItem {...formItemLayout} label="Nhập lại mật khẩu" >
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.confirm-password.required' }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder="Xác nhận mật khẩu"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Chức vụ" >
            <InputGroup compact>
              <Select
                size="large"
                value={prefix}
                onChange={this.changePrefix}
                style={{ width: '100%' }}
              >
                <Option value="Admin">Admin</Option>
                <Option value="Quản lý">Quản lý</Option>
                <Option value="Cộng tác viên">Cộng tác viên</Option>
              </Select>
              {getFieldDecorator('user_type', {
                rules: [
                  // {
                  //   required: true,
                  //   message: "Vui lòng chọn 1 chức vụ",
                  // },
                ],
              })}
            </InputGroup>
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              Đăng kí
            </Button>
          </FormItem>
        </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserRegistration;
