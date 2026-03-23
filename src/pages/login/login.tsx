import React from 'react';
import logo from '../../assets/logo.svg';

const Login = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#B20000]">
            <div className="flex flex-row items-center gap-12">
                {/* 1. Logo */}
                <img src={logo} alt="Logo do SalaFácil" className="w-[450px]"/>

                {/* 2. Linha Divisória (vazia por dentro) */}
                <div className="w-[2px] h-64 bg-white/30"></div>

                {/* 3. Lado Direito (Texto e Futuro Botão) */}
                <div className="flex flex-col text-white">
                    <h2 className="text-4xl font-serif">Bem vindo(a)</h2>
                    <h2 className="text-4xl font-serif mb-6">ao SalaFácil!</h2>
                    
                    {/* Aqui entrará o botão de login institucional */}
                    <button className="bg-white text-[#B20000] px-6 py-2 font-bold rounded">
                        Entrar com e-mail institucional
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login