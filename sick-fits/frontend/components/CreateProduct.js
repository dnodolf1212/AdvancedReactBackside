import DisplayError from './ErrorMessage'
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import { ALL_PRODUCTS_QUERY } from './Products';
import Router from 'next/router';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    #variables and types should be defined here
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: {
          create: {image: $image, altText: $name }}
      }
    ) {
      id 
      price 
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    image: '',
    name: "Hot taters",
    price: 1234,
    description: "Ratchet but couturrrr"
  });

  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION, 
    {
      variables: inputs,
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY}],
    });

  return (

    <Form onSubmit={async (e) => {
      e.preventDefault();
      // submit input fields to the backend
      const res = await createProduct(); //data can be captured by setting this to "const data = await...""
      clearForm();
      //Go to that products page
      Router.push({
        pathname: `/product/${res.data.createProduct.id}`
      })
    }}>

      <DisplayError error={error}/>
      <fieldset disabled={loading} aria-busy={loading}>
      <label htmlFor="image">
          Image
          <input 
            required
            type="file" 
            id="image" 
            name="image" 
            onChange={handleChange}
            />
        </label>

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

        <button type="submit"> + Add Product</button>
      </fieldset>
    </Form>
  );
}