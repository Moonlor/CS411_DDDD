import { Component } from 'react';
import { Table, Form, Input, Button } from 'antd';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';


@connect(({ advance, loading }) => ({
  similiarUserList: advance.similiarUserList,
  loading: loading.effects['advance/searchSimiliar'],
}))
class SocialPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        const { dispatch } = this.props;
        const { id } = getUserInfo();
        dispatch({
          type: 'advance/searchSimiliar',
          payload: {
            ...values,
            userId: id
          },
        });
      }
    });
  };

  render() {
    const { limit, offset, similiarUserList } = this.props;
    const { getFieldDecorator } = this.props.form
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
    ]

    return (
      <div>
        <Form onSubmit={this.handleOk}>

          <Input.Group compact>
            {getFieldDecorator('tag1', {
              validateTrigger: ["onChange", "onBlur"],
              initialValue: "Japanese",
              rules: [
                {
                  required: true,
                  message: "please fill tag1"
                }
              ],
            })(
              <Input allowClear style={{ width: '20%' }} />
            )}
            {getFieldDecorator('tag2', {
              validateTrigger: ["onChange", "onBlur"],
              initialValue: "Italian",
              rules: [
                {
                  required: true,
                  message: "please fill tag2",
                }
              ]
            })(
              <Input allowClear style={{ width: '20%' }} />
            )}

            <Button type="primary" htmlType="submit">
              Search
            </Button>

          </Input.Group>
        </Form>
        {similiarUserList && <Table columns={columns} dataSource={similiarUserList} />}

      </div>
    );
  }
}

export default Form.create()(SocialPage);
// export default SocialPage;
