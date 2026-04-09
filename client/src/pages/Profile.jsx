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
  const [newResume, setNewResume] = useState(null);

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

  const handleCancel = () => {
    // Re-parse profile for formData reset
    const parsedProfile = { ...profile };
    parsedProfile.skills = safeGetArray(profile.skills);
    parsedProfile.interests = safeGetArray(profile.interests);
    setFormData(parsedProfile);
    setNewResume(null);
    setIsEditing(false);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setNewResume(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      let data;
      let config = {};

      if (newResume) {
        // Use FormData only if a new file is present
        data = new FormData();
        
        // Append simple fields
        const fields = ['name', 'education', 'experience', 'level', 'branch', 'cgpa'];
        fields.forEach(field => {
          if (formData[field] !== undefined) data.append(field, formData[field]);
        });

        // Append stringified arrays (Crucial for Multipart Parsing)
        data.append('skills', JSON.stringify(safeGetArray(formData.skills)));
        data.append('interests', JSON.stringify(safeGetArray(formData.interests)));

        // Append File
        data.append('resume', newResume);
        
        // Let browser set the Content-Type with boundary automatically
        config = {}; 
      } else {
        // Use traditional JSON for standard updates
        data = {
          ...formData,
          skills: safeGetArray(formData.skills),
          interests: safeGetArray(formData.interests)
        };
        config = {
          headers: { 'Content-Type': 'application/json' }
        };
      }

      const response = await api.put('/profile/update', data, config);
      
      if (response.data) {
        await refreshProfile();
        setNewResume(null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Update failed:', err);
      const errorMsg = err.response?.data?.message || 'Failed to update profile. Please try again.';
      alert(errorMsg);
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
        <div className="flex gap-3">
          {isEditing && (
            <button
              onClick={handleCancel}
              className="px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-secondary font-bold uppercase tracking-widest text-[10px]"
            >
              Cancel
            </button>
          )}
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


        {/* Resume */}
        <div className="glass-card p-10 space-y-8 lg:col-span-2">
          <h3 className="text-xl font-bold border-b border-white/5 pb-4">Resume</h3>
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleResumeUpload}
              />
              <div className="flex flex-col md:flex-row items-center gap-4">
                <label 
                  htmlFor="resume-upload"
                  className="flex items-center gap-2 bg-primary/20 text-primary px-6 py-3 rounded-xl border border-primary/30 cursor-pointer hover:bg-primary/30 transition-all font-bold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {newResume ? 'Change Selection' : 'Re-upload Resume'}
                </label>
                {newResume && (
                  <div className="flex items-center gap-2 text-success bg-success/10 px-4 py-2 rounded-lg border border-success/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold truncate max-w-[200px]">{newResume.name}</span>
                  </div>
                )}
                <p className="text-xs text-secondary italic">Only PDF files up to 5MB</p>
              </div>
            </div>
          ) : profile.resumeUrl ? (
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
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
              <p className="text-secondary text-sm">No resume uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
