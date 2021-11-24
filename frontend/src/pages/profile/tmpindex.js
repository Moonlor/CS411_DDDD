import { Component, useState, useEffect } from 'react';
import {Avatar, Button, Card, Divider, Menu, Row, Typography, Col, Form, Icon} from 'antd';
import { UserOutlined, ManOutlined, WomanOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';
import styles from "../../layouts/index.css";
import EditPostCard from "../post/components/EditPostCard";

const { Title, Link: AntLink } = Typography;


// const Profile =


@connect(({ profile }) => ({
  userInfo: profile.userInfo,
  subPageIdx: profile.subPageIdx,
  postList: profile.postList,
  followerList: profile.followerList,
  followingList: profile.followingList,
  numPosts: profile.numPosts,
  numFollowers: profile.numFollowers,
  numFollowing: profile.numFollowing,
  followMap: profile.followMap
}))
class UserProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }


  getBirth = (birth_date) =>{
    const months = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];
    const birthDateObj = new Date(Date.parse(birth_date))
    const birthDay = months[birthDateObj.getDay()];
    const birthMonth = months[birthDateObj.getMonth()];
    const birthYear = birthDateObj.getFullYear();
    return {day: birthDay, month: birthMonth, year: birthYear};
  }

  deletePost (post_id){
    const { dispatch } = this.props;
    dispatch({
      type: 'post/deleteByID',
      payload: {
        post_id: post_id
      },
    });
    setTimeout(() => {
      this.props.history.push("/profile")
    }, 300)
  }


  followUser(userId){
    const { dispatch, userInfo } = this.props;
    dispatch({
      type: 'profile/followUser',
      payload: {
        user1: userInfo.user_id,
        user2: userId
      },
    });
  }

  unfollowUser(userId){
    const { dispatch, userInfo } = this.props;
    dispatch({
      type: 'profile/unfollowUser',
      payload: {
        user1: userInfo.user_id,
        user2: userId
      },
    });

  }

  // getFollowMap(){
  //   const { dispatch, followerList, userInfo } = this.props;
  //   dispatch({
  //     type: 'profile/getFollowMap',
  //     payload: {
  //       userId: userInfo.user_id,
  //       followerList: followerList
  //     }
  //   });
  // }

  handleClick = (e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/saveSubPageIdx',
      payload: {
        key: e.key
      },
    });
  }

  render() {
    const { userInfo, subPageIdx,
      postList, numPosts,
      followerList, numFollowers,
      followingList, numFollowing} = this.props;

    // this.getFollowMap();

    const { followMap } = this.props;
    console.log("followMap: ", followMap);

    // console.log("profile props: ", this.props);
    // let first_name = 'Quinn', last_name = 'L.', gender = '0', birth_date = '01/16/1975, 08:54:36';
    const {first_name, last_name, gender, birth_date} = userInfo;

    const userBirth = this.getBirth(birth_date);
    const userBirthMonth = userBirth.month;
    const userBirthYear = userBirth.year;

    const subPages = [
      // 0: my posts
      (
        <div className="site-card-border-less-wrapper">
          My Posts
          <Card title="Posts"  style={{ width: '100%' }}>
            {
              postList.map((post)=>{
                return (
                  <Card type="inner" title={post.date}
                    // actions={
                    //   post.user_id === getUserInfo()?
                    //   [
                    //     <EditPostCard post={post}/>,
                    //     <Icon type="delete" onClick={deletePost(post.post_id)}/>
                    //   ]:[]}
                        actions={[
                          <EditPostCard post={post}/>,
                          <Icon type="delete" onClick={()=>{this.deletePost(post.post_id)}}/>
                        ]}
                        extra={<Link
                          replace
                          to={{
                            pathname: '/post/detail',
                            search: `?post_id=${post.post_id}`
                          }}
                        >< Icon type="more" /></Link>}>
                    <p>{post.text}</p>
                  </Card>
                );
              })
            }
          </Card>
        </div>
      ),
      // 1: my followers
      (
        <div className="site-card-border-less-wrapper">
          My Followers
          <Card title="Followers"  style={{ width: '100%' }}>
            {
              followerList.map((follower)=>{
                const birth = this.getBirth(follower.birth_date);
                const birthMonth = birth.month, birthYear = birth.year;
                return (
                  <Card type="inner" title={follower.first_name + " " + follower.last_name}
                    // extra={<Link
                    //   to={{
                    //     pathname: '/user/detail',
                    //     search: `?post_id=${post.post_id}`
                    //   }}
                    // >
                    // < Icon type="more" /></Link>}
                    // actions={
                    //   followMap.get(follower.user_id)?
                    //   [<Button  onClick={()=>this.followUser(follower.user_id)}> <UserAddOutlined />Follow</Button>]:
                    //   []
                    // }
                        actions={
                          followMap.get(follower.user_id)?
                            [<Button  onClick={()=>this.followUser(follower.user_id)}> <UserAddOutlined />Follow</Button>]:
                            []
                        }
                  >
                    <p>Born in {birthMonth} {birthYear}</p>
                  </Card>
                );
              })
            }
          </Card>
        </div>
      ),
      // 2: i'm following
      (
        <div className="site-card-border-less-wrapper">
          <Card title="Following"  style={{ width: '100%' }}>
            {
              followingList.map((following)=>{
                const birth = this.getBirth(following.birth_date);
                const birthMonth = birth.month, birthYear = birth.year;
                return (
                  <Card type="inner" title={following.first_name + " " + following.last_name}
                    // extra={<Link
                    //   to={{
                    //     pathname: '/user/detail',
                    //     search: `?post_id=${post.post_id}`
                    //   }}
                    // >
                    // < Icon type="more" /></Link>}
                        actions={
                          [<Button  onClick={()=>this.unfollowUser(following.user_id)}> <UserDeleteOutlined />Unfollow</Button>]
                        }
                  >
                    <p>Born in {birthMonth} {birthYear}</p>
                  </Card>
                );
              })
            }
          </Card>
        </div>
      )
    ];

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
              <p>Born in {userBirthMonth} {userBirthYear}</p>
              <Row>
                <Col span={6}>
                  <Row align="middle">
                    <Divider type={"vertical"}/>
                    <Button type="link">{numFollowers}</Button> <span style={{fontWeight: 'bold'}}>Followers</span>
                  </Row>
                </Col>
                <Col span={6}>
                  <Row align="middle">
                    <Divider type={"vertical"}/>
                    <Button type="link">{numFollowing}</Button> <span style={{fontWeight: 'bold'}}>Following</span>
                  </Row>
                </Col>
                <Col span={6}>
                  <Row align="middle">
                    <Divider type={"vertical"}/>
                    <Button type="link">{numPosts}</Button> <span style={{fontWeight: 'bold'}}>Posts</span>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Divider type="vertical" />
              <Button>Update Profile</Button>
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
                  onClick={this.handleClick}
                >
                  <Menu.Item key={0}>
                    <Icon type="fire" />
                    <span>
                    <Button type="link">Posts</Button>
                  </span>
                  </Menu.Item>
                  {/*<Divider />*/}
                  <Menu.Item key={1}>
                    <Icon type="user" />
                    <span>
                    <Button type="link">Followers</Button>
                  </span>
                  </Menu.Item>
                  <Menu.Item key={2}>
                    <Icon type="user" />
                    <span>
                    <Button type="link">Following</Button>
                  </span>
                  </Menu.Item>

                </Menu>

              </Col>
              <Col span={18}>
                {subPages[subPageIdx]}
              </Col>
            </div>

          </Row>
        </div>
      </div>
    );
  }
}

export default (UserProfile);
