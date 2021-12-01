import { Component } from 'react';
import { Card, Icon, Avatar, Row } from 'antd';
import { getUserInfo, getAuthority } from '@/utils/authority';
import { Link, history } from 'umi';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom'
import EditPostCard from './EditPostCard';

@connect(({ post, loading }) => ({
    loading: loading.effects['post/getByID'],
    postList: post.postList,
}))
class PostCard extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    cutstr = (str, len) => {
        str = str.replace(/<[^>]+>/g, '');
        var ouputLen = parseInt(Math.random() * (200) + len, 10);
        var str_length = 0;
        var str_len = 0;
        var str_cut = "";
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            var a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= ouputLen) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }

        if (str_length < ouputLen) {
            return str;
        }
    }

    delete = (post_id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'post/deleteByID',
            payload: {
                post_id: post_id
            },
        });
        setTimeout(() => {
            this.props.history.push("/post")
        }, 300)
    }

    render() {
        const { post, linkToDetail } = this.props;
        const { Meta } = Card;

        let actions = [
            <><Icon type="heart" /></>
        ]

        if (post.likes) {
            actions.push(<>{ post.likes }</>)
        }

        if (linkToDetail) {
            actions.push(
                <Link
                    replace
                    to={{
                        pathname: '/post/detail',
                        search: `?post_id=${post.post_id}`
                    }}
                >< Icon type="more" /></Link>)
        }

        if (post.user_id === getUserInfo()) {
            actions.push(<EditPostCard post={post}/>)
            actions.push(<Icon type="delete" onClick={this.delete.bind(this, post.post_id)}/>)
        }

        const avatar_src = 'https://joeschmoe.io/api/v1/random?id=' + post.last_name

        return (
            <div>
                <Card hoverable
                    // cover={
                    //     <img
                    //         alt="example"
                    //         src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    //     />
                    // }
                    actions={actions}
                >
                    <Meta
                        avatar={<Avatar src={avatar_src} />}
                        title={post.first_name + " " + post.last_name}
                        description={linkToDetail ? this.cutstr(post.text, 300) : !linkToDetail && <div dangerouslySetInnerHTML={{
                            __html: post.text
                        }} />}
                    />
                </Card>
            </div>
        );
    }
}

export default withRouter(PostCard);
