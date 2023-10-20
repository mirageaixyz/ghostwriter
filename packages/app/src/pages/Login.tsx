import { Link } from "react-router-dom"

const Login = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-3">

            <h1 className="font-bold">Login</h1>

            <div className="flex flex-col">
                <label>Email</label>
                <input></input>
            </div>
            
            <div className="flex flex-col">
                <label>Password</label>
                <input></input>
            </div>
            

            <Link className="button" to="/create">Login</Link>
        </div>
    )
}

export default Login