import { Link } from "react-router-dom"

const Login = () => {
    return (
        <>
            <div>
                <h1>Login</h1>
                <label>Email</label>
                <input></input>

                <label>Password</label>
                <input></input>
            </div>

            <Link to="/">Back</Link>
        </>
    )
}

export default Login