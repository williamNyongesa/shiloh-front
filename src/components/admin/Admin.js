import Sidebar from "./Sidebar";
import Header from './Header'

const Admin = () => {
    return ( 
        <div className="bg-white">
            <div className='mt-10 bg-white'>
                <Header />
                <Sidebar />
             </div>
        </div>
     );
}
 
export default Admin;