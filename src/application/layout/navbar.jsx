import { NavLink } from "react-router-dom";
import { useCart } from "../../features/cart/ui/hooks/useCart";
import "./navbar.css";

function getNavLinkClassName({ isActive }) {
  return isActive ? "navbar__link navbar__link--active" : "navbar__link";
}

export function Navbar() {
  const { cart } = useCart();
  const totalItems = cart ? cart.getTotalItems() : 0;

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand-group">
          <NavLink to="/" className="navbar__brand" end>
            <span className="navbar__brand-mark">BS</span>
            <span className="navbar__brand-text">
              <span className="navbar__brand-name">BIBETA Shop</span>
              <span className="navbar__brand-tagline">
                Give life to your envy!
              </span>
            </span>
          </NavLink>
        </div>

        <nav aria-label="Main navigation">
          <ul className="navbar__nav-list">
            <li>
              <NavLink to="/" className={getNavLinkClassName} end>
                Store
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className={getNavLinkClassName}>
                Cart
                <span className="navbar__cart-badge">{totalItems}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/checkout" className={getNavLinkClassName}>
                Checkout
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
