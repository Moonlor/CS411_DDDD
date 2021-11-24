import React from 'react';
import { connect } from 'dva';
import ProductList from './ProductList';

const Products = (props) => {
  // const { dispatch, products } = props;
  const dispatch = props.dispatch;
  function handleDelete(id) {
    dispatch({
      type: 'products/delete',
      payload: id,
    });
  }
  console.log("products props " , props);
  return (
    <div>
      <h2>List of Products</h2>
      {/*<ProductList onDelete={handleDelete} products={products} />*/}
    </div>
  );
};

// export default Products;
export default connect(({ products }) => ({
  products,
}))(Products);
