import React from 'react';
import { TrendingUp, Star, Award, Gift, Check, Clock, ChevronRight } from 'lucide-react';

const HowItWorksPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <Hero />
      <ProcessSteps />
      <PointsCalculator />
      <FAQ />
      <CallToAction />
      <Footer />
    </div>
  );
};

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-32 h-10 bg-[#054394] text-white font-bold flex items-center justify-center rounded">
            LALA
          </div>
          <nav className="ml-8 hidden md:block">
            <ul className="flex space-x-6">
              <li><a href="#" className="text-gray-700 hover:text-[#054394]">Inicio</a></li>
              <li><a href="#" className="text-gray-700 hover:text-[#054394] font-medium">Cómo Funciona</a></li>
              <li><a href="#" className="text-gray-700 hover:text-[#054394]">Premios</a></li>
              <li><a href="#" className="text-gray-700 hover:text-[#054394]">Niveles</a></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200">
            Iniciar Sesión
          </button>
          <button className="bg-[#e60e16] px-4 py-2 rounded-lg text-white hover:bg-red-700">
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
};

const Hero = () => {
  return (
    <div className="bg-[#054394] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">¿Cómo Funciona el Programa de Fidelidad LALA?</h1>
          <p className="text-xl mb-8">
            Descubre cómo nuestro programa de lealtad te permite convertir tus ventas en increíbles recompensas y beneficios exclusivos para tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <button className="bg-[#e60e16] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 border border-blue-500">
            Ver Tutorial en Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessSteps = () => {
  const steps = [

    {
      icon: <Star className="w-12 h-12 text-[#054394]" />,
      title: 'Acumula puntos',
      description: 'Por cada producto registrado, obtendrás puntos según la categoría y el volumen. Los productos premium y promociones especiales te dan puntos adicionales.'
    },
    {
      icon: <Award className="w-12 h-12 text-[#054394]" />,
      title: 'Sube de nivel',
      description: 'A medida que acumules puntos, podrás subir de nivel desde Bronce hasta Platino, desbloqueando mejores beneficios, multiplicadores y recompensas exclusivas.'
    },
    {
      icon: <Gift className="w-12 h-12 text-[#054394]" />,
      title: 'Canjea premios',
      description: 'Utiliza tus puntos para canjear increíbles premios de nuestro catálogo, desde equipamiento para tu negocio hasta viajes y capacitaciones exclusivas.'
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">El Proceso en 3 Simples Pasos</h2>
      
      <div className="relative">
        <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-blue-200 -z-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-md">
                {step.icon}
              </div>
              <div className="w-8 h-8 bg-[#e60e16] text-white rounded-full flex items-center justify-center font-bold absolute top-8 right-1/2 transform translate-x-12 lg:translate-x-16">
                {index + 1}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PointsCalculator = () => {
  const products = [
    { name: 'Leche Entera 1L', points: 5 },
    { name: 'Yogurt Natural 1Kg', points: 8 },
    { name: 'Queso Fresco 400g', points: 10 },
    { name: 'Crema 1L', points: 12 }
  ];
  
  return (
    <div className="bg-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Cómo se Calculan los Puntos?</h2>
              <p className="text-gray-700 mb-6">
                Cada producto LALA tiene un valor en puntos específico. A continuación te mostramos algunos ejemplos:
              </p>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-4">
                  {products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-800">{product.name}</span>
                      <div className="flex items-center bg-blue-100 px-3 py-1 rounded-lg">
                        <span className="text-[#054394] font-bold">{product.points}</span>
                        <span className="text-[#054394] ml-1">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Multiplicador Nivel Oro</span>
                    <span className="font-bold text-[#e60e16]">x1.5</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <a href="#" className="text-[#054394] font-medium flex items-center hover:text-blue-700">
                  Ver lista completa de productos y puntos
                  <ChevronRight className="w-5 h-5 ml-1" />
                </a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Calculadora de Puntos</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Selecciona tu Nivel</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#054394]">
                    <option>Bronce (x1.0)</option>
                    <option>Plata (x1.2)</option>
                    <option selected>Oro (x1.5)</option>
                    <option>Platino (x2.0)</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 mb-2 font-medium">Producto</label>
                      <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#054394]">
                        <option>Leche Entera 1L</option>
                        <option>Yogurt Natural 1Kg</option>
                      </select>
                    </div>
                    <div className="w-24">
                      <label className="block text-gray-700 mb-2 font-medium">Cantidad</label>
                      <input type="number" defaultValue="10" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#054394]" />
                    </div>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Puntos base:</span>
                    <span className="font-medium">50 pts</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Multiplicador Oro:</span>
                    <span className="font-medium">x1.5</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="font-bold text-gray-900">Total de puntos:</span>
                    <span className="font-bold text-[#e60e16] text-xl">75 pts</span>
                  </div>
                </div>
                <button className="w-full bg-[#e60e16] text-white py-3 rounded-lg font-medium hover:bg-red-700">
                  Registrar Esta Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "¿Cómo registro mis ventas en el sistema?",
      answer: "Puedes registrar tus ventas a través de nuestra aplicación móvil escaneando los códigos de barras de los productos, o mediante nuestro portal web ingresando los datos manualmente o subiendo tu archivo de ventas."
    },
    {
      question: "¿Cuánto tiempo tengo para canjear mis puntos?",
      answer: "Los puntos tienen una vigencia de 12 meses desde su acumulación. Te notificaremos cuando tus puntos estén próximos a vencer para que puedas aprovecharlos."
    },
    {
      question: "¿Cómo recibo mis premios?",
      answer: "Una vez canjeado el premio, nuestro equipo se pondrá en contacto contigo en un plazo máximo de 48 horas para coordinar la entrega según la disponibilidad y tu ubicación."
    },
    {
      question: "¿Puedo transferir mis puntos a otro socio comercial?",
      answer: "Actualmente no es posible transferir puntos entre cuentas de socios comerciales, pero estamos trabajando en implementar esta función en el futuro."
    },
    {
      question: "¿Qué sucede si pierdo mi nivel por falta de actividad?",
      answer: "Si no mantienes el volumen mínimo de ventas requerido para tu nivel durante 3 meses consecutivos, bajarás al nivel anterior. Sin embargo, tus puntos acumulados no se perderán."
    },
    {
      question: "¿Hay un límite de puntos que puedo acumular?",
      answer: "No hay límite en la cantidad de puntos que puedes acumular. Mientras más vendes, más puntos obtienes y mejores premios puedes canjear."
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Preguntas Frecuentes</h2>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-gray-900 mb-3 flex items-start">
              <span className="bg-blue-100 text-[#054394] w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                ?
              </span>
              {faq.question}
            </h3>
            <p className="text-gray-700 ml-11">{faq.answer}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <a href="#" className="inline-flex items-center text-[#054394] font-medium hover:text-blue-700">
          Ver todas las preguntas frecuentes
          <ChevronRight className="w-5 h-5 ml-1" />
        </a>
      </div>
    </div>
  );
};

const CallToAction = () => {
  return (
    <div className="bg-[#054394] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para empezar a ganar puntos?</h2>
          <p className="text-xl mb-8">
            Únete a más de 5,000 socios comerciales que ya están aprovechando los beneficios del Programa de Fidelidad LALA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#054394] px-8 py-4 rounded-lg font-medium hover:bg-blue-50">
              Conocer Más
            </button>
            <button className="bg-[#e60e16] text-white px-8 py-4 rounded-lg font-medium hover:bg-red-700 border border-blue-500">
              Registrarme Ahora
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <Clock className="w-5 h-5 mr-2" />
            <span className="text-blue-100">Registro completado en menos de 5 minutos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="w-32 h-10 bg-white text-[#054394] font-bold flex items-center justify-center rounded mb-4">
              LALA
            </div>
            <p className="text-gray-400 mb-4">
              Programa de Fidelidad exclusivo para socios comerciales de LALA.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">F</div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">I</div>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">T</div>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Programa</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Cómo Funciona</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Niveles de Membresía</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Catálogo de Premios</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Términos y Condiciones</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Centro de Ayuda</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contacto</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Preguntas Frecuentes</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Reportar Problema</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">📍</span>
                <span className="text-gray-400">Av. Lázaro Cárdenas 2321, Torre A, Piso 15, Col. Valle Oriente, San Pedro Garza García, NL 66269</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">✉️</span>
                <span className="text-gray-400">
                  <a href="mailto:info@lala.com">info@lala.com</a>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2023 LALA. Todos los derechos reservados.
          </p>
          <p className="text-gray-400 text-sm">
            Este programa es exclusivo para socios comerciales de LALA. Sujeto a términos y condiciones.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default HowItWorksPage;