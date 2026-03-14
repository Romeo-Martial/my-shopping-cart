import { createCatalogDependencies } from "./application/composition/catalog";
import { useProducts } from "./features/catalog/ui/hooks/use-products";

const catalogDeps = createCatalogDependencies();

function ProductList() {
  const { products, isLoading, error } = useProducts(catalogDeps.getProducts);

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Failed to load products: {error.message}</p>;
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id.value}>
          <img
            src={product.imageUrl.value}
            alt={product.name.value}
            width="80"
          />
          <h3>{product.name.value}</h3>
          <p>
            {product.price.amount / 100} {product.price.currency}
          </p>
          <p>{product.category.value}</p>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return <ProductList />;
}
