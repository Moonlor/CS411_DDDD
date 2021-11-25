import { Card } from 'antd';
import { Login } from 'ant-design-pro';
import { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';

import styles from './index.css';

const { UserName, Password, Submit } = Login;

@connect(({ loginPage, loading }) => ({
  loginPage,
  submitting: loading.effects['userLogin/login'],
}))
class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'userLogin/login',
        payload: {
          ...values
        },
      });
    }
  };

  render() {

    const { submitting } = this.props;

    return (
      <Card
        hoverable
        className={styles.login}
        title="Login"
        style={{ textAlign: "center" }}
      >
        <div>
          <Login
            onSubmit={this.handleSubmit}
            ref={form => {
              this.loginForm = form;
            }}
          >
            <UserName
              name="email"
              placeholder={"Email"}
              rules={[
                {
                  required: true,
                  message: "please input email",
                },
                {
                  type: 'email',
                  message: "wrong email format",
                }
              ]}
            />
            <Password
              name="password"
              placeholder={"password"}
              rules={[
                {
                  required: true,
                  message: "please input password",
                },
              ]}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            <Submit loading={submitting}>
              Login
            </Submit>
            <Card.Meta title="Not registered?" description={
              <Link to="/register">
                Create an account
              </Link>
            } />
          </Login>
        </div>
      </Card>
    );
  }
}

export default LoginPage;
