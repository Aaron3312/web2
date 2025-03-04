import { Cast } from '../../../types/movieTypes';

interface CastTabProps {
    cast: Cast[];
}

const CastTab: React.FC<CastTabProps> = ({ cast }) => {
    return (
        <div>
            {cast.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {cast.map(person => (
                        <div key={person.id} className="bg-gray-900 rounded-lg overflow-hidden">
                            <div className="aspect-[2/3] bg-gray-800">
                                {person.profile_path ? (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                                        alt={person.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <h4 className="font-medium truncate">{person.name}</h4>
                                <p className="text-sm text-gray-400 truncate">{person.character}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No hay información de reparto disponible.</p>
            )}
        </div>
    );
};

export default CastTab;