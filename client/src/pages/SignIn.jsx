import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInSuccess } from '../redux/user/userSlice.js'
import { useDispatch } from "react-redux";


export default function SignIn() {
    const [errorMessage, setErrorMessage] = useState('')
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = async (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value.trim(),
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!formData.email || !formData.userId || !formData.password) {
            setErrorMessage("Please fill out all required fields");
            return;
        }

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                // Handle error response
                setErrorMessage(data.message || 'Login failed')
                return
            }

            // Successful login
            console.log('Login successful', data)
            dispatch(signInSuccess({
                userId: formData.userId,
                email: formData.email,
                password: formData.password
            }))
            // Redirect or update app state
            navigate('/') // Adjust the route as needed
        } catch (err) {
            console.error('Login error:', err)
            setErrorMessage('An error occurred during login')
        }
    }

    return (
        <>
            <section className="animate__animated animate__fadeIn bg-gray-700">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-gray-800 rounded-lg shadow border-gray-700 md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                                Sign In to your account
                            </h1>
                            {errorMessage && (
                                <div className="text-red-400 text-sm mb-4">
                                    {errorMessage}
                                </div>
                            )}
                            <form
                                className="space-y-4 md:space-y-6"
                                onSubmit={handleSubmit}
                            >
                                <div>
                                    <label
                                        htmlFor="userId"
                                        className="block mb-2 text-md font-bold text-gray-200"
                                    >
                                        Your UserId
                                    </label>
                                    <input
                                        type="text"
                                        name="userId"
                                        id="userId"
                                        value={formData.userId}
                                        onChange={handleChange}
                                        className="
                                bg-gray-700 
                                border 
                                border-gray-600 
                                text-white 
                                rounded-lg 
                                focus:ring-lime-500 
                                focus:border-lime-500 
                                block 
                                w-full 
                                p-2.5 
                                placeholder-gray-400
                            "
                                        placeholder="userId"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-md font-semibold text-gray-200"
                                    >
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="
                                bg-gray-700 
                                border 
                                border-gray-600 
                                text-white 
                                rounded-lg 
                                focus:ring-lime-500 
                                focus:border-lime-500 
                                block 
                                w-full 
                                p-2.5 
                                placeholder-gray-400
                            "
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-md font-semibold text-gray-200"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="
                                bg-gray-700 
                                border 
                                border-gray-600 
                                text-white 
                                rounded-lg 
                                focus:ring-lime-500 
                                focus:border-lime-500 
                                block 
                                w-full 
                                p-2.5 
                                placeholder-gray-400
                            "
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-center">
                                    <a
                                        href="#"
                                        className="text-md font-semibold text-lime-400 hover:text-lime-300 hover:underline"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <button
                                    type="submit"
                                    className="
                            w-full 
                            text-gray-900 
                            bg-lime-400 
                            hover:bg-lime-500 
                            focus:ring-4 
                            focus:outline-none 
                            focus:ring-lime-300 
                            font-semibold 
                            rounded-lg 
                            text-xl 
                            px-5 
                            py-2.5 
                            text-center 
                            transition-colors 
                            duration-300
                        "
                                >
                                    Sign in
                                </button>
                                <p className="text-md font-medium text-gray-400">
                                    Don't have an account yet?
                                    <a
                                        href="/signup"
                                        className="font-semibold text-lime-400 hover:text-lime-300 hover:underline ml-2"
                                    >
                                        Sign Up
                                    </a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
