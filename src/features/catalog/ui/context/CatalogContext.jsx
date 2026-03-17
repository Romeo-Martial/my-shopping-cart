import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CatalogContext = createContext(null);

export function CatalogProvider({ children, getProducts }) {
  if (!getProducts) {
    throw new Error("CatalogProvider requires getProducts use case");
  }

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    setIsLoading(true);

    try {
      const result = await getProducts.execute();

      if (result.isFailure()) {
        setError(result.error);
        setProducts([]);
        return result;
      }

      setError(null);
      setProducts(result.value);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const value = useMemo(() => {
    return {
      products,
      isLoading,
      error,
      loadProducts,
    };
  }, [products, isLoading, error]);

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalogContext() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error("useCatalogContext must be used within a CatalogProvider");
  }

  return context;
}
