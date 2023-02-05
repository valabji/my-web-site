import { Outlet } from "react-router-dom";
import NavBar from './components/navbar';

export default function Page() {
    return (
        <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
            <NavBar />
            <Outlet />
        </div>
    )
}