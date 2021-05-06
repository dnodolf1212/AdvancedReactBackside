import Form from './styles/Form';
import useForm from '../lib/useForm';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User'; 
import { useMutation } from '@apollo/client';
import Error from './ErrorMessage';

const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION($name: String!, $email: String!, 
  $password: String!) {
    createUser(data: {
      email: $email 
      name: $name 
      password: $password
    }) {
      id
      name 
      email
    }
  }
`;

export default function SignUp() {

  const { inputs, handleChange, resetForm } = useForm({
    name: '',
    email: '',
    password: '',
  })

  const [signup, { data, loading, error }] = useMutation(SIGN_UP_MUTATION, {
    variables: inputs, 
    // refetch the currently logged in user
    //refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });
  async function handleSubmit(e){
    e.preventDefault();
    console.log(inputs);
    const res = await signup().catch(console.error);
    console.log(res)
    console.log({ data, loading, error })
    resetForm();
    //send the email and password inputs to GraphQL API
  }


  return (
  <Form method="POST" onSubmit={handleSubmit}>
    <h2>Go Ahead and Sign Up for an Account!!</h2>

    <Error error={error} />
    <fieldset>
  {data?.createUser && <p>Signed up with {data.createUser.email}: Please go Ahead and Sign In!!</p>}
      <label htmlFor="email">
        Your Name 
        <input type="text" name="email" placeholder="Your Name"
        name="name"
        autoComplete="name"
        value={inputs.name} 
        onChange={handleChange} 
        />
      </label>
      <label htmlFor="email">
        Email 
        <input type="email" name="email" placeholder="Your Email Address"
        autoComplete="email"
        value={inputs.email} 
        onChange={handleChange} 
        />
      </label>
      <label htmlFor="password">
        Password 
        <input type="password" name="password" placeholder="Your Password"
        autoComplete="password"
        value={inputs.password} 
        onChange={handleChange} 
        />
      </label>
      <button type="submit">Sign In</button>
    </fieldset>
  </Form>
  )
}