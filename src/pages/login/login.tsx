import Raact, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';


import logo from '../../assets/logo.svg'; 

import { api } from '../../services/api';

const Login = () => {
    const navigate = useNavigate()

    const [loginSuccess, setLoginSuccess] = useState(false);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        
        if (token) {
            api.setToken(token);


            window.history.replaceState({}, document.title, '/');
            setLoginSuccess(true);
        }
    }, []);



    const handleInstitutionalLogin = async () => {
        try {
            // console.log('Iniciando redirecionamento para login da Microsoft (Azure AD)...');
            // window.location.href = 'https://api.salafacil.com/auth/microsoft';
            const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
            window.location.href = `${backendUrl}/Auth/login`;
            
        } catch (error) {
            console.log('Erro ao iniciar login institucional:', error);
        }
    };
    const handleEnterRoom = () => {
        navigate('/baseJhon', { replace: true });
    };

    
    return (
        // Container principal: Ocupa a tela toda, fundo vermelho Fatec e centraliza o conteúdo a
        <div className="min-h-screen w-full bg-[#B20000] flex items-center justify-center p-6 overflow-hidden">
            
            {/* Wrapper responsivo: flex-col no mobile (empilhado) e flex-row no desktop (lado a lado) */}
            <div className="flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-[105px] w-full max-w-[1600px]">
                
                {/* 1. Lado Esquerdo (Logo) */}
                <div className="flex justify-center xl:justify-end w-full xl:w-1/2">
                    <img 
                        src={logo} 
                        alt="Logo do SalaFácil" 
                        className="w-full max-w-[320px] md:max-w-[420px] xl:max-w-[521px] object-contain"
                    />
                </div>

                {/* 2. Linhas Divisórias */}
                {/* Desktop: Linha vertical */}
                <div className="hidden xl:block w-[1px] h-[60vh] min-h-[400px] max-h-[876px] bg-white opacity-60"></div>
                {/* Mobile: Linha horizontal */}
                <div className="block xl:hidden w-full max-w-[300px] h-[1px] bg-white opacity-60"></div>

                {/* 3. Lado Direito (Texto e Botão) */}
                <div className="flex flex-col items-center xl:items-start w-full xl:w-1/2">
                    
                    {/* Títulos */}
                    {loginSuccess ? (
                        <>
                            <div className="text-center xl:text-left text-white mb-10 xl:mb-[50px] font-['Roboto_Slab',serif]">
                                <h2 className="text-3xl md:text-4xl xl:text-[48px] xl:leading-[63px] tracking-[-0.02em] font-normal">
                                    Login realizado!
                                </h2>
                                <p className="text-xl mt-4 opacity-90 text-white font-['Roboto_Slab',serif]">
                                    Você já pode acessar o sistema.
                                </p>
                            </div>
                            
                            {/* ESTE É O CLIQUE QUE SALVA O ÁUDIO */}
                            <button 
                                onClick={handleEnterRoom}
                                className="flex items-center justify-center bg-green-600 text-white font-semibold font-['Inter',sans-serif] text-sm md:text-lg xl:text-[27.66px] xl:leading-[33px] tracking-[-0.02em] whitespace-nowrap px-8 xl:w-[530px] h-[48px] xl:h-[52.25px] rounded-md shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:bg-green-500 active:scale-95"
                            >
                                Iniciar SalaFácil
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Títulos originais */}
                            <div className="text-center xl:text-left text-white mb-10 xl:mb-[50px] font-['Roboto_Slab',serif]">
                                <h2 className="text-3xl md:text-4xl xl:text-[48px] xl:leading-[63px] tracking-[-0.02em] font-normal">
                                    Bem vindo(a)
                                </h2>
                                <h2 className="text-3xl md:text-4xl xl:text-[48px] xl:leading-[63px] tracking-[-0.02em] font-normal">
                                    ao SalaFácil!
                                </h2>
                            </div>
                    
                {/* Botão Institucional */}
                    <button 
                        onClick={handleInstitutionalLogin}
                        className="
                            flex items-center justify-center 
                            bg-white text-[#B20000] font-semibold font-['Inter',sans-serif] 
                            text-sm md:text-lg xl:text-[27.66px] xl:leading-[33px] tracking-[-0.02em]
                            whitespace-nowrap
                            px-8 xl:w-[530px] 
                            h-[48px] xl:h-[52.25px] 
                            rounded-md shadow-lg
                            transition-all duration-200 ease-in-out
                            hover:scale-105 hover:bg-gray-100 active:scale-95
                        "
                    >
                        Entrar com e-mail institucional
                    </button>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
