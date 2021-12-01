import { Comment, Tooltip, List, Input, Avatar, Form, Button } from 'antd';
import moment from 'moment';
import { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { getUserInfo } from '../../../utils/authority';

const { TextArea } = Input;

@connect(({ comment, loading }) => ({
    commentList: comment.commentList,
    submitting: loading.effects['comment/send'],
}))
class CommentCard extends Component {

    constructor(props) {
        super(props);
        this.state = { value: ''};

        this.Editor = ({ onChange, onSubmit, submitting, value }) => (
            <>
                <Form.Item>
                    <TextArea rows={4} onChange={onChange} value={value} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                        Add Comment
                    </Button>
                </Form.Item>
            </>
        );
    }

    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        const { dispatch } = this.props;
        dispatch({
            type: 'comment/send',
            payload: {
                post_id: this.props.post_id,
                user_id : getUserInfo(),
                text: this.state.value,
                likes: 0
            },
        });
    };

    handleDelete = (comment_id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'comment/delete',
            payload: {
                post_id: this.props.post_id,
                user_id: getUserInfo(),
                comment_id: comment_id
            },
        });
    }

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    componentWillMount() {
        if (this.props.post_id) {
            const { dispatch } = this.props;
            dispatch({
                type: 'comment/getByPostID',
                payload: {
                    post_id: this.props.post_id
                },
            });
        }
    }

    render() {

        const { submitting, commentList } = this.props;
        const { value } = this.state;


        let data = [];
        if (commentList) {

            for (const v of commentList) {
                let actions = []
                if (v.user_id === getUserInfo()) {
                    actions.push(<span key="comment-list-delete" onClick={this.handleDelete.bind(this, v.post_comment_id)}>Delete</span>)
                }
                data.push({
                    actions: actions,
                    avatar: 'https://joeschmoe.io/api/v1/random?id=' + v.user_id,
                    author: v.first_name + ' ' + v.last_name,
                    content: (
                        <p>
                            {v.text}
                        </p>
                    ),
                    datetime: (
                        <Tooltip title={123}>
                            <span>{moment(v.date, 'MM/DD/YYYY, HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')}</span>
                        </Tooltip>
                    ),
                })
            }
        }

        const avatar_url = "https://joeschmoe.io/api/v1/random?id=" + getUserInfo()

        return (
            <div>
                <Comment
                    avatar={<Avatar src={avatar_url}/>}
                    content={
                        <this.Editor
                            onChange={this.handleChange}
                            onSubmit={this.handleSubmit}
                            submitting={submitting}
                            value={value}
                        />
                    }
                />
                <List
                    className="comment-list"
                    header={`${data.length} replies`}
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <li>
                            <Comment
                                actions={item.actions}
                                author={item.author}
                                avatar={item.avatar}
                                content={item.content}
                                datetime={item.datetime}
                            />
                        </li>
                    )}
                />
            </div>
        );
    }
}

export default CommentCard;
