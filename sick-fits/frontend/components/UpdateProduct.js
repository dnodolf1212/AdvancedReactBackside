import Product from "./Product";
import gql from 'graphql-tag';
import { useQuery, useMutation } from "@apollo/client";
import Form from './styles/Form';
import DisplayError from './ErrorMessage'
import useForm from '../lib/useForm';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: {id: $id}) {
      id
      name 
      description 
      price 
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String 
    $description: String 
    $price: Int 
  ) {
    updateProduct(
      id: $id 
      data: { name: $name, description: $description,
      price: $price }
    ) {
      id
      name 
      description 
      price 
    }
  }
`;

export default function UpdateProduct({ id }) {
  //get existing product
  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });

  //get mutation to update 
  const [ updateProduct, { data: updateData, error: updateError, 
    loading: updateLoading},] = useMutation(UPDATE_PRODUCT_MUTATION)
  //create state for form inputs
  const { inputs, handleChange, clearForm, resetForm } = useForm(data?.Product);
  console.log(inputs);
  if (loading) return <p>Loading</p>;
  //make a form to hande updates
  return (

    <Form onSubmit={async (e) => {
      e.preventDefault(); // HANDLE SUBMIT!!!
      const res = await updateProduct({
        variables: {
          id,
          name: inputs.name,
          description: inputs.description,
          price: inputs.price,
          // have to pass in product updates here
        },
      }).catch(console.error);
      console.log(res)

      // submit input fields to the backend
      //const res = await createProduct(); //data can be captured by setting this to "const data = await...""
      //clearForm();
      //Go to that products page
      //Router.push({
      //  pathname: `/product/${res.data.createProduct.id}`
      // });
    }}>

      <DisplayError error={error || updateError}/>
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>

        <label htmlFor="name">
          Name
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="Name" 
            value={inputs.name}
            onChange={handleChange}
            />
        </label>

        <label htmlFor="price">
          Price
          <input 
            type="number" 
            id="price" 
            name="price" 
            placeholder="Price" 
            value={inputs.price}
            onChange={handleChange}
            />
        </label>

        <label htmlFor="description">
          Description
          <textarea 
            type="text" 
            id="description" 
            name="description" 
            placeholder="Description" 
            value={inputs.description}
            onChange={handleChange}
            />
        </label>

        <button type="submit">Update Product</button>
      </fieldset>
    </Form>
  );
}