import React, { useState, useEffect } from 'react';
import { useReviews, Review } from '../context/ReviewsContext';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface MovieReviewsProps {
    movieId: number;
}

export default function MovieReviews({ movieId }: MovieReviewsProps) {
    const { user } = useContext(AuthContext);
    const { 
        addReview, 
        updateReview, 
        deleteReview, 
        getMovieReviews, 
        getUserReviewForMovie, 
        isLoading, 
        error 
    } = useReviews();
    
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    
    // Cargar todas las reseñas de la película y la reseña del usuario actual
    const loadReviews = async () => {
        try {
            const movieReviews = await getMovieReviews(movieId);
            setReviews(movieReviews);
            
            if (user) {
                const currentUserReview = await getUserReviewForMovie(movieId);
                setUserReview(currentUserReview);
                
                if (currentUserReview) {
                    setRating(currentUserReview.rating);
                    setComment(currentUserReview.comment);
                }
            }
        } catch (err) {
            console.error("Error al cargar reseñas:", err);
        }
    };
    
    // Cargar reseñas al montar el componente o cuando cambia el id de la película
    useEffect(() => {
        loadReviews();
    }, [movieId, user]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (isEditing && userReview?.id) {
                await updateReview(userReview.id, rating, comment);
            } else {
                await addReview(movieId, rating, comment);
            }
            
            setIsFormVisible(false);
            setIsEditing(false);
            loadReviews();
        } catch (err) {
            console.error("Error al enviar la reseña:", err);
        }
    };
    
    const handleDelete = async () => {
        if (!userReview?.id) return;
        
        if (window.confirm("¿Estás seguro de que deseas eliminar tu reseña?")) {
            try {
                await deleteReview(userReview.id);
                setUserReview(null);
                loadReviews();
            } catch (err) {
                console.error("Error al eliminar la reseña:", err);
            }
        }
    };
    
    const handleEdit = () => {
        if (userReview) {
            setRating(userReview.rating);
            setComment(userReview.comment);
            setIsEditing(true);
            setIsFormVisible(true);
        }
    };
    
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className={`text-2xl ${index < rating ? 'text-yellow-500' : 'text-gray-500'}`}>
                ★
            </span>
        ));
    };
    
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };
    
    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Reseñas de usuarios</h2>
            
            {/* Mensaje de error */}
            {error && (
                <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}
            
            {/* Botón para añadir reseña (solo para usuarios autenticados y que no tengan ya una reseña) */}
            {user ? (
                !userReview && !isFormVisible ? (
                    <button
                        onClick={() => setIsFormVisible(true)}
                        className="mb-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        Escribir una reseña
                    </button>
                ) : null
            ) : (
                <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-300">
                        Para escribir una reseña, debes{' '}
                        <Link to="/login" className="text-red-600 hover:underline">
                            iniciar sesión
                        </Link>
                        .
                    </p>
                </div>
            )}
            
            {/* Formulario para añadir/editar reseña */}
            {isFormVisible && (
                <form onSubmit={handleSubmit} className="mb-8 bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-medium mb-4">
                        {isEditing ? 'Editar tu reseña' : 'Añadir una reseña'}
                    </h3>
                    
                    <div className="mb-4">
                        <label className="block mb-2">Puntuación</label>
                        <div className="flex space-x-2">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setRating(index + 1)}
                                    className="text-3xl focus:outline-none"
                                >
                                    <span className={index < rating ? 'text-yellow-500' : 'text-gray-500'}>
                                        ★
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="comment" className="block mb-2">
                            Comentario
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-lg text-white"
                            rows={4}
                            required
                        />
                    </div>
                    
                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Enviando...' : isEditing ? 'Actualizar' : 'Publicar'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => {
                                setIsFormVisible(false);
                                setIsEditing(false);
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
            
            {/* Reseña del usuario actual */}
            {userReview && !isFormVisible && (
                <div className="mb-8 bg-gray-800 p-4 rounded-lg border border-red-600">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className="text-lg font-medium">Tu reseña</h4>
                            <div className="flex my-1">
                                {renderStars(userReview.rating)}
                            </div>
                            <p className="text-sm text-gray-400">
                                {formatDate(userReview.createdAt)}
                            </p>
                        </div>
                        
                        <div className="flex space-x-2">
                            <button
                                onClick={handleEdit}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-sm transition-colors"
                            >
                                Editar
                            </button>
                            
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-gray-300">{userReview.comment}</p>
                </div>
            )}
            
            {/* Lista de reseñas de otros usuarios */}
            {isLoading && reviews.length === 0 ? (
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                    <p className="mt-2 text-gray-400">Cargando reseñas...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-10 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No hay reseñas para esta película aún.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews
                        .filter(review => !user || review.userId !== user.uid)
                        .map(review => (
                            <div key={review.id} className="bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="text-lg font-medium">{review.userEmail}</h4>
                                        <div className="flex my-1">
                                            {renderStars(review.rating)}
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            {formatDate(review.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                
                                <p className="text-gray-300">{review.comment}</p>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}