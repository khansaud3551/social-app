'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const router = useRouter();

    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Handles changes to the signup form by updating the state of `formData`
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
     */
    /******  9f591982-e944-4619-9d2a-5d05935c08f4  *******/ const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
        });

        if (response.ok) {
            // Handle successful signup (e.g., redirect to login or home page)
            //navigate to /
            router.push('/');
        } else {
            // Handle errors (e.g., user already exists)
            const errorData = await response.json();
            alert(errorData.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username
                <input name='username' type='text' value={formData.username} onChange={handleChange} required />
            </label>
            <label>
                Email
                <input name='email' type='email' value={formData.email} onChange={handleChange} required />
            </label>
            <label>
                Password
                <input name='password' type='password' value={formData.password} onChange={handleChange} required />
            </label>
            <button type='submit'>Sign Up</button>
        </form>
    );
}
