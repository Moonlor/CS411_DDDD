import { Component } from 'react';
import { Table, Form, Input, Button, Popover, Collapse, Typography } from 'antd';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';
import {UserAddOutlined} from "@ant-design/icons";

const { Title } = Typography;
const { Panel } = Collapse;

@connect(({ advance, profile, loading }) => ({
  similiarUserList: advance.similiarUserList,
  followMap: profile.followMap,
  loading: loading.effects['advance/searchSimiliar'],
}))
class SocialPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  followUser = (otherId) => {
    const { dispatch, similiarUserList} = this.props;
    const userId = getUserInfo();
    console.log("sending follow request...")
    dispatch({
      type: 'profile/followUser',
      payload: {
        user1: userId,
        user2: otherId
      },
    });

    dispatch({
      type: 'profile/getFollowMap',
      payload: {
        userId: userId,
        userList: similiarUserList
      },
    });
  }

  unfollowUser = (otherId) => {
    const { dispatch, similiarUserList} = this.props;
    const userId = getUserInfo();
    dispatch({
      type: 'profile/unfollowUser',
      payload: {
        user1: userId,
        user2: otherId
      },
    });

    dispatch({
      type: 'profile/getFollowMap',
      payload: {
        userId: userId,
        userList: similiarUserList
      },
    });


  }

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      // console.log(values)
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
    const { limit, offset, similiarUserList, followMap } = this.props;
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
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          // console.log("record: ", record, "map result: ", followMap.get(record.user_id));
          return (
          <span>
            {
              followMap.get(record.user_id)?
                [<Button  onClick={()=>this.unfollowUser(record.user_id)}> <UserAddOutlined />Unfollow</Button>]:
                [<Button  onClick={()=>this.followUser(record.user_id)}> <UserAddOutlined />Follow</Button>]
            }
          </span>
            )
        },
      },
    ]

    const whatIs = (
      <div>
        <p>
          We know this happens sometimes: you love Japanese food, and you also find American food comforting. You can't live without either of them. You just can't.
        </p>
        <p>
          Now the basic features of Delp can't satisfy you anymore, despite that it's already Delp (READ: DOPE). You feel like other Delp users are boring; they don't understand the art and beauty of food.
        </p>
        <p>
          Ah, you sigh, if only there were someone else who loves both Japanese and American foods!
        </p>
        <p>
          This is when we've got you covered: now you can search for people who also like both Japanese and American. Find those California Rolls and share your passion about Japanese and American foods with them.
        </p>
        <p>
          The query takes two restaurant tags, e.g. Japanese and American, and returns users who have written posts mentioning restaurants with those tags, i.e. users who have written about both a Japanese place and an American place.
          If this query doesn't work for some reason, we suggest you go to Hawaii. Or, we don't know, maybe California.
        </p>
        <p>
          We know some of you might feel like: What is this even for? Would anybody find it useful?
        </p>
        <p>
          If that's what you think, here's what we're gonna tell you: You don't understand. You just haven't been there.
        </p>
      </div>
    )

    return (
      <div >
        <Title level={3}>Try Our Super Advanced Query!</Title>
        <div style={{padding: "0 0 10px 0"}}>
          <Collapse>
            <Panel header="What Is This?" key="1">
              {whatIs}
            </Panel>
          </Collapse>
        </div>
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
                initialValue: "American",
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
        </div>

        {similiarUserList && <Table columns={columns} dataSource={similiarUserList} rowKey={'email'}/>}

      </div>
    );
  }
}

export default Form.create()(SocialPage);
// export default SocialPage;
