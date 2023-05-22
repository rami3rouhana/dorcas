import { useNavigate } from 'react-router-dom'

const SideNav = () => {

    let navigate = useNavigate();
    
    return (
        <div className="side-nav">
            <ul>
                <li onClick={()=>navigate('/project')}>Project Page</li>
                <li onClick={()=>navigate('/')}>Punch Page</li>
            </ul>
        </div>
    );
}

export default SideNav;