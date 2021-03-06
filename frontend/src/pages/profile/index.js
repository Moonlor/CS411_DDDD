import {Component, useState, useEffect, createRef} from 'react';
import {Avatar, Button, Card, Divider, Menu, Row, Typography, Col, Form, Icon, Tag} from 'antd';
import { UserOutlined, ManOutlined, WomanOutlined, UserAddOutlined, UserDeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';
import styles from "../../layouts/index.css";
import EditPostCard from "../post/components/EditPostCard";
import UpdateProfileForm from "./components/UpdateProfileForm"

const { Title, Link: AntLink } = Typography;


// const Profile =


// @connect(({ profile }) => ({
//   userInfo: profile.userInfo,
//   subPageIdx: profile.subPageIdx,
//   postList: profile.postList,
//   followerList: profile.followerList,
//   followingList: profile.followingList,
//   numPosts: profile.numPosts,
//   numFollowers: profile.numFollowers,
//   numFollowing: profile.numFollowing,
//   followMap: profile.followMap
// }))

const UserProfile = (props) => {

  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }


  const getBirth = (birth_date) =>{
    const months = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];
    const birthDateObj = new Date(Date.parse(birth_date))
    const birthDay = months[birthDateObj.getDay()];
    const birthMonth = months[birthDateObj.getMonth()];
    const birthYear = birthDateObj.getFullYear();
    return {day: birthDay, month: birthMonth, year: birthYear};
  }

  const deletePost = (post_id) => {
    const { dispatch } = props;
    dispatch({
      type: 'post/deleteByID',
      payload: {
        post_id: post_id
      },
    });
    setTimeout(() => {
      props.history.push("/profile")
    }, 300)
  }


  const followUser = (userId) => {
    const { dispatch, userInfo } = props;
    console.log("sending follow request...")
    dispatch({
      type: 'profile/followUser',
      payload: {
        user1: userInfo.user_id,
        user2: userId
      },
    });

    // console.log("sending getFollower...")
    // dispatch({
    //   type: 'profile/getFollowers',
    //   payload: {userId: userInfo.user_id, limit: 20, offset: 1 }
    // });
    // dispatch({
    //   type: 'profile/getFollowing',
    //   payload: {userId: userInfo.user_id, limit: 20, offset: 1 }
    // });
  }

  const unfollowUser = (userId) => {
    const { dispatch, userInfo } = props;
    dispatch({
      type: 'profile/unfollowUser',
      payload: {
        user1: userInfo.user_id,
        user2: userId
      },
    });

    // dispatch({
    //   type: 'profile/getFollowers',
    //   payload: {userId: userInfo.user_id, limit: 20, offset: 1 }
    // });
    // dispatch({
    //   type: 'profile/getFollowing',
    //   payload: {userId: userInfo.user_id, limit: 20, offset: 1 }
    // });

  }

  // getFollowMap(){
  //   const { dispatch, followerList, userInfo } = props;
  //   dispatch({
  //     type: 'profile/getFollowMap',
  //     payload: {
  //       userId: userInfo.user_id,
  //       followerList: followerList
  //     }
  //   });
  // }

  const updateProfile = () =>{
    const { dispatch } = props;
    dispatch({
      type: 'profile/saveSubPageIdx',
      payload: {
        key: 3
      },
    });
  }

  const handleClick = (e)=>{
    const { dispatch } = props;
    if(e.key === 1 || e.key === 2){
      dispatch({
        type: 'profile/getFollowers',
        payload: {userId: userInfo.user_id, limit: 20, offset: 1 }
      });
      dispatch({
        type: 'profile/getFollowing',
        payload: {userId: userInfo.user_id, limit: 20, offset: 1 }
      });
    }
    dispatch({
      type: 'profile/saveSubPageIdx',
      payload: {
        key: e.key
      },
    });
  }

  const { userInfo, subPageIdx,
    postList, numPosts,
    followerList, numFollowers,
    followingList, numFollowing,
    checkinList
  } = props;


  const getCategories = (restaurant) => {
    if(restaurant)
      return restaurant.categories.split(", ");
    else
      return [];
  }

    // getFollowMap();

  const { followMap } = props;
  console.log("followMap: ", followMap);

  // console.log("profile props: ", props);
  // let first_name = 'Quinn', last_name = 'L.', gender = '0', birth_date = '01/16/1975, 08:54:36';
  const {first_name, last_name, gender, birth_date} = userInfo;

  const userBirth = getBirth(birth_date);
  const userBirthMonth = userBirth.month;
  const userBirthYear = userBirth.year;

  const formRef = createRef();

  const subPages = [
    // 0: my posts
    (
      <div className="site-card-border-less-wrapper">
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
                        <Icon type="delete" onClick={()=>{deletePost(post.post_id)}}/>
                      ]}
                      extra={<Link
                        replace
                        to={{
                          pathname: '/post/detail',
                          search: `?post_id=${post.post_id}`
                        }}
                  >< Icon type="more" /></Link>} key={post.post_id}>
                  {/*<p>{post.text}</p>*/}
                  <div dangerouslySetInnerHTML={{__html: post.text}}></div>
                </Card>

                // <PostCard key={post.post_id} post={post}/>
              );
            })
          }
        </Card>
      </div>
    ),
    // 1: my followers
    (
      <div className="site-card-border-less-wrapper">
        <Card title="Followers"  style={{ width: '100%' }}>
          {
            followerList.map((follower)=>{
              const birth = getBirth(follower.birth_date);
              const birthMonth = birth.month, birthYear = birth.year;
              return (
                <Card type="inner" title={follower.first_name + " " + follower.last_name}
                  key={follower.user_id}
                      actions={
                        followMap.get(follower.user_id)?
                          [<Button  onClick={()=>unfollowUser(follower.user_id)}> <UserAddOutlined />Unfollow</Button>]:
                          [<Button  onClick={()=>followUser(follower.user_id)}> <UserAddOutlined />Follow</Button>]
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
              const birth = getBirth(following.birth_date);
              const birthMonth = birth.month, birthYear = birth.year;
              return (
                <Card type="inner" title={following.first_name + " " + following.last_name} key={following.user_id}
                  // extra={<Link
                  //   to={{
                  //     pathname: '/user/detail',
                  //     search: `?post_id=${post.post_id}`
                  //   }}
                  // >
                  // < Icon type="more" /></Link>}
                      actions={followMap.get(following.user_id)?
                        [<Button  onClick={()=>unfollowUser(following.user_id)}> <UserAddOutlined />Unfollow</Button>]:
                        [<Button  onClick={()=>followUser(following.user_id)}> <UserAddOutlined />Follow</Button>]
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
    // 3: update profile
    (
      <UpdateProfileForm userInfo={userInfo} ref={formRef}/>
    ),
    // 4: check-ins
    (
      <div className="site-card-border-less-wrapper">
        <Card title="Check-In's"  style={{ width: '100%' }}>
          {
            checkinList.map((restaurant)=>
               (

                <Card type="inner" title={<Link to={{
                    pathname: '/restaurant/detail',
                    search: `?restaurant_id=${restaurant.restaurant_id}`
                  }}
              >{restaurant.name}</Link>}
              key={`?restaurant_id=${restaurant.restaurant_id}`}>
                {/*<Card type="inner" title={<Button type="link">{restaurant.name}</Button>}>*/}
                  <p>
                    { getCategories(restaurant).map( (category) =>(
                      <Tag key={category}>{category}</Tag>
                    ))}
                  </p>
                  <p>Checked In on {restaurant.date}</p>
                </Card>
              )
            )
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
            <Title level={2} style={{display: 'inline-block'}}>{first_name? first_name + ' ' + last_name:""}</Title>
            <span style={{margin: 20}}>
              {gender == '1'?
                <WomanOutlined style={{fontSize: '16px', color: '#f3d2cf'}}/>
                :
                <ManOutlined style={{fontSize: '16px', color: '#6ca0dc'}}/>
              }
            </span>
            <p>Born in {userBirthMonth} {userBirthYear}</p>
            <Row>
              <Col span={8}>
                <Row align="middle">
                  <Divider type={"vertical"}/>
                  <Button type="link">{numPosts}</Button> <span style={{fontWeight: 'bold'}}>Posts</span>
                </Row>
              </Col>
              <Col span={8}>
                <Row align="middle">
                  <Divider type={"vertical"}/>
                  <Button type="link">{numFollowers}</Button> <span style={{fontWeight: 'bold'}}>Followers</span>
                </Row>
              </Col>
              <Col span={8}>
                <Row align="middle">
                  <Divider type={"vertical"}/>
                  <Button type="link">{numFollowing}</Button> <span style={{fontWeight: 'bold'}}>Following</span>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Divider type="vertical" />
            <Button onClick={()=>{updateProfile()}}>Update Profile</Button>
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
                onClick={handleClick}
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
                {/* Note: key=3 is for update profile.*/}
                <Menu.Item key={4}>
                  <CheckCircleOutlined />
                  <span>
                  <Button type="link">Check-In's</Button>
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

export default Form.create()(connect(({ profile }) => ({
  userInfo: profile.userInfo,
  subPageIdx: profile.subPageIdx,
  postList: profile.postList,
  followerList: profile.followerList,
  followingList: profile.followingList,
  checkinList: profile.checkinList,
  numPosts: profile.numPosts,
  numFollowers: profile.numFollowers,
  numFollowing: profile.numFollowing,
  followMap: profile.followMap
}))(UserProfile));
