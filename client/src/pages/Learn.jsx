import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Play, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { allSkillsList } from '../data/skills';
import api from '../api/axios';
import axios from 'axios';

// In-memory cache to persist data across component remounts within the same session
const videoCache = {};

const Learn = () => {
  const { profile } = useAuth();
  const [missingSkills, setMissingSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  useEffect(() => {
    if (profile && profile.skills) {
      // Find skills in allSkillsList that are NOT in user profile
      const userSkillsLower = profile.skills.map(s => s.toLowerCase());
      const missing = allSkillsList.filter(skill => !userSkillsLower.includes(skill.toLowerCase()));
      setMissingSkills(missing);
    }
  }, [profile]);

  const fetchVideos = async (skill) => {
    // 1. Prevent duplicate API calls if the skill is already selected
    if (selectedSkill === skill && videos.length > 0) return;
    
    setSelectedSkill(skill);
    setError(null);

    // 2. Check in-memory cache
    if (videoCache[skill]) {
      setVideos(videoCache[skill]);
      setLoading(false);
      return;
    }

    // 3. Check sessionStorage persistence
    const savedVideos = sessionStorage.getItem(`videos_${skill}`);
    if (savedVideos) {
      const parsed = JSON.parse(savedVideos);
      videoCache[skill] = parsed;
      setVideos(parsed);
      setLoading(false);
      return;
    }

    if (!YOUTUBE_API_KEY) {
      setError("YouTube API key is missing. Please ensure VITE_YOUTUBE_API_KEY is set in your .env file and restart your server.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 6,
          q: `${skill} tutorial`,
          type: 'video',
          key: YOUTUBE_API_KEY
        }
      });

      const fetchedVideos = response.data.items;
      
      // 4. Update memory cache and sessionStorage
      videoCache[skill] = fetchedVideos;
      sessionStorage.setItem(`videos_${skill}`, JSON.stringify(fetchedVideos));
      
      setVideos(fetchedVideos);
    } catch (err) {
      console.error("YouTube Fetch Error:", err);
      
      // Handle quota limit errors (403 Forbidden)
      if (err.response && err.response.status === 403) {
        setError("YouTube API quota exceeded. Please try again tomorrow or use another API key.");
      } else {
        setError("Failed to fetch tutorials. Please ensure your API key is valid and has search permissions.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = missingSkills.filter(skill => 
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-widest text-primary uppercase mb-1">Skill Elevation Center</p>
              <h1 className="text-4xl font-black tracking-tighter text-white">Growth Hub</h1>
            </div>
          </div>
          <p className="text-secondary text-lg mt-2 max-w-2xl">
            Identify your skill gaps and master high-demand capabilities with curated expert tutorials.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="flex gap-4">
          <div className="glass-card px-6 py-4 border border-white/5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Gaps Detected</p>
              <p className="text-2xl font-black text-white">{missingSkills.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Skill List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Filter gaps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div className="glass-card p-2 border border-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
            <div className="p-4 border-b border-white/5 mb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary">Priority Gaps</h3>
            </div>
            {filteredSkills.length > 0 ? filteredSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => fetchVideos(skill)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${selectedSkill === skill ? 'bg-primary/20 text-primary border border-primary/20' : 'hover:bg-white/5 text-secondary border border-transparent'}`}
              >
                <span className="font-bold tracking-tight">{skill}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedSkill === skill ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            )) : (
              <div className="p-8 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-white/10 mx-auto" />
                <p className="text-xs text-white/30 italic">No matching gaps found</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content: Video Display */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {!selectedSkill ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 glass-card border-2 border-dashed border-white/5"
              >
                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-primary/40" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Start Your Growth Journey</h3>
                <p className="text-secondary max-w-sm">Select a missing skill from the sidebar to instantly discover high-quality learning resources.</p>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center py-24 space-y-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
                  <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
                  <BookOpen className="w-8 h-8 text-primary absolute inset-0 m-auto" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tighter">Curating Resources...</h3>
                  <p className="text-secondary text-sm">Finding top-rated {selectedSkill} tutorials</p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 glass-card border-error/20 bg-error/5 flex items-start gap-4"
              >
                <AlertCircle className="w-6 h-6 text-error shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Fetch Interrupted</h4>
                  <p className="text-secondary text-sm leading-relaxed">{error}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="videos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded border border-primary/20">Video Gallery</span>
                    <h2 className="text-2xl font-black text-white tracking-tighter">{selectedSkill} Mastery</h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span>Top Rated Tutorials</span>
                  </div>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((video) => (
                    <div key={video.id.videoId} className="glass-card border border-white/5 overflow-hidden group">
                      {/* Video Embed */}
                      <div className="relative aspect-video">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${video.id.videoId}`}
                          title={video.snippet.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      
                      {/* Video Info */}
                      <div className="p-4">
                        <h4 className="font-bold text-white text-sm line-clamp-2 leading-snug mb-3 min-h-[40px]">
                          {video.snippet.title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")}
                        </h4>
                        <div className="flex items-center justify-between items-center text-[10px] text-secondary font-medium border-t border-white/5 pt-3">
                          <span className="truncate max-w-[150px]">{video.snippet.channelTitle}</span>
                          <a 
                            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors uppercase tracking-widest font-black"
                          >
                            Watch On YouTube
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Learn;
