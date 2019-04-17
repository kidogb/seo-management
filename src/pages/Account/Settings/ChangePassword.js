import { PureComponent } from "react";
import { List, Modal, Button, Input, Form } from 'antd';

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
@Form.create()
class ChangePassword extends PureComponent {
    
    render() {
        const {
            form: { getFieldDecorator, getFieldValue },
          } = this.props;
        return (
        <FormItem  label="Nhập mât khẩu mới">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    type:'string',
                    min: 8,
                    message: "Mât khẩu phải ít nhất 8 kí tự",
                  },
                ],
              })(<Input id="newPasswordInput" placeholder="Nhập mật khẩu mới" />)}
        </FormItem> );
    }
}
export default ChangePassword;