import { Track } from '../types';
import { v4 as uuidv4 } from 'uuid';
import useAuthStore from '../store/authStore';

const YOUTUBE_API_KEY = 'AIzaSyBZulyDTZM4f0toglPy_r_95FBSrVu9jBA';
const DEEZER_API_URL = 'https://deezerdevs-deezer.p.rapidapi.com';
const DEEZER_API_KEY = '43ffea0ddamshedd53c7c9178567p17e36djsn0d30fda368f7';

async function searchDeezer(query: string): Promise<Track[]> {
  const response = await fetch(
    `${DEEZER_API_URL}/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
        'x-rapidapi-key': DEEZER_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Deezer API request failed');
  }

  const data = await response.json();
  const user = useAuthStore.getState().user;

  return data.data.map((item: any) => ({
    id: uuidv4(),
    youtubeId: '', // Will be populated when playing
    title: item.title,
    artist: item.artist.name,
    duration: Math.floor(item.duration),
    coverUrl: item.album.cover_big || item.album.cover,
    previewUrl: item.preview,
    addedBy: user?.id || '',
    deezerData: {
      id: item.id,
      artistId: item.artist.id,
      albumId: item.album.id,
    },
  }));
}

async function searchYouTube(query: string): Promise<Track[]> {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
      query
    )}&type=video&videoCategoryId=10&key=${YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'YouTube API request failed');
  }

  const data = await response.json();
  const user = useAuthStore.getState().user;

  return data.items.map((item: any) => ({
    id: uuidv4(),
    youtubeId: item.id.videoId,
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    duration: 0, // YouTube API doesn't provide duration in search results
    coverUrl: item.snippet.thumbnails.high.url,
    previewUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    addedBy: user?.id || '',
  }));
}

export const searchTracks = async (query: string): Promise<Track[]> => {
  try {
    // Search both APIs in parallel
    const [deezerResults, youtubeResults] = await Promise.all([
      searchDeezer(query).catch(err => {
        console.error('Deezer search failed:', err);
        return [];
      }),
      searchYouTube(query).catch(err => {
        console.error('YouTube search failed:', err);
        return [];
      }),
    ]);

    // Combine and deduplicate results
    const combinedResults = [...deezerResults, ...youtubeResults];
    
    // Remove duplicates based on title similarity
    const uniqueResults = combinedResults.reduce((acc: Track[], current) => {
      const isDuplicate = acc.some(
        item => 
          item.title.toLowerCase().includes(current.title.toLowerCase()) ||
          current.title.toLowerCase().includes(item.title.toLowerCase())
      );
      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    }, []);

    return uniqueResults;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};