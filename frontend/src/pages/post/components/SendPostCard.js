import { Component, createRef } from 'react';
import { Modal, Button, Affix, Icon } from 'antd';
import EditorForm from '@/components/Editor';
import { getUserInfo } from '@/utils/authority';
import { connect } from 'dva';
import moment from 'moment';

@connect(({ post, loading }) => ({
    sending: loading.effects['post/sendPost'],
}))
class SendPostCard extends Component {
    formRef = createRef();

    constructor(props) {
        super(props);
        this.state = { visible: false, modalText: "click Send to send a post!" };
    }

    render() {
        const showModal = () => {
            this.setState({
                visible: true,
                modalText: 'click Send to send a post!',
            });
        };

        const handleOk = () => {
            this.formRef.current.validateFields((error, values) => {
                if (!error) {
                    const submitData = {
                        stars: 0,
                        title: values.title,
                        text: values.content.toHTML(),
                        date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                        restaurant_ids: values.restaurants,
                    }

                    const { dispatch } = this.props;
                    const { id } = getUserInfo();
                    dispatch({
                        type: 'post/sendPost',
                        payload: {
                            ...submitData,
                            userId: id,
                            offset: this.props.offset,
                            limit: this.props.limit
                        },
                    });
                    this.setState({
                        sending: true,
                    });
                    setTimeout(() => {
                        this.setState({
                            visible: false,
                        });
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

        const { sending } = this.props;

        return (

            <Affix offsetTop={40} onChange={affixed => console.log(affixed)}>
                <div>
                    <Button shape="circle" size={'large'} onClick={showModal}><Icon type="plus" /></Button>
                    <Modal
                        title="Send Post"
                        visible={this.state.visible}
                        onOk={handleOk}
                        confirmLoading={sending}
                        onCancel={handleCancel}
                        width={800}
                        okText="Send"
                    >
                        <p>{this.state.modalText}</p>
                        <EditorForm ref={this.formRef}> </EditorForm>
                    </Modal>

                </div>
            </Affix>
        );
    }
}

export default SendPostCard;