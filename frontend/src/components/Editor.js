import BraftEditor from 'braft-editor'
import { Component } from 'react'
import { Form, Input } from 'antd';
import { getUserInfo } from '@/utils/authority';
import 'braft-editor/dist/index.css'
import { Select, Spin } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item
const { Option } = Select;

@connect(({ restaurant, loading }) => ({
    restaurantList: restaurant.restaurantList,
    offset: restaurant.offset,
    limit: restaurant.limit,
    loading: loading.effects['restaurant/search'],
}))
class FormEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    
    render() {
        const { getFieldDecorator } = this.props.form
        const { edit, loading, restaurantList } = this.props
        const ref = this.props.formRef
        const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator', 'media']

        const debounceFetcher = (keyword) => {
            const { dispatch } = this.props;
            dispatch({
                type: 'restaurant/search',
                payload: {
                    keyword: keyword,
                    limit: 20,
                    offset: 0
                },
            });
        }

        const options = restaurantList ? restaurantList.map((r) => (<Option value={r.restaurant_id} key={r.restaurant_id} >{r.name}</Option>)) : [];

        return (
            <div className="editor-wrapper">
                <Form onSubmit={this.handleOk} ref={ref}>
                    {!edit && <FormItem label="Title">
                        {getFieldDecorator('title', {
                            rules: [{
                                required: true,
                                message: 'please input title',
                            }],
                        })(
                            <Input size="large" placeholder="please input title" />
                        )}
                    </FormItem>}

                    {!edit && <FormItem label="Resuaurant">
                        {getFieldDecorator('restaurants', {
                            rules: [{
                                required: true,
                                message: 'please select related restaurant',
                            }],
                        })(
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Select restaurants"
                                notFoundContent={loading ? <Spin size="small" /> : null}
                                mode="multiple"
                                filterOption={false}
                                onSearch={debounceFetcher}
                            >{options}</Select>
                        )}
                    </FormItem>}
                    
                    <FormItem label="Text">
                        {getFieldDecorator('content', {
                            validateTrigger: 'onBlur',
                            rules: [{
                                required: true,
                                validator: (_, value, callback) => {
                                    if (value.isEmpty()) {
                                        callback('please input your post')
                                    } else {
                                        callback()
                                    }
                                }
                            }],
                        })(
                            <BraftEditor
                                className="my-editor"
                                controls={controls}
                                placeholder="please input your post"
                                language="en"
                            />
                        )}
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(FormEditor);