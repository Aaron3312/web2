import { MovieDetail } from '../../../types/movieTypes';

interface OverviewTabProps {
    movie: MovieDetail;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ movie }) => {
    return (
        <div>
            <p className="text-gray-300 leading-relaxed text-lg">
                {movie.overview || 'No hay sinopsis disponible para esta película.'}
            </p>
            
            {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-3">Productoras</h3>
                    <div className="flex flex-wrap gap-6">
                        {movie.production_companies.map(company => (
                            <div key={company.name} className="text-center">
                                {company.logo_path ? (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                        alt={company.name}
                                        className="h-10 object-contain bg-gray-900 rounded p-1"
                                    />
                                ) : (
                                    <div className="h-10 bg-gray-900 rounded p-2 flex items-center justify-center">
                                        <span>{company.name}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverviewTab;