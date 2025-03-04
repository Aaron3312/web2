import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Review } from '../../context/ReviewsContext';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';

interface MovieReviewsProps {
    movieId: number;
    getMovieReviews: (movieId: number) => Promise<Review[]>;
    getUserReviewForMovie: (movieId: number) => Promise<Review | null>;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ 
    movieId, 
    getMovieReviews,
    getUserReviewForMovie
}) => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Fetch reviews when the component mounts or when the reviews are updated
    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            try {
                const movieReviews = await getMovieReviews(movieId);
                setReviews(movieReviews);
                
                if (user) {
                    const userReview = await getUserReviewForMovie(movieId);
                    setUserReview(userReview);
                    
                    // Show form automatically if user has no review
                    if (!userReview) {
                        setShowReviewForm(true);
                    }
                }
            } catch (err) {
                console.error('Error fetching reviews:', err);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchReviews();
    }, [movieId, user, getMovieReviews, getUserReviewForMovie]);

    // Function to refresh reviews after adding/updating/deleting
    const refreshReviews = async () => {
        try {
            const movieReviews = await getMovieReviews(movieId);
            setReviews(movieReviews);
            
            if (user) {
                const userReview = await getUserReviewForMovie(movieId);
                setUserReview(userReview);
            }
        } catch (err) {
            console.error('Error refreshing reviews:', err);
        }
    };

    // Toggle review form
    const toggleReviewForm = () => {
        setShowReviewForm(prev => !prev);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Reseñas de usuarios</h3>
                {user && userReview && (
                    <button 
                        onClick={toggleReviewForm}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                        {showReviewForm ? 'Cancelar' : 'Editar mi reseña'}
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Review Form */}
                    {user && showReviewForm && (
                        <ReviewForm 
                            movieId={movieId}
                            userReview={userReview}
                            onReviewSubmitted={() => {
                                refreshReviews();
                                setShowReviewForm(false);
                            }}
                        />
                    )}

                    {/* Reviews List */}
                    <ReviewsList 
                        reviews={reviews}
                        userReview={userReview}
                        onReviewDeleted={refreshReviews}
                        onEditClick={() => setShowReviewForm(true)}
                    />
                    
                    {/* No reviews message */}
                    {reviews.length === 0 && !showReviewForm && (
                        <div className="bg-gray-900 rounded-lg p-8 text-center">
                            <p className="text-gray-400 mb-4">No hay reseñas para esta película todavía.</p>
                            {user && (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    Sé el primero en dejar una reseña
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MovieReviews;