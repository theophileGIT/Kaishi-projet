import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Register from "./pages/user/Register"
import Profil from "./pages/user/Profil"
import Login from "./pages/user/Login"
import Product from "./pages/Product"
import Accessory from "./pages/Accessory"
import Detail from "./pages/Detail"
import Basket from "./pages/Basket"
import Payment from "./pages/Payment"
import Success from "./pages/Success"
import Admin from "./pages/admin/Admin"
import AddProduct from "./pages/admin/product/AddProduct"
import EditProduct from "./pages/admin/product/EditProduct"
import OrderDetail from "./pages/admin/order/OrderDetail"
import Story from "./pages/Story"
import Localisation from "./pages/Localisation"
import Contact from "./pages/Contacts"
import { Routes, Route, Navigate } from "react-router-dom"
import './App.css'

import RequireAuth from "./helpers/require-auth"


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<RequireAuth child={Home} auth={false} admin={false} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profil" element={<RequireAuth child={Profil} auth={true} admin={false}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/product" element={<RequireAuth child={Product} auth={false} admin={false}/>} />
        <Route path="/accessory" element={<RequireAuth child={Accessory} auth={false} admin={false}/>} />
        <Route path="/detail/:id" element={<RequireAuth child={Detail} auth={false} admin={false}/>} />
        <Route path="/cart" element={<RequireAuth child={Basket} auth={false} admin={false} />} />
        <Route path="/payment/:orderId" element={<RequireAuth child={Payment} auth={true} admin={false}/>} />
        <Route path="/success" element={<RequireAuth child={Success} auth={true} admin={false}/>} />
        <Route path="/admin" element={<RequireAuth child={Admin} auth={true} admin={true}/>} />
        <Route path="/addProduct" element={<RequireAuth child={AddProduct} auth={true} admin={true}/>} />
        <Route path="/editProduct/:id" element={<RequireAuth child={EditProduct} auth={true} admin={true}/>} />
        <Route path="/orderDetail/:id" element={<RequireAuth child={OrderDetail} auth={true} admin={true}/>} />
        <Route path="/story" element={<Story/>} />
        <Route path="/contact" element={<Contact/>} />
       <Route path="/localisation" element={<Localisation/>} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
