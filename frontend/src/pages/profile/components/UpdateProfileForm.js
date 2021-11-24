import {connect} from "dva";
import {Component} from "react";
import BraftEditor from "braft-editor";
import { Button, Form, Input, DatePicker } from 'antd';
import moment from "moment";
const FormItem = Form.Item

@connect(({ profile }) => ({
  userInfo: profile.userInfo
}))
class UpdateProfileForm extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = (e) => {
    // e.preventDefault();

    this.props.form.validateFields((error, fieldsValue) => {
      const values = {
        ...fieldsValue,
        'birth-date': fieldsValue['birth-date'].format('YYYY-MM-DD HH:mm:ss'),
      }

      // console.log("form falues: ", values);
      const { userInfo, dispatch } = this.props;
      const newUserInfo = {
        ...userInfo,
        birth_date: values["birth-date"],
        email: values["email"]
      }
      // console.log("newUserInfo: ", newUserInfo);
      dispatch({
        type: 'profile/updateProfile',
        payload: {
          userInfo: newUserInfo
        },
      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form
    const { edit, loading, userInfo } = this.props
    const ref = this.props.formRef
    // const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator', 'media']


    return (
      <div className="editor-wrapper">
        <Form onSubmit={this.handleSubmit} ref={ref}>
          <Form.Item label="Birth Date">
            {getFieldDecorator('birth-date', {rules: [{ type: 'object', required: true, message: 'Please select time!' }]})(<DatePicker />)}
          </Form.Item>
          <Form.Item label="Email">
            {getFieldDecorator('email', {rules: [{ type: 'email', required: true, message: 'Please enter email!' }]})(<Input />)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(UpdateProfileForm);
