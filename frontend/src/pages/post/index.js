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
  offset: post.offset,
  limit: post.limit,
  loading: loading.effects['post/get'],
}))
class PostPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onSearch = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'post/advSearch',
      payload: {
        likes: value
      },
    });
  };



  render() {
    const { limit, offset, postList } = this.props;

    let posts;
    if (postList) {
      posts = postList.map(post => (
        <PostCard key={post.post_id} post={post} linkToDetail={true}/>
      ))
    }

    return (
      <div>
        <div style={{ padding: 40 }}>
          <Row>
            <Col span={4}>
              <SendPostCard offset={offset} limit={limit}></SendPostCard>
            </Col>
            <Col span={16}>
              <Search placeholder="posts with likes more than?" onSearch={this.onSearch.bind(this)} enterButton />
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

// export default Form.create()(PostPage);

export default PostPage;
