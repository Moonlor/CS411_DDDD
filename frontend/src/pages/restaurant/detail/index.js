import { Component } from 'react';
import { Card, Collapse, Icon, Table, Tag, Typography  } from 'antd';
import { StarTwoTone } from '@ant-design/icons';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';
import EditPostCard from "../../post/components/EditPostCard";
import {Link} from "umi";

const { Title } = Typography;
const { Panel } = Collapse;

@connect(({ restaurant, loading }) => ({
  restaurant: restaurant.restaurant,
  relatedPosts: restaurant.relatedPosts,
  loading: loading.effects['restaurant/search'],
}))
class RestaurantPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onSearch = value => console.log(value);

  render() {
    console.log("restaurant props: ", this.props)
    const { restaurant, relatedPosts } = this.props;

    console.log("relatedPosts: ", relatedPosts)

    // const restaurant = {
    //   categories: "Restaurants, Sandwiches, Soup, Delis, Food, Ice Cream & Frozen Yogurt",
    //   hours: "{'Monday': '10:0-21:0', 'Tuesday': '10:0-21:0', 'Wednesday': '10:0-21:0', 'Thursday': '10:0-21:0', 'Friday': '10:0-21:0', 'Saturday': '10:0-21:0', 'Sunday': '10:0-21:0'}",
    //   is_open: 1,
    //   name: "Code 10",
    //   post_count: 112,
    //   restaurant_id: "N78TSwxdXeYZaKZsyvkryA",
    //   stars: 3.5
    // }

    const getCategories = (restaurant) => {
      if(restaurant)
        return restaurant.categories.split(", ");
      else
        return [];
    }

    const getHours = (restaurant) => {
      if(restaurant){
        const hourObj = JSON.parse(restaurant.hours.replaceAll("'", "\""))
        const dataSource = Object.entries(hourObj).map((entry) => ({
          day: entry[0],
          hours: entry[1]
        }))
        // console.log("datasource: ", dataSource)
        return dataSource;
      }
      else
        return [];
    }


    // const callback = (key) => {
    //   // console.log(key);
    //   if(key === "2"){
    //
    //   }
    // }

    const hourColumns = [
      {
        title: 'Day',
        dataIndex: 'day',
        key: 'day'
      },
      {
        title: 'Hours',
        dataIndex: 'hours',
        key: 'hours'
      }
    ]

    // console.log("datasource: ", getHours(restaurant))
    // console.log("hours entries: ", Object.entries(getHours(restaurant)));

    return (
      <div>
        <Card title={restaurant && restaurant.name}>
          <p>
            { getCategories(restaurant).map( (category) =>(
              <Tag>{category}</Tag>
            ))}
          </p>
          <p>
            Ratings: {restaurant && restaurant.stars} <StarTwoTone twoToneColor={"#FF9529"}></StarTwoTone>
          </p>
          <Collapse>
            <Panel header="Hours" key="1">
              <Table dataSource={getHours(restaurant)} columns={hourColumns} pagination={false}></Table>
            </Panel>
            <Panel header="Related Posts" key="2">
              {
                relatedPosts && relatedPosts.map((post)=>{
                  return (
                    <Card type="inner" title={post.first_name + " " + post.last_name}
                      // actions={
                      //   post.user_id === getUserInfo()?
                      //   [
                      //     <EditPostCard post={post}/>,
                      //     <Icon type="delete" onClick={deletePost(post.post_id)}/>
                      //   ]:[]}
                          extra={<Link
                            replace
                            to={{
                              pathname: '/post/detail',
                              search: `?post_id=${post.post_id}`
                            }}
                          >< Icon type="more" /></Link>}>
                      {/*<p>{post.text}</p>*/}
                      <div dangerouslySetInnerHTML={{__html: post.text}}></div>
                    </Card>

                    // <PostCard key={post.post_id} post={post}/>
                  );
                })
              }
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}

// export default Form.create()(RestaurantPage);
export default RestaurantPage;
