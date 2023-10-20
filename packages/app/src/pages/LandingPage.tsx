import { Link } from "react-router-dom"

const LandingPage = () => {
    return (
            <div className="flex flex-col justify-center items-center h-full">
                    <h1 className="font-bold">Mirage AI Productions</h1>
                    <Link to="/login" className="button mt-5">Login</Link>
            </div>
            

    )
}

export default LandingPage