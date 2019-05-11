import { PureComponent } from "react";
import { List, Modal, Button, Input, Form, message } from 'antd';
import token from '../../../utils/token';
import { connect } from 'dva';

const FormItem = Form.Item;
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
@connect(({ user, loading }) => ({
  submitting: loading.effects['user/changePassword'],
  user,
}))
@Form.create()
class ChangePassword extends PureComponent {

  handleSubmit = () => {
    const { dispatch, form, onCancel } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/changePassword',
          payload: {
            ...values,
            token: token.get()
          },
          callback: (res) => {
            if (!res) message.error('Không thể thay đổi mật khẩu!!');
            else if (res.success) {
              message.success("Thay đổi mật khẩu thành công!");
              onCancel();
              dispatch({
                type: 'login/logout',
              })
            }
          }
        });
      }
    });
  };

  comparePassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value === form.getFieldValue('old_password')) {
      callback('Mật khẩu mới phải khác mật khẩu cũ!');
    } else {
      callback();
    }
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue }, onCancel,
      submitting, } = this.props;
    return (
      <Form hideRequiredMark>
        <FormItem label="Nhập mât khẩu">
          {getFieldDecorator('old_password', {
            initialValue: '',
            rules: [
              {
                required: true,
                type: 'string',
                min: 8,
                message: "Mât khẩu phải ít nhất 8 kí tự",
              },
            ],
          })(<Input type='password' id="oldPasswordInput" placeholder="Nhập mật khẩu" />)}
        </FormItem>
        <FormItem label="Nhập mât khẩu mới">
          {getFieldDecorator('password', {
            validateFirst: true,
            initialValue: '',
            rules: [
              {
                required: true,
                type: 'string',
                min: 8,
                message: "Mât khẩu phải ít nhất 8 kí tự",
              },
              { validator: this.comparePassword, } 
            ],
          })(<Input type='password' id="newPasswordInput" placeholder="Nhập mật khẩu mới" />)}
        </FormItem>
        <div style={{ float: "right", marginTop: "-15px" }}>
          <Button style={{ marginRight: "10px" }} key="btnBack" onClick={onCancel}>Quay lại</Button>
          <Button key="btnChangePassword" type="primary" onClick={this.handleSubmit} loading={submitting}>
            Thay đổi
          </Button>
        </div>
      </Form>
    )
  }
}
export default ChangePassword;