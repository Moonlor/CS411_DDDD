import { Component, createRef } from 'react';
import { Modal, Button, Affix, Icon, Form, Input } from 'antd';
import EditorForm from '@/components/Editor';
import { withRouter } from 'react-router-dom'
import { getUserInfo } from '@/utils/authority';
import { connect } from 'dva';
import moment from 'moment';
import BraftEditor from 'braft-editor'

@connect(({ post, loading }) => ({
    updating: loading.effects['post/updatePost'],
}))
class EditPostCard extends Component {
    formRef = createRef();

    constructor(props) {
        super(props);
        this.state = { visible: false, modalText: "" };
    }

    render() {

        const { post } = this.props
        const showModal = () => {
            this.setState({
                visible: true,
                modalText: 'click Update to update a post!',
            });
            
            setTimeout(() => {
                console.log(this.formRef);
                this.formRef.current.setFieldsValue({
                    content: BraftEditor.createEditorState(post.text)
                })
            }, 700)
        };

        const handleOk = () => {
            this.formRef.current.validateFields((error, values) => {
                if (!error) {
                    const submitData = {
                        text: values.content.toHTML(),
                        date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                    }

                    const { dispatch } = this.props;
                    const { id } = getUserInfo();
                    dispatch({
                        type: 'post/updatePost',
                        payload: {
                            ...submitData,
                            user_id: id,
                            post_id: post.post_id
                        },
                    });
                    this.setState({
                        updating: true,
                    });
                    setTimeout(() => {
                        this.setState({
                            visible: false,
                        });
                        this.props.history.push("/post")
                    }, 1500);
                }
            })
        };
        const handleCancel = () => {
            console.log('Clicked cancel button');
            this.setState({
                visible: false,
            });
        };

        const { updating } = this.props;

        return (
            <>
                <Icon type="edit" onClick={showModal} />
                <Modal
                    title={"Update Post"}
                    visible={this.state.visible}
                    onOk={handleOk}
                    confirmLoading={updating}
                    onCancel={handleCancel}
                    width={800}
                    okText="Update"
                >
                    <p>{this.state.modalText}</p>
                    <EditorForm ref={this.formRef} edit={true}> </EditorForm>
                </Modal>
            </>
            
        );
    }
}

export default withRouter(EditPostCard);