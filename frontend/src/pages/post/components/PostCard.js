import { Component } from 'react';
import { Card, Icon, Avatar } from 'antd';
import { getUserInfo, getAuthority } from '@/utils/authority';


class PostCard extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    cutstr = (str, len) => {
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

    render() {
        const { post } = this.props;
        const { Meta } = Card;

        let actions = [
            <Icon type="heart" />,
            <Icon type="edit" />,
            <Icon type="more" />
        ]

        if (post.user_id == "PHSTEBs8VEyXc_Jki-nyHQ") {
            actions.push(<Icon type="delete" />)
        }

        return (
            <div>
                <Card hoverable
                    cover={
                        <img
                            alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                    }
                    actions={actions}
                >
                    <Meta
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                        title={post.user_id}
                        description={this.cutstr(post.text, 300)}
                    />
                </Card>
            </div>
        );
    }
}

export default PostCard;