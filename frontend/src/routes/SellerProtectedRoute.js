import { useSelector } from "react-redux";
import {Navigate} from "react-router-dom";
import Loader from "../components/Layout/Loader";
const SellerProtectedRoute=({ children})=>{
    // console.log(`this is isSeller from SellerProtecedRoute ${isSeller}`);
    const {isLoading , isSeller}=useSelector((state)=>state.seller);
   if(isLoading===true){
    return (
        <Loader/>
    )}else{
     if(!isSeller){
        return <Navigate to="/shop-login" replace />
    }
    return children
}
   }
export default SellerProtectedRoute