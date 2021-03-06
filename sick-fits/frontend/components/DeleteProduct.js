import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id 
      name
    }
  }
`;

function update(cache, payload){
  console.log(payload);
  console.log('Running update function after delete');
  cache.evict(cache.identify(payload.data.deleteProduct))
}

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id }, 
    update: update
  });

  return (
    <button type="button" 
    disabled={loading}
    onClick={() => {
      if ( confirm('Are you sure delete is what you want to do??') ) {
      //run a delete function
        console.log("DELETING!!!!!!!!")
        deleteProduct().catch(err => alert(err.message))
      }
  }}>
    {children}
  </button>
  );
}