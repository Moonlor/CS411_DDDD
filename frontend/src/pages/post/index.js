import { Component } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';
import StackGrid from "react-stack-grid";
import PostCard from './components/PostCard';
import SendPostCard from './components/SendPostCard';

const { Search } = Input;

@connect(({ post, loading }) => ({
  postList: post.postList,
  pageNum: post.pageNum,
  pageSize: post.pageSize,
  loading: loading.effects['post/get'],
}))
class PostPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.confirmLoading !== nextProps.confirmLoading) {
      if (nextProps.confirmLoading) {
        this.setState({
          visible: !nextProps.confirmLoading
        })
      }
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { id } = getUserInfo();
        dispatch({
          type: 'container/addNewServer',
          payload: {
            ...values,
            userId: id
          },
        });
        this.setState({
          confirmLoading: true,
        });
        setTimeout(() => {
          this.setState({
            visible: false,
          });
        }, 1500);
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onSearch = value => console.log(value);

  render() {
    const { loading, postList } = this.props;
    const { visible } = this.state;

    let posts;
    if (postList) {
      posts = postList.map(post => (
        <PostCard key={post.post_id} post={post} />
      ))
    }

    return (
      <div>
        <div style={{ padding: 40 }}>
          <Row>
            <Col span={4}>
              <SendPostCard></SendPostCard>
            </Col>
            <Col span={16}>
              <Search placeholder="input search text" onSearch={this.onSearch.bind(this)} enterButton />
            </Col>
            <Col span={4}>
            </Col>
          </Row>
        </div>
        <StackGrid
          monitorImagesLoaded={true}
          columnWidth={300}
        >
          {posts}
        </StackGrid>
      </div>
    );
  }
}

export default Form.create()(PostPage);