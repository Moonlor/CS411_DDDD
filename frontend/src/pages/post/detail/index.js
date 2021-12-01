import { Component } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';
import CommentCard from '@/pages/comment/components/CommentCard';
import PostCard from '../components/PostCard';

const { Search } = Input;

@connect(({ post, loading }) => ({
    loading: loading.effects['post/getByID'],
    postDetail: post.postDetail,
    postList: post.postList,
}))
class PostDetail extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {};
    }

    render() {
        const { postDetail } = this.props;
        // const { postList } = this.props;

        let posts;
        // if (postList) {
        //     // posts = postList.map(post => (
        //     //     <PostCard key={postDetail.post_id} post={postDetail}/>
        //     // ))
        // }
        if (postDetail) {
          // posts = postList.map(post => (
          //     <PostCard key={postDetail.post_id} post={postDetail}/>
          // ))
          posts = <PostCard key={postDetail.post_id} post={postDetail}/>
        }

        return (
            <div>
                <div>
                    {posts}
                </div>
                <div>
                    {postDetail ? <CommentCard post_id={postDetail.post_id} /> : undefined}
                </div>
            </div>
        );
    }
}

// export default Form.create()(PostDetail);
export default PostDetail;
