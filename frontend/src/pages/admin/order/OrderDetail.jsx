import {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import {getOneOrder, updateOrder} from "../../../api/order"
import moment from "moment"

const OrderDetail = (props) => {
    const [order, setOrder] = useState(null)
    const [orderDetail, setOrderDetail] = useState([])
    const [user, setUser] = useState(null)
    
    const changeStatus = (newStatus) => {
        const datas = {
            orderId: props.params.id,
            status: newStatus
        }
        
        updateOrder(datas)
        .then((res)=>{
            if(res.status === 200){
                recupOrder()
            } else {
                console.log(res)
            }
        })
        .catch(err=>console.log(err))
    }
    
    const recupOrder = () => {
        getOneOrder(props.params.id)
        .then((res)=>{
            if(res.status === 200){
                setOrder(res.order)
                setOrderDetail(res.orderDetail)
                setUser(res.user)
            }
        })
        .catch(err=>console.log(err))
    }
    
    useEffect(()=>{
        recupOrder()
    }, [])
    
    return (<section id="order-detail">
        <Link to="/admin">Retour à l'admin</Link>
        <h2>Commande numéro {props.params.id}</h2>
        {user !== null && <article>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>{user.address}</p>
            <p>{user.zip} {user.city}</p>
            <p>{user.phone}</p>
        </article>}
        <div>
            <h3>Détails de la commande</h3>
            <table >
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Quantitée achetée</th>
                        <th>Prix total</th>
                    </tr>
                </thead>
                {order !== null && <tfoot>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Date</td>
                        <td>{moment(order.creationTimestamp).format("DD-MM-YYYY")}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Total de la commande</td>
                        <td>{order.totalAmount}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Statut</td>
                        <td>{order.status}</td>
                    </tr>
                </tfoot>}
                <tbody>
                    {orderDetail.length > 0 && orderDetail.map((o)=>{
                        return <tr key={o.id}>
                            <td>{o.name}</td>
                            {o.description.length > 30 ? <td>{o.description.substr(0,30)}...</td> : <td>{o.description}</td>}
                            <td>{o.quantity}</td>
                            <td>{o.total} €</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
        <div >
            <button
                onClick={()=>{
                    changeStatus("cancelled")
                }}
            >
                Annuler
            </button>
            <button
                onClick={()=>{
                    changeStatus("shipped")
                }}
            >
                Envoyée
            </button>
            <button
                onClick={()=>{
                    changeStatus("finish")
                }}
            >
                Terminé
            </button>
        </div>
    </section>)
}

export default OrderDetail