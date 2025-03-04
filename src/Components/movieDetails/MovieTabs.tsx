import React from 'react';
import { MovieDetail, Cast, Video } from '../../types/movieTypes';
import OverviewTab from './tabs/OverviewTab';
import CastTab from './tabs/CastTab';
import VideosTab from './tabs/VideosTab';

interface MovieTabsProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    movie: MovieDetail;
    cast: Cast[];
    videos: Video[];
}

const MovieTabs: React.FC<MovieTabsProps> = ({ 
    activeTab, 
    setActiveTab, 
    movie, 
    cast, 
    videos 
}) => {
    return (
        <>
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-700">
                <div className="flex space-x-6">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`py-3 font-medium relative ${
                            activeTab === 'overview' 
                                ? 'text-white' 
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        Sinopsis
                        {activeTab === 'overview' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
                        )}
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('cast')}
                        className={`py-3 font-medium relative ${
                            activeTab === 'cast' 
                                ? 'text-white' 
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        Reparto
                        {activeTab === 'cast' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
                        )}
                    </button>
                    
                    {videos.length > 0 && (
                        <button 
                            onClick={() => setActiveTab('videos')}
                            className={`py-3 font-medium relative ${
                                activeTab === 'videos' 
                                    ? 'text-white' 
                                    : 'text-gray-400 hover:text-gray-300'
                            }`}
                        >
                            Videos
                            {activeTab === 'videos' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
                            )}
                        </button>
                    )}
                    
                    <button 
                        data-tab="reviews"
                        onClick={() => setActiveTab('reviews')}
                        className={`py-3 font-medium relative ${
                            activeTab === 'reviews' 
                                ? 'text-white' 
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        Reseñas
                        {activeTab === 'reviews' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
                        )}
                    </button>
                </div>
            </div>
            
            {/* Tab content */}
            <div className="min-h-[200px]">
                {/* Overview tab */}
                {activeTab === 'overview' && <OverviewTab movie={movie} />}
                
                {/* Cast tab */}
                {activeTab === 'cast' && <CastTab cast={cast} />}
                
                {/* Videos tab */}
                {activeTab === 'videos' && <VideosTab videos={videos} />}
                
                {/* Reviews tab is handled in the parent component */}
            </div>
        </>
    );
};

export default MovieTabs;