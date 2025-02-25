// MovieCard.tsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface MovieProps {
    id: number;
    title: string;
    poster: string;
    rating: number;
}

export default function MovieCard({ id, title, poster, rating }: MovieProps) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        navigate(`/movie/${id}`);
    };

    // Fallback poster en caso de error
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image+Available';
    };

    // Formatear el rating a un decimal
    const formattedRating = Number(rating).toFixed(1);

    // Determinar el color del rating basado en su valor
    const getRatingColor = () => {
        if (rating >= 8) return 'bg-green-600';
        if (rating >= 6) return 'bg-yellow-600';
        return 'bg-red-600';
    };

    return (
        <div
            className="relative overflow-hidden bg-gray-900 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            {/* Efecto de overlay al pasar el mouse */}
            <div 
                className={`absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 transform transition-opacity duration-300 z-10 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <div className="text-white">
                    <h3 className="text-xl font-bold mb-1">{title}</h3>
                    <button 
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full transition-colors"
                    >
                        Ver detalles
                    </button>
                </div>
            </div>
            
            {/* Badge de rating */}
            <div className={`absolute top-2 right-2 ${getRatingColor()} text-white text-sm font-bold rounded-full h-9 w-9 flex items-center justify-center z-20 shadow-md`}>
                {formattedRating}
            </div>
            
            {/* Poster */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <img 
                    src={poster} 
                    alt={title} 
                    className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
                    onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
            </div>
            
            {/* Info visible siempre */}
            <div className="p-3">
                <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
                <div className="flex items-center text-yellow-400">
                    <span className="mr-1">⭐</span>
                    <span className="text-sm text-gray-300">{formattedRating}</span>
                </div>
            </div>
        </div>
    );
}