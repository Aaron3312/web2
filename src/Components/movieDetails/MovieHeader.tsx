interface MovieHeaderProps {
    title: string;
    tagline?: string;
    voteAverage: number;
    releaseDate: string;
    runtime: number;
    genres: Array<{ id: number; name: string }>;
}

const MovieHeader: React.FC<MovieHeaderProps> = ({ 
    title, 
    tagline, 
    voteAverage, 
    releaseDate, 
    runtime, 
    genres 
}) => {
    return (
        <>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
            
            {tagline && (
                <p className="text-gray-400 text-xl italic mb-4">{tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center bg-yellow-600 text-white px-3 py-1 rounded-full font-medium">
                    <span className="mr-1">⭐</span>
                    {voteAverage.toFixed(1)}
                </div>
                
                <span className="text-gray-400">•</span>
                
                <span className="text-gray-300">
                    {new Date(releaseDate).getFullYear()}
                </span>
                
                <span className="text-gray-400">•</span>
                
                <span className="text-gray-300">
                    {runtime} min
                </span>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                {genres.map(genre => (
                    <span
                        key={genre.id}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 cursor-pointer rounded-full text-sm"
                    >
                        {genre.name}
                    </span>
                ))}
            </div>
        </>
    );
};

export default MovieHeader;