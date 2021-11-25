import { Card } from 'antd';
import { Component } from 'react';
import Link from 'umi/link';
import { Form, Input, Button, Select, DatePicker} from 'antd';
import { connect } from 'dva';

import styles from './index.css';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ registerPage, loading }) => ({
  registerPage,
  submitting: loading.effects['userRegister/register'],
}))
class RegisterPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        values.birth_date = values.birth_date.format("YYYY-MM-DD hh:mm:ss");
        dispatch({
          type: 'userRegister/register',
          payload: {
            ...values
          },
        });
      }
    });
  };

  render() {

    const { getFieldDecorator } = this.props.form
    const { submitting } = this.props;

    return (
      <Card
        hoverable
        className={styles.register}
        title="Create an account"
        style={{ textAlign: "center" }}
      >
        <div>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: "please input email",
                  },
                  {
                    type: 'email',
                    message: "wrong email format",
                  },
                ],
              })(
                <Input size="large" placeholder={"email"} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('first_name', {
                rules: [
                  {
                    required: true,
                    message: "please input your first name",
                  },
                ],
              })(
                <Input size="large" placeholder={"first name"} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('last_name', {
                rules: [
                  {
                    required: true,
                    message: "please input your last name",
                  },
                ],
              })(
                <Input size="large" placeholder={"last name"} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: "please input mobile",
                  }
                ],
              })(
                <Input size="large" placeholder={"mobile"} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('gender', {
                rules: [
                  {
                    required: true,
                    message: "please select your gender",
                  }
                ],
              })(
                <Select placeholder={'Gender'}>
                  <Option value={0}>Male</Option>
                  <Option value={1}>Female</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('birth_date', {
                rules: [
                  {
                    required: true,
                    message: "please input your birthday",
                  }
                ],
              })(
                <DatePicker placeholder={'Birthday'} style={{ width: '100%' }}/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: "please input password",
                  }
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder={"password"}
                />
              )}
            </FormItem>
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                type="primary"
                htmlType="submit"
              >
                Register
              </Button>
            </FormItem>
          </Form>
        </div>
        <Card.Meta title="Already own an account?" description={
          <Link to="/login">
            Login
          </Link>
        } />
      </Card>
    );
  }
}

export default Form.create()(RegisterPage);
// export default RegisterPage;
