// MovieCard.tsx
import { useNavigate } from 'react-router-dom';

interface MovieProps {
    id: number;  // Add this
    title: string;
    poster: string;
    rating: number;
}

export default function MovieCard({ id, title, poster, rating }: MovieProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${id}`);
    };

    return (
        <div
            className="p-4 bg-gray-900 text-white rounded-lg cursor-pointer transform transition hover:scale-105"
            onClick={handleClick}
        >
            <img src={poster} alt={title} className="w-full rounded"/>
            <h3 className="text-lg font-bold mt-2">{title}</h3>
            <p>⭐ {rating}</p>
        </div>
    );
}