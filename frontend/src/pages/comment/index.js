import { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';

@connect(({ comment, loading }) => ({
    commentList: comment.commentList,
}))
class CommentPage extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default Form.create()(CommentPage);
