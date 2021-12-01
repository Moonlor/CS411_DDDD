import { Component } from 'react';
import { Form, Collapse, Typography, InputNumber, Button, Row, Col, Card, Tag } from 'antd';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';

const { Title } = Typography;
const { Panel } = Collapse;

@connect(({ proc, loading }) => ({
    dataList: proc.dataList,
    runProc: loading.effects['proc/runPro'],
}))
class ExpandPage extends Component {

    constructor(props) {
        super(props);
        this.state = {value: 99};
    }

    handleChange = e => {
        this.setState({
            value: e,
        });
    };

    handleClick = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'proc/runPro',
            payload: {
                user_id: getUserInfo(),
                likes: this.state.value
            },
        });
    }

    render() {

        const { dataList, runProc} = this.props;

        console.log(dataList)

        const whatIs = (
            <div>
                <p>
                    New here? Using our advanced quick expanding function! Automatically follow all people with hot posts and get more inspirations!
                </p>
                
            </div>
        );

        const gridStyle = {
            width: '100%',
            textAlign: 'center',
        };

        const getCategories = (ls) => {
            if (ls)
                return ls.split(", ");
            else
                return [];
        }

        return (
            <div>
                <Title level={3}>Quick expanding your social network! Get more inspirations! </Title>
                <div style={{ padding: "0 0 10px 0" }}>
                    <Collapse>
                        <Panel header="What Is This?" key="1">
                            {whatIs}
                        </Panel>
                    </Collapse>

                </div>

                <div style={{ padding: "0 0 10px 0" }}>
                    <Row gutter={10}>
                        <Col span={2}>
                            <InputNumber min={50} max={1000} value={this.state.value} onChange={this.handleChange} />
                        </Col>
                        
                        <Col span={5}>
                            <Button
                                type="primary"
                                icon="play-circle"
                                loading={runProc}
                                onClick={this.handleClick}
                            >
                                Start!
                            </Button>
                        </Col>
                    </Row>
                    
                    
                </div>

                {dataList && dataList[0] && 

                    <div style={{ background: '#ECECEC', padding: '30px' }}>
                        <Card style={gridStyle} title="Popular Restaurants">
                            {dataList[0].map((object, i) =>
                                <Card.Grid bordered={false} key={i}>
                                    <Title level={4}>{object[1]} [{object[2]}]</Title>
                                    {getCategories(object[3]).map((category) => (
                                        <Tag>{category}</Tag>
                                    ))}
                                </Card.Grid>)}
                        </Card>
                    </div>
                }

                {dataList && dataList[1] &&

                    <div style={{ background: '#ECECEC', padding: '30px' }}>
                        <Card style={gridStyle} title="Popular Cities">
                            {dataList[1].map((object, i) =>
                                <Card.Grid bordered={false} key={i}>
                                    <Title level={4}>{object[1]}</Title>
                                </Card.Grid>)}
                        </Card>
                    </div>
                }

                {dataList && dataList[2] &&

                    <div style={{ background: '#ECECEC', padding: '30px' }}>
                        <Card style={gridStyle} title="Top 10 Places">
                            {dataList[2].map((object, i) =>
                                <Card.Grid bordered={false} key={i}>
                                    <Title level={4}>{object[0]}</Title>
                                </Card.Grid>)}
                        </Card>
                    </div>
                }


            </div>
        );
    }
}

export default Form.create()(ExpandPage);
