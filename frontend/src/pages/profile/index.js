import { Component } from 'react';
import {Avatar, Button, Divider, Menu, Row, Typography, Col, Form, Icon} from 'antd';
import { UserOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';
import styles from "../../layouts/index.css";

const { Title, Link } = Typography;

// TODO: connect
// @connect(({ post, loading }) => ({
//   postList: post.postList,
//   offset: post.offset,
//   limit: post.limit,
//   loading: loading.effects['post/get'],
// }))


class UserProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  // onSearch = value => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'post/advSearch',
  //     payload: {
  //       likes: value
  //     },
  //   });
  // };

  subPages = [
    (<div>Subpage 1</div>)
  ];

  // TODO: click menu => change state: index of subpage to be shown => show subpage accordingly
  // TODO: get list of followers, following, posts, etc. and get counts. Display counts on profile

  render() {
    // const { limit, offset, postList } = this.props;
    let first_name = 'Quinn', last_name = 'L.', gender = '0', birth_date = '01/16/1975, 08:54:36';

    const months = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];

    const birthDateObj = new Date(Date.parse(birth_date))
    const birthMonth = months[birthDateObj.getMonth()];
    const birthYear = birthDateObj.getFullYear();

    return (
      <div>
        <div style={{ padding: 40 }}>
          <Row>
            <Col span={6}>
              <Avatar size={160} icon={<UserOutlined />} />
            </Col>
            <Col span={12}>
                <Title level={2} style={{display: 'inline-block'}}>{first_name + ' ' + last_name}</Title>
                <span style={{margin: 20}}>
                  {gender == '1'?
                    <WomanOutlined style={{fontSize: '16px', color: '#f3d2cf'}}/>
                    :
                    <ManOutlined style={{fontSize: '16px', color: '#6ca0dc'}}/>
                  }
                </span>
                <p>Born in {birthMonth} {birthYear}</p>
            </Col>
            <Col span={6}>
              <Divider type="vertical" />
              <Button type="link">Update Profile</Button>
            </Col>

          </Row>
          <Row>
            <div style={{padding: 40}}>
              <Col span={6}>
                <Title level={4}>{first_name}'s Profile</Title>
                <Menu
                  theme="light"
                  // defaultSelectedKeys={['/monitor']}
                  mode="inline"
                  // selectedKeys={[pathName]}
                  // onClick={this.handleClick}
                >
                  <Menu.Item key="/posts">
                    <Icon type="fire" />
                    <span>
                      <Button type="link">My Posts</Button>
                    </span>
                  </Menu.Item>
                  {/*<Divider />*/}
                  <Menu.Item key="/followers">
                    <Icon type="user" />
                    <span>
                      <Button type="link">My Followers</Button>
                    </span>
                  </Menu.Item>
                  <Menu.Item key="/following">
                    <Icon type="user" />
                    <span>
                      <Button type="link">I'm Following</Button>
                    </span>
                  </Menu.Item>

                </Menu>

              </Col>
              <Col span={18}>
                {this.subPages[0]}
              </Col>
            </div>

          </Row>
        </div>
      </div>
    );
  }
}

export default Form.create()(UserProfile);
