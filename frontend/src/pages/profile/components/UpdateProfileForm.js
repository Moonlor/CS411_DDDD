import {connect} from "dva";
import {Component} from "react";
import BraftEditor from "braft-editor";
import { Button, Form, Input, Select, DatePicker } from 'antd';
import moment from "moment";

const FormItem = Form.Item
const { Option } = Select;

@connect(({ profile }) => ({
  userInfo: profile.userInfo
}))
class UpdateProfileForm extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = () => {
    // e.preventDefault();

    this.props.form.validateFields((error, values) => {

      // console.log("form falues: ", values);
      const { userInfo, dispatch } = this.props;
      values.birth_date = values.birth_date.format("YYYY-MM-DD hh:mm:ss");
      const newUserInfo = {
        ...userInfo,
        ...values
      }
      // console.log("newUserInfo: ", newUserInfo);
      dispatch({
        type: 'profile/updateProfile',
        payload: {
          userInfo: newUserInfo
        },
      });

      dispatch({
        type: 'profile/getUser', payload: {userId: newUserInfo.user_id}
      });

      // dispatch({
      //   type: 'profile/saveSubPageIdx',
      //   payload: {
      //     key: 0
      //   },
      // });

      this.props.history.push("/profile")

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
