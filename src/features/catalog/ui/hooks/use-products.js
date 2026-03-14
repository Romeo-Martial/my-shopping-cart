import { useEffect, useState } from "react";

export function useProducts(getProducts) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getProducts.execute();

        if (isMounted) {
          setProducts(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [getProducts]);

  return {
    products,
    isLoading,
    error,
  };
}
