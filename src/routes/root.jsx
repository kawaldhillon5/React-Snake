import { FaGithub } from 'react-icons/fa'
import '../css/root.css'
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import HomePage from '../components/homepage'

export default function Root(){
    const navigate = useNavigate()
    return (
        <>
            <div id="root-header">
                <h2 onClick={()=>{navigate('/')}}>Snake</h2>
                <Link to={'/about'}>About</Link>
            </div>
            <div id="root-content">
                <Outlet></Outlet>
            </div>
            <div id="root-footer">
                <FaGithub/>
                <a href="https://github.com/kawaldhillon5" target="_blank" >Kawal dhillon</a>
            </div>
        </>
    )
}