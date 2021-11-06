import { Component, createRef } from 'react';
import { Modal, Button, Affix, Icon, Form, Input } from 'antd';
import { getUserInfo } from '@/utils/authority';

class SendPostCard extends Component {
    formRef = createRef();

    constructor(props) {
        super(props);
        this.state = { visible: false, confirmLoading: false, modalText: "click Send to send a post!" };
    }

    render() {
        const showModal = () => {
            this.setState({
                visible: true,
                modalText: 'click Send to send a post!',
            });
        };

        const handleOk = () => {
            console.log(this.formRef);
            this.setState({
                modalText: 'The modal will be closed after two seconds',
                confirmLoading: true,
            });
            setTimeout(() => {
                this.setState({
                    visible: false,
                    confirmLoading: false,
                });
            }, 2000);
        };
        const handleCancel = () => {
            console.log('Clicked cancel button');
            this.setState({
                visible: false,
            });
        };

        return (

            <Affix offsetTop={40} onChange={affixed => console.log(affixed)}>
                <Button shape="circle" size={'large'} onClick={showModal}><Icon type="plus" /></Button>
                <Modal
                    title="Send Post"
                    visible={this.state.visible}
                    onOk={handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={handleCancel}
                    okText="Send"
                >
                    <Form name="send-post" ref={this.formRef}>
                        <Form.Item name={['post', 'text']} label="wanna say something?" rules={[
                            {
                                required: true,
                            },
                        ]}>
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                    <p>{this.state.modalText}</p>
                </Modal>
            </Affix>
        );
    }
}

export default SendPostCard;