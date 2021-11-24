import { Component } from 'react';
import { Row, Col, Form, Input } from 'antd';
import { connect } from 'dva';
import { getUserInfo } from '@/utils/authority';


@connect(({ restaurant, loading }) => ({
  restaurantList: restaurant.restaurantList,
  offset: restaurant.offset,
  limit: restaurant.limit,
  loading: loading.effects['restaurant/search'],
}))
class RestaurantPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onSearch = value => console.log(value);

  render() {
    const { limit, offset } = this.props;

    return (
      <div>
      </div>
    );
  }
}

// export default Form.create()(RestaurantPage);
export default RestaurantPage;
