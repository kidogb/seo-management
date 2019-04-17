import React, { Component, Fragment, } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { List, Modal, Button, Input, Form } from 'antd';
import ChangePassword from './ChangePassword';
// import { getTimeDistance } from '@/utils/utils';
const FormItem = Form.Item;
const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
      Weak
    </font>
  ),
};

class SecurityView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisplayChangePasswordModal: false,
    }
  }
  

  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      description: (
        <Fragment>
          {formatMessage({ id: 'app.settings.security.password-description' })}：
          {passwordStrength.strong}
        </Fragment>
      ),
      actions: [
        <a
        onClick={this.displayChangePasswordModal}
        >
          Đổi mật khẩu
        </a>,
      ],
    },
    // {
    //   title: formatMessage({ id: 'app.settings.security.phone' }, {}),
    //   description: `${formatMessage(
    //     { id: 'app.settings.security.phone-description' },
    //     {}
    //   )}：138****8293`,
    //   actions: [
    //     <a>
    //       <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
    //     </a>,
    //   ],
    // },
    // {
    //   title: formatMessage({ id: 'app.settings.security.question' }, {}),
    //   description: formatMessage({ id: 'app.settings.security.question-description' }, {}),
    //   actions: [
    //     <a>
    //       <FormattedMessage id="app.settings.security.set" defaultMessage="Set" />
    //     </a>,
    //   ],
    // },
    // {
    //   title: formatMessage({ id: 'app.settings.security.email' }, {}),
    //   description: `${formatMessage(
    //     { id: 'app.settings.security.email-description' },
    //     {}
    //   )}：ant***sign.com`,
    //   actions: [
    //     <a>
    //       <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
    //     </a>,
    //   ],
    // },
    // {
    //   title: formatMessage({ id: 'app.settings.security.mfa' }, {}),
    //   description: formatMessage({ id: 'app.settings.security.mfa-description' }, {}),
    //   actions: [
    //     <a>
    //       <FormattedMessage id="app.settings.security.bind" defaultMessage="Bind" />
    //     </a>,
    //   ],
    // },
  ];

  displayChangePasswordModal = () => {
    this.setState ({
      isDisplayChangePasswordModal: true,
    });
  }

  render() {
    const {isDisplayChangePasswordModal} = this.state;
    return (
      <Fragment>
        <Modal
          id="changePasswordModal"
          visible={isDisplayChangePasswordModal}
          title="Đổi mật khẩu"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="Quay lại" onClick={this.handleCancel}>Return</Button>,
            <Button key="Thay đổi" type="primary" onClick={this.handleOk}>
              Đổi mật khẩu
            </Button>,
          ]}
        >
          <ChangePassword/>
        </Modal>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default SecurityView;
