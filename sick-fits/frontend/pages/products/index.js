import Products from '../../components/Products.js';
import Pagination from '../../components/Pagination.js';
import { useRouter } from 'next/dist/client/router';

export default function OrderPage() {
  const { query } = useRouter();
  const page = parseInt(query.page)
  return (
    <div>
      <Pagination page={page || 1} />
      <Products page={page || 1} />
      <Pagination page={page || 1} />
    </div>)
}