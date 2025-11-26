import { useState } from "react"
import Button from "../components/Button"
import Input from "../components/Input"
import { api } from "../api/api"
import { Link, useNavigate } from "react-router-dom"
import { useUserStore } from "../store/useUserStore"
import "./SignUp.css"


const SignUp = () =>{
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { setSession } = useUserStore()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setError("")

        if (e.target.password.value !== e.target.password2.value){
            setError("Пароли не совпадают")
            return
        }

        const user = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        try {
            const data = await api.registerUser(user)
            setSession(data.data)
            navigate("/")
        } catch (error) {
            setError(error.response.data.error)
            console.error(error)
        }
    }   
    return(
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">Регистрация</h1>
                {error.length > 0 && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                        <Input 
                        id="username"
                        name="username"
                        type="text"
                        label="Имя пользователя"
                        required
                        placeholder="Введите имя пользователя"
                        />
                        <Input 
                        id="email"
                        name="email"
                        type="email"
                        label="Почта"
                        required
                        placeholder="Введите почту"
                        />
                        <Input 
                        id="password"
                        name="password"
                        type="password"
                        label="Пароль"
                        required
                        placeholder="Введите пароль"
                        />
                        <Input 
                        id="password2"
                        name="password2"
                        type="password"
                        label="Подтвердите пароль"
                        required
                        placeholder="Подтвердите пароль"
                        />

                    <Button>Зарегистрироваться</Button>
                </form>
                <div className="auth-footer">
                    <p>
                        <Link to={"/SignIn"}>Вход</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
