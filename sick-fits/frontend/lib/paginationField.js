import { PAGINATION_QUERY } from '../components/Pagination';

export default function PaginationField(){
  return {
    keyArgs: false, //signals apollo not to intervene
    read(existing = [], { args, cache }){
      console.log( existing, args, cache);
      const { skip, first } = args;
      //reading the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY});
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      //checking to see if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      if(items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        //if We dont have any items, we must go to the network
        return false;
      }
      //if we do have items, return them from the cache and dont go to network
      if(items.length) {
        console.log('There are ${items.length} items in the cache! Will send to Apollo');
        return items;
      }
      return false; //fallback to network
    },
    merge(existing, incoming, { args }){
      const { skip, first } = args; 
      //this runs when the Apollo client comes back from the net with our product
      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : []; 
      
      for(let i = skip; i < skip + incoming.length; ++i){
        merged[i] = incoming[i - skip]
      }
      console.log(merged);
      return merged;
    },

  };
}