import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, GraduationCap, Briefcase, Heart, Target, Sparkles, 
  Save, Edit3, Plus, X, FileText, Download, Clock, TrendingUp, BookOpen, CheckCircle2
} from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { profile, loading, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (profile) {
      // Parse skills and interests if they come as strings
      const parsedProfile = { ...profile };
      
      if (typeof parsedProfile.skills === 'string') {
        try {
          parsedProfile.skills = JSON.parse(parsedProfile.skills);
        } catch (e) {
          parsedProfile.skills = [];
        }
      }
      
      if (typeof parsedProfile.interests === 'string') {
        try {
          parsedProfile.interests = JSON.parse(parsedProfile.interests);
        } catch (e) {
          parsedProfile.interests = [];
        }
      }
      
      // Ensure they are arrays
      parsedProfile.skills = Array.isArray(parsedProfile.skills) ? parsedProfile.skills : [];
      parsedProfile.interests = Array.isArray(parsedProfile.interests) ? parsedProfile.interests : [];
      
      setFormData(parsedProfile);
    }
  }, [profile]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      // Format data before sending - ensure arrays are actual arrays, not strings
      const formattedData = {
        ...formData,
        skills: typeof formData.skills === 'string' 
          ? JSON.parse(formData.skills) 
          : Array.isArray(formData.skills) 
            ? formData.skills 
            : [],
        interests: typeof formData.interests === 'string' 
          ? JSON.parse(formData.interests) 
          : Array.isArray(formData.interests) 
            ? formData.interests 
            : []
      };
      
      console.log('Sending formatted data:', formattedData);
      
      await api.put('/profile/update', formattedData);
      await refreshProfile();
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Helper function to safely get array data
  const safeGetArray = (data) => {
    if (!data) return [];
    
    // If it's a string, try parsing it as JSON
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    
    // If it's an array, it might contain a single stringified array
    if (Array.isArray(data)) {
      if (data.length === 1 && typeof data[0] === 'string' && data[0].startsWith('[')) {
        try {
          const parsed = JSON.parse(data[0]);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
      return data;
    }
    
    return [];
  };

  if (loading) return <div className="p-20"><Loader text="Syncing user profile..." /></div>;

  const DetailSection = ({ icon: Icon, label, value, field, isList = false }) => {
    // Safely get array data
    const arrayData = isList ? safeGetArray(profile[field]) : null;
    const formArrayData = isList ? safeGetArray(formData[field]) : null;
    
    return (
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/60">
          <Icon className="w-4 h-4 text-primary/60" />
          {label}
        </label>
        {isEditing ? (
          isList ? (
            <div className="flex flex-wrap gap-2">
              {formArrayData?.map((item, idx) => (
                <span key={idx} className="bg-primary/20 text-primary-light border border-primary/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                  {item}
                  <button onClick={() => setFormData({ ...formData, [field]: formArrayData.filter(i => i !== item) })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button 
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 rounded-full transition-colors"
                onClick={() => {
                  const val = prompt(`Add new ${label.toLowerCase()}`);
                  if (val) setFormData({ ...formData, [field]: [...formArrayData, val] });
                }}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <input
              type="text"
              value={formData[field] || ''}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary/50 outline-none transition-all"
            />
          )
        ) : (
          <div className="text-sm font-bold text-white/90">
            {isList ? (
              <div className="flex flex-wrap gap-2">
                {arrayData?.length > 0 ? (
                  arrayData.map((item, idx) => {
                    const stats = profile.assessments && profile.assessments[item];
                    const isFullyVerified = field === 'skills' && stats?.finalStatus === 'verified';
                    const isPartiallyVerified = !isFullyVerified && field === 'skills' && stats?.level1?.status === 'passed';
                    
                    return (
                      <span 
                        key={idx} 
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2
                          ${isFullyVerified 
                            ? 'bg-success/10 text-success border border-success/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                            : isPartiallyVerified
                              ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]'
                              : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'}
                        `}
                      >
                        {isFullyVerified && <CheckCircle2 className="w-3 h-3" />}
                        {isPartiallyVerified && <Target className="w-3 h-3" />}
                        {item}
                        {isFullyVerified && <span className="text-[8px] uppercase tracking-tighter opacity-70">Verified</span>}
                        {isPartiallyVerified && <span className="text-[8px] uppercase tracking-tighter opacity-70">L1 Passed</span>}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-secondary text-xs">No {label.toLowerCase()} added yet</span>
                )}
              </div>
            ) : (
              value || <span className="text-secondary text-xs">Not specified</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary text-4xl font-black shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            {profile.name[0]}
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">{profile.name}</h1>
            <p className="text-secondary font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {profile.email}
            </p>
            {profile.level && (
              <p className="text-primary font-bold mt-1">{profile.level} • {profile.branch}</p>
            )}
          </div>
        </div>
        <button
          onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
          disabled={saving}
          className={`glow-button flex items-center gap-2 ${isEditing ? 'bg-success hover:bg-success/80' : ''}`}
        >
          {saving ? 'Saving...' : isEditing ? (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          ) : (
            <>
              <Edit3 className="w-5 h-5" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Academic Details */}
        <div className="glass-card p-10 space-y-8">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4">Academic Profile</h3>
          {profile.level && (
            <>
              <DetailSection icon={GraduationCap} label="Current Level" value={profile.level} field="level" />
              <DetailSection icon={BookOpen} label="Branch/Department" value={profile.branch} field="branch" />
              <DetailSection icon={TrendingUp} label="CGPA/Percentage" value={profile.cgpa} field="cgpa" />
            </>
          )}
          {profile.education && (
            <DetailSection icon={GraduationCap} label="Education" value={profile.education} field="education" />
          )}
          {profile.experience && (
            <DetailSection icon={Briefcase} label="Experience Level" value={profile.experience} field="experience" />
          )}
        </div>

        {/* Technical Skills */}
        <div className="glass-card p-10 space-y-8">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4">Technical Profile</h3>
          <DetailSection icon={Sparkles} label="Skills" isList={true} field="skills" />
          <DetailSection icon={Heart} label="Interests" isList={true} field="interests" />
        </div>

        {/* Projects */}
        {profile.projects && (
          <div className="glass-card p-10 space-y-8">
            <h3 className="text-xl font-bold border-b border-white/5 pb-4">Project Experience</h3>
            {profile.projects.hasProjects ? (
              <>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/60">
                    <Briefcase className="w-4 h-4 text-primary/60" />
                    Project Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const projectTypes = safeGetArray(profile.projects.types);
                      return projectTypes.length > 0 ? (
                        projectTypes.map((type, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold hover:bg-primary/20 transition-colors"
                          >
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="text-secondary text-xs">No project types specified</span>
                      );
                    })()}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/60">
                    <Plus className="w-4 h-4 text-primary/60" />
                    Project Count
                  </label>
                  <div className="text-sm font-bold text-white/90">{profile.projects.count || 'Not specified'}</div>
                </div>
              </>
            ) : (
              <p className="text-sm text-secondary">No projects listed yet</p>
            )}
          </div>
        )}

        {/* Resume */}
        {profile.resumeUrl && (
          <div className="glass-card p-10 space-y-8">
            <h3 className="text-xl font-bold border-b border-white/5 pb-4">Resume</h3>
            <a 
              href={`http://localhost:5000${profile.resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4 hover:bg-primary/20 transition-all"
            >
              <FileText className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-bold">View Resume</p>
                <p className="text-xs text-secondary">Click to download</p>
              </div>
              <Download className="w-5 h-5 text-primary" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
