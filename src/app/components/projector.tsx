interface TvScreenProps {
  imageUrl?: string | null;
}

export default function TvScreen({ imageUrl }: TvScreenProps) {
    return (
      <div className="relative w-80 h-60 bg-gray-900 rounded-lg border-8 border-gray-700 shadow-lg flex items-center justify-center">
        {/* TV Screen (Image) */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Streaming content"
            className="w-full h-full object-cover rounded-sm"
          />
        )}
  
        {/* TV Stand (Optional for realism) */}
        <div className="absolute bottom-[-10px] w-16 h-4 bg-gray-700 rounded-b-lg"></div>
  
        {/* TV Buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        </div>
      </div>
    );
  }
  