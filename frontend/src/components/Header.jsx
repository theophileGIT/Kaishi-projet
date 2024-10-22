import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo-Kaishi.png";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "../slices/userSlice";
import { selectBasket } from "../slices/basketSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faPlus, faGears, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import Headband from '../components/Scrolling-headband';



const Header = () => {
  const user = useSelector(selectUser);
  const basket = useSelector(selectBasket);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isArrowUp, setIsArrowUp] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const logout = (e) => {
    e.preventDefault();
    window.localStorage.removeItem('kaishi-token');
    dispatch(logoutUser());
    navigate('/login');
    window.location.reload();
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setIsArrowUp(!isArrowUp);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsVisible(false);
    } else {
      // Sinon, afficher le header
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Nettoyage de l'événement d'écoute lors de la destruction du composant
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={isVisible ? 'visible' : 'hidden'}>
      <Headband message="Livraison gratuite en France"
        imageUrl="//assets/imagess/signature-kaishi.png"
      />
      <nav id='right-element'>
        <div>
          <Link to="/">
            <img src={Logo} alt="logo-Kaishi" />
          </Link>
        </div>
        {user.isLogged === false ?
          <nav>
            <ul>
              <li><Link to="/register"><FontAwesomeIcon icon={faPlus} /> </Link></li>
              <li><Link to="/login"><FontAwesomeIcon icon={faUser} className="header-icon" /></Link></li>
              <li><Link to="/cart"><FontAwesomeIcon icon={faCartShopping} className="header-icon" />{basket.basket.length > 0 && <span>{basket.basket.length}</span>} </Link></li>
            </ul>
          </nav> :
          <nav className="user-nav">
            {user.infos.role === "admin" && <Link to="/admin" className="admin-link"><FontAwesomeIcon icon={faGears} /></Link>}
            <div className="user-icon" onClick={togglePopup}>
              <FontAwesomeIcon icon={faUser} className="header-icon" />
              {isArrowUp ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
            </div>
            <Link to="/cart" className="cart-link">
              <FontAwesomeIcon icon={faCartShopping} className="header-icon" />
              {basket.basket.length > 0 && <span>{basket.basket.length}</span>}
            </Link>
          </nav>}
        {isPopupOpen && (
          <div className="user-popup">
            <span>{user.infos.email}</span>
            <ul>
              <li><Link to="/profil">Profil</Link></li>
              <li><a href="#" onClick={logout}>Se déconnecter</a></li>
            </ul>
          </div>
        )}
      </nav>

      <section>
        <nav>
          <ul>
            <li><Link to="/">Shop all</Link></li>
            <li><Link to="/product">Matcha</Link></li>
            <li><Link to="/accessory">Accessoires</Link></li>
            <li><Link to="/story">Notre histoire</Link></li>
            <li><Link to="/localisation">Notre bar</Link></li>
          </ul>
        </nav>
      </section>
    </header>
  );
};

export default Header;
