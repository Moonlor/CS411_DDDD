import { Component, useState, useEffect } from 'react';
import {Avatar, Button, Card, Divider, Menu, Row, Typography, Col, Form, Icon} from 'antd';
import { UserOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';
import styles from "../../layouts/index.css";

const { Title, Link } = Typography;

// TODO: what props do we need?
const UserProfile = ({userId}) => {

  // TODO: click menu => change state: index of subpage to be shown => show subpage accordingly

  const subPages = [
    // 0: my posts
    (
      <div className="site-card-border-less-wrapper">
        <Card title="My Posts"  style={{ width: '100%' }}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    ),
    // 1: my followers
    (<div>My Followers</div>),
    // 2: i'm following
    (<div>I'm Following</div>),
  ];

  // Dummy user info
  const  first_name = 'Quinn', last_name = 'L.', gender = '0', birth_date = '01/16/1975, 08:54:36';

  // Get year and month of birth
  const months = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
  const birthDateObj = new Date(Date.parse(birth_date))
  const birthMonth = months[birthDateObj.getMonth()];
  const birthYear = birthDateObj.getFullYear();

  const [subPageIdx, setSubPageIdx] = useState(0);

  // Dummy list of followers: only one follower now
  const [followerList, setFollowerList] = useState([{
    "birth_date": "07/16/1975, 08:54:36",
    "email": "qdykUOG@gmail.com",
    "first_name": "Linna",
    "gender": "1",
    "last_name": "Danielle",
    "mobile": "268-792-3284",
    "password": ",f\"2fDU_",
    "user_id": "-0aZWYi2YicFaLxTru96nA"
  }]);
  // Fake num of followers
  const [numFollowers, setNumFollowers] = useState(1)

  // Dummy list of following
  const [followingList, setFollowingList] = useState([{
    "birth_date": "07/16/1975, 08:54:36",
    "email": "qdykUOG@gmail.com",
    "first_name": "Linna",
    "gender": "1",
    "last_name": "Danielle",
    "mobile": "268-792-3284",
    "password": ",f\"2fDU_",
    "user_id": "-0aZWYi2YicFaLxTru96nA"
  }]);
  // Fake num of following
  const [numFollowing, setNumFollowing] = useState(1);

  const [postList, setPostList] = useState([
      {
        "date": "08/20/2010, 18:56:59",
        "likes": 85,
        "post_id": "sscPEJk_Dkuva_ojAlFvZw",
        "starred": 44,
        "stars": 2,
        "text": "As a farewell lunch (aka celebration) of one of my coworkers last days, we ventured over to Max & Dylans for some delicious middle of the day treats. We started off the meal with their philly cheese steak spring rolls. (I did not make that up.) The concept sounded ridiculous- but I have NEVER enjoyed a philly cheese steak more (and I'm from PA). Wanting a lighter lunch, I ordered their French Onion soup which was fantastic- perfect portion to fill me up and still make me feel light enough to finish the day. Luckily, my coworkers ordered their infamous mac & cheese so I could steal a few bites. It was refreshingly light, yet flavorful- cooked to mac & cheese perfection. I loved the atmosphere- with a loft-style layout, nice Euro-feeling bar when you walk in and unique artwork that makes you keep the kids at home. I will definitely return here for lunch (or dare I say dinner), and call it another success of Downtown Crossing!\n\nP.S. After being inside all morning and wanting a little Vitamin D- I was irrevocably happy to find my myself sitting underneath a ceiling of windows beaming sunlight on me as if I had opted out of going to work and instead laid by the Charles and relaxed. (That only lasted about 5 seconds, when I found myself glancing at my watch wondering if we'll make it back to work in time.) Max & Dylans got me through work on Friday!!",
        "user_id": "-0aZWYi2YicFaLxTru96nA"
      }
    ]);
  const [numPosts, setNumPosts] = useState(1);

  const handleClick = (e) => {
    setSubPageIdx(e.key);
    console.log("e.key: ", e.key);
  }

  // TODO: link at all links
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
                onClick={handleClick}
              >
                <Menu.Item key={0}>
                  <Icon type="fire" />
                  <span>
                    <Button type="link">My Posts</Button>
                  </span>
                </Menu.Item>
                {/*<Divider />*/}
                <Menu.Item key={1}>
                  <Icon type="user" />
                  <span>
                    <Button type="link">My Followers</Button>
                  </span>
                </Menu.Item>
                <Menu.Item key={2}>
                  <Icon type="user" />
                  <span>
                    <Button type="link">I'm Following</Button>
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

export default Form.create()(UserProfile);
// export default UserProfile;

// class UserProfile extends Component {
//
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//
//   // onSearch = value => {
//   //   const { dispatch } = this.props;
//   //   dispatch({
//   //     type: 'post/advSearch',
//   //     payload: {
//   //       likes: value
//   //     },
//   //   });
//   // };
//
//
//
//   subPages = [
//     (<div>Subpage 1</div>)
//   ];
//
//   // TODO: click menu => change state: index of subpage to be shown => show subpage accordingly
//   // TODO: get list of followers, following, posts, etc. and get counts. Display counts on profile
//
//   render() {
//     // const { limit, offset, postList } = this.props;
//     let first_name = 'Quinn', last_name = 'L.', gender = '0', birth_date = '01/16/1975, 08:54:36';
//
//     const months = [ "January", "February", "March", "April", "May", "June",
//       "July", "August", "September", "October", "November", "December" ];
//
//     const birthDateObj = new Date(Date.parse(birth_date))
//     const birthMonth = months[birthDateObj.getMonth()];
//     const birthYear = birthDateObj.getFullYear();
//
//     return (
//       <div>
//         <div style={{ padding: 40 }}>
//           <Row>
//             <Col span={6}>
//               <Avatar size={160} icon={<UserOutlined />} />
//             </Col>
//             <Col span={12}>
//                 <Title level={2} style={{display: 'inline-block'}}>{first_name + ' ' + last_name}</Title>
//                 <span style={{margin: 20}}>
//                   {gender == '1'?
//                     <WomanOutlined style={{fontSize: '16px', color: '#f3d2cf'}}/>
//                     :
//                     <ManOutlined style={{fontSize: '16px', color: '#6ca0dc'}}/>
//                   }
//                 </span>
//                 <p>Born in {birthMonth} {birthYear}</p>
//             </Col>
//             <Col span={6}>
//               <Divider type="vertical" />
//               <Button type="link">Update Profile</Button>
//             </Col>
//
//           </Row>
//           <Row>
//             <div style={{padding: 40}}>
//               <Col span={6}>
//                 <Title level={4}>{first_name}'s Profile</Title>
//                 <Menu
//                   theme="light"
//                   // defaultSelectedKeys={['/monitor']}
//                   mode="inline"
//                   // selectedKeys={[pathName]}
//                   // onClick={this.handleClick}
//                 >
//                   <Menu.Item key="/posts">
//                     <Icon type="fire" />
//                     <span>
//                       <Button type="link">My Posts</Button>
//                     </span>
//                   </Menu.Item>
//                   {/*<Divider />*/}
//                   <Menu.Item key="/followers">
//                     <Icon type="user" />
//                     <span>
//                       <Button type="link">My Followers</Button>
//                     </span>
//                   </Menu.Item>
//                   <Menu.Item key="/following">
//                     <Icon type="user" />
//                     <span>
//                       <Button type="link">I'm Following</Button>
//                     </span>
//                   </Menu.Item>
//
//                 </Menu>
//
//               </Col>
//               <Col span={18}>
//                 {this.subPages[0]}
//               </Col>
//             </div>
//
//           </Row>
//         </div>
//       </div>
//     );
//   }
// }
//
// export default Form.create()(UserProfile);
