import { Layout, Menu, Icon } from 'antd';
import { Component } from 'react';
import { routerRedux } from 'dva/router';
import { setAuthority, setUserInfo } from '@/utils/authority';
import Link from 'umi/link';

import styles from './index.css';

const { Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class MainLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  logoutHandler = (e) => {
    setAuthority(null);
    setUserInfo(null);
    this.props.history.push("/login");
  };

  handleClick = e => {
    this.props.history.push(e.key);
  };

  render() {

    const pathName = this.props.location.pathname;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className={styles.logo} />
          <Menu
            theme="dark"
            defaultSelectedKeys={['/monitor']}
            mode="inline"
            selectedKeys={[pathName]}
            // onClick={this.handleClick}
            >

            <Menu.Item key="/post">
              <Icon type="fire" />
              <span>
                <Link className={styles.menuLink} to="/post">Posts</Link>
              </span>
            </Menu.Item>
            <Menu.Item key="/social">
              <Icon type="team" />
              <span>
                <Link className={styles.menuLink} to="/social">Social</Link>
              </span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />
                  <span>User</span>
                </span>
              }
            >
              <Menu.Item key="logout" onClick={this.logoutHandler}>Log Out</Menu.Item>
              <Menu.Item key="profile">
                <Link className={styles.menuLink} to="/profile">Profile</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '16px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Delp ©2021</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default MainLayout;
