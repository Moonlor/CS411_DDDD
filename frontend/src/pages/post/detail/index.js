import { Component } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';
import PostCard from '../components/PostCard';

const { Search } = Input;

@connect(({ post, loading }) => ({
    loading: loading.effects['post/getByID'],
    postList: post.postList,
}))
class PostDetail extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {};
    }

    render() {
        const { postList } = this.props;

        let posts;
        if (postList) {
            posts = postList.map(post => (
                <PostCard key={post.post_id} post={post}/>
            ))
        }

        return (
            <div>
                {posts}
            </div>
        );
    }
}

export default Form.create()(PostDetail);