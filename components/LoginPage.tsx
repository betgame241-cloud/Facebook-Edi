
import React, { useState } from 'react';

interface Props {
  onLogin: () => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulamos un delay de red
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[980px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0">
        
        {/* Left Side: Branding */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left -mt-8 lg:mt-0 lg:pr-8">
          <img 
            src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg" 
            alt="Facebook" 
            className="h-[70px] md:h-[106px] -m-5 md:-m-7"
          />
          <h2 className="text-[24px] md:text-[28px] leading-7 md:leading-8 w-auto lg:w-[500px] mt-4 font-normal text-[#1c1e21]">
            Facebook te ayuda a comunicarte y compartir con las personas que forman parte de tu vida.
          </h2>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full max-w-[396px] bg-white rounded-lg shadow-xl p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Correo electrónico o número de teléfono" 
              className="border border-gray-300 rounded-md px-4 py-3.5 text-[17px] focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="border border-gray-300 rounded-md px-4 py-3.5 text-[17px] focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-[20px] rounded-md py-2.5 transition-colors mt-1"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Iniciar sesión'}
            </button>
            
            <a href="#" className="text-[#1877f2] text-sm text-center hover:underline mt-1">
              ¿Has olvidado la contraseña?
            </a>
            
            <div className="border-b border-gray-300 my-3"></div>
            
            <div className="flex justify-center">
              <button 
                type="button"
                className="bg-[#42b72a] hover:bg-[#36a420] text-white font-bold text-[17px] rounded-md px-4 py-3 transition-colors"
              >
                Crear cuenta nueva
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-16 lg:max-w-[980px] w-full text-center lg:text-left text-xs text-gray-500">
        <p className="mb-4"><span className="font-bold text-gray-700">Crea una página</span> para un personaje público, un grupo de música o un negocio.</p>
      </div>
    </div>
  );
};

export default LoginPage;
