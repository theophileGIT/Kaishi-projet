import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectMatcha, loadMatcha } from "../../slices/matchaSlice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { config } from "../../config";
import { deleteOneProduct, displayProducts } from "../../api/products";
import { getAllOrders } from "../../api/order";
import moment from "moment";

const Admin = (props) => {
  const productState = useSelector((state) => state.matcha) || { products: [] };
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);

  const onClickDeleteProduct = (id) => {
    deleteOneProduct(id)
      .then((res) => {
        console.log("Réponse de la suppression :", res); 
        if (res.status === 200) {
          displayProducts()
            .then((response) => {
              if (response.status === 200) {
                dispatch(loadMatcha(response.result));
              } else {
                console.error("Erreur lors du rechargement des produits :", response);
              }
            })
            .catch((err) => console.error("Erreur lors de l'affichage des produits :", err));
        } else {
          console.error("Erreur lors de la suppression du produit :", res);
        }
      })
      .catch((err) => console.error("Erreur API lors de la suppression :", err));
  };

  useEffect(() => {
    const fetchProductsAndOrders = async () => {
      try {
        const productResponse = await displayProducts();
        if (productResponse.status === 200) {
          dispatch(loadMatcha(productResponse.result));
        } else {
          console.error("Erreur lors de la récupération des produits :", productResponse);
        }

        const orderResponse = await getAllOrders();
        if (orderResponse.status === 200) {
          setOrders(orderResponse.result);
        } else {
          console.error("Erreur lors de la récupération des commandes :", orderResponse);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
      }
    };

    fetchProductsAndOrders();
  }, [dispatch]);

  return (
    <section id="admin">
      <div>
        <h2>Kaishi Admin</h2>

        <h3>Mes produits</h3>
        <table>
          <tbody>
            {productState && Array.isArray(productState.products) && productState.products.length > 0 ? (
              productState.products.map((b) => (
                <tr key={b.id}>
                  <td>
                    <img src={config.pict_url + b.picture} alt={b.name} />
                  </td>
                  <td>{b.name}</td>
                  <td>
                    <Link to={`/EditProduct/${b.id}`}>modifier</Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onClickDeleteProduct(b.id);
                      }}
                    >
                      supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Aucun produit trouvé</td>
              </tr>
            )}
          </tbody>
          <Link to="/addProduct">
            <FontAwesomeIcon icon={faPlusCircle} /> Ajouter un produit
          </Link>
        </table>
      </div>
      <hr />
      <article>
        <h3>Mes commandes</h3>
        
        <div>
          <h4>En attente de paiement</h4>
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Prix total</th>
                <th>Date de confirmation</th>
                <th>État</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => {
                  if (o.status === "not payed" || o.status === "cancelled") {
                    return (
                      <tr key={o.id}>
                        <td>
                          <Link to={`/orderDetail/${o.id}`}>{o.id}</Link>
                        </td>
                        <td>{o.totalAmount} €</td>
                        <td>{moment(o.creationTimestamp).format("DD-MM-YYYY")}</td>
                        <td>{o.status}</td>
                      </tr>
                    );
                  }
                  return null;
                })
              ) : (
                <tr>
                  <td colSpan="4">Aucune commande trouvée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <h4>En cours de traitement</h4>
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Prix total</th>
                <th>Date de confirmation</th>
                <th>État</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => {
                  if (o.status === "payed") {
                    return (
                      <tr key={o.id}>
                        <td>
                          <Link to={`/orderDetail/${o.id}`}>{o.id}</Link>
                        </td>
                        <td>{o.totalAmount} €</td> {/* Correction ici */}
                        <td>{moment(o.creationTimestamp).format("DD-MM-YYYY")}</td>
                        <td>{o.status}</td>
                      </tr>
                    );
                  }
                  return null;
                })
              ) : (
                <tr>
                  <td colSpan="4">Aucune commande trouvée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <h4>Envoyées</h4>
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Prix total</th>
                <th>Date de confirmation</th>
                <th>État</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => {
                  if (o.status === "shipped") {
                    return (
                      <tr key={o.id}>
                        <td>
                          <Link to={`/orderDetail/${o.id}`}>{o.id}</Link>
                        </td>
                        <td>{o.totalAmount} €</td>
                        <td>{moment(o.creationTimestamp).format("DD-MM-YYYY")}</td>
                        <td>{o.status}</td>
                      </tr>
                    );
                  }
                  return null;
                })
              ) : (
                <tr>
                  <td colSpan="4">Aucune commande trouvée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <h4>Terminées</h4>
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Prix total</th>
                <th>Date de confirmation</th>
                <th>État</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => {
                  if (o.status === "finish") {
                    return (
                      <tr key={o.id}>
                        <td>
                          <Link to={`/orderDetail/${o.id}`}>{o.id}</Link>
                        </td>
                        <td>{o.totalAmount} €</td>
                        <td>{moment(o.creationTimestamp).format("DD-MM-YYYY")}</td>
                        <td>{o.status}</td>
                      </tr>
                    );
                  }
                  return null;
                })
              ) : (
                <tr>
                  <td colSpan="4">Aucune commande trouvée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default Admin;
