import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, GraduationCap, Briefcase, Heart, Target, Sparkles, 
  Save, Edit3, Plus, X, FileText, Download, Clock, TrendingUp, BookOpen, 
  CheckCircle2, Globe, MapPin, Layers, Building2, Users as UsersIcon, Zap
} from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { profile, loading, refreshProfile, setUser, setProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [newResume, setNewResume] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  const isRecruiter = profile?.role === 'recruiter';

  useEffect(() => {
    if (profile) {
      // Parse skills and interests if they come as strings
      const parsedProfile = { ...profile };
      
      if (!isRecruiter) {
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
        
        parsedProfile.skills = Array.isArray(parsedProfile.skills) ? parsedProfile.skills : [];
        parsedProfile.interests = Array.isArray(parsedProfile.interests) ? parsedProfile.interests : [];
        
        // Fetch applications for students
        fetchApplications();
      }
      
      setFormData(parsedProfile);
    }
  }, [profile, isRecruiter]);

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await api.get('/applications/student');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleCancel = () => {
    const parsedProfile = { ...profile };
    if (!isRecruiter) {
      parsedProfile.skills = safeGetArray(profile.skills);
      parsedProfile.interests = safeGetArray(profile.interests);
    }
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
      let response;
      if (isRecruiter) {
        // Recruiter Update Logic
        response = await api.put('/users/company-profile', {
          companyName: formData.companyName,
          companyWebsite: formData.companyWebsite,
          companyLocation: formData.companyLocation,
          industry: formData.industry,
          companySize: formData.companySize,
          companyDescription: formData.companyDescription
        });
      } else {
        // Student Update Logic
        let data;
        let config = {};

        if (newResume) {
          data = new FormData();
          const fields = ['name', 'education', 'experience', 'level', 'branch', 'cgpa'];
          fields.forEach(field => {
            if (formData[field] !== undefined) data.append(field, formData[field]);
          });
          data.append('skills', JSON.stringify(safeGetArray(formData.skills)));
          data.append('interests', JSON.stringify(safeGetArray(formData.interests)));
          data.append('resume', newResume);
        } else {
          data = {
            ...formData,
            skills: safeGetArray(formData.skills),
            interests: safeGetArray(formData.interests)
          };
          config = { headers: { 'Content-Type': 'application/json' } };
        }
        response = await api.put('/profile/update', data, config);
      }
      
      if (response.data) {
        // Sync global state immediately
        const updatedData = response.data.user || response.data;
        setUser(updatedData);
        setProfile(updatedData);
        setIsEditing(false);
        setNewResume(null);
        await refreshProfile();
      }
    } catch (err) {
      console.error('Update failed:', err);
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const safeGetArray = (data) => {
    if (!data) return [];
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    if (Array.isArray(data)) return data;
    return [];
  };

  if (loading) return <div className="p-20"><Loader text="Syncing profile..." /></div>;

  const DetailSection = ({ icon: Icon, label, value, field, isList = false }) => {
    const arrayData = isList ? safeGetArray(profile[field]) : null;
    const formArrayData = isList ? safeGetArray(formData[field]) : null;
    
    // Helper to get color for skills based on assessment status
    const getSkillBadgeStyles = (skill) => {
      const assessment = profile?.assessments?.[skill];
      if (!assessment) return "bg-primary/10 text-primary border-primary/20";
      
      const isVerified = assessment.finalStatus === 'verified' || assessment.level2?.status === 'completed' || assessment.level2?.status === 'passed';
      const isLevel1Passed = assessment.level1?.status === 'passed';

      if (isVerified) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      if (isLevel1Passed) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      
      return "bg-primary/10 text-primary border-primary/20";
    };

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
                  {item} <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData({ ...formData, [field]: formArrayData.filter(i => i !== item) })} />
                </span>
              ))}
              <button className="bg-white/5 border border-white/10 p-1.5 rounded-full" onClick={() => {
                const val = prompt(`Add ${label}`);
                if (val) setFormData({ ...formData, [field]: [...formArrayData, val] });
              }}><Plus className="w-3 h-3" /></button>
            </div>
          ) : (
            <input
              type="text"
              value={formData[field] || ''}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50"
            />
          )
        ) : (
          <div className="text-sm font-bold text-white/90">
            {isList ? (
              <div className="flex flex-wrap gap-2">
                {arrayData?.map((item, idx) => (
                  <span 
                    key={idx} 
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${field === 'skills' ? getSkillBadgeStyles(item) : 'bg-primary/10 text-primary border-primary/20'}`}
                  >
                    {item}
                    {field === 'skills' && profile?.assessments?.[item]?.finalStatus === 'verified' && (
                      <CheckCircle2 className="w-3 h-3 inline-block ml-1.5" />
                    )}
                  </span>
                )) || <span className="text-secondary text-xs">Not specified</span>}
              </div>
            ) : ( value || <span className="text-secondary text-xs">Not specified</span> )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary text-4xl font-black">
            {profile.name[0]}
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              {isRecruiter ? (profile.companyName || profile.name) : profile.name}
            </h1>
            <p className="text-secondary font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" /> {profile.email}
            </p>
            {isRecruiter ? (
              <p className="text-primary font-bold mt-1 uppercase tracking-widest text-xs">{profile.industry || 'Recruiter'}</p>
            ) : profile.level && (
              <p className="text-primary font-bold mt-1">{profile.level} • {profile.branch}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          {isEditing && (
            <button onClick={handleCancel} className="px-6 py-3 rounded-2xl border border-white/10 text-secondary font-bold uppercase tracking-widest text-[10px]">Cancel</button>
          )}
          <button onClick={isEditing ? handleUpdate : () => setIsEditing(true)} disabled={saving} className="glow-button flex items-center gap-2">
            {saving ? 'Saving...' : isEditing ? <><Save className="w-5 h-5" /> Save Changes</> : <><Edit3 className="w-5 h-5" /> Edit Profile</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isRecruiter ? (
          <>
            {/* Company Info */}
            <div className="glass-card p-10 space-y-8">
              <h3 className="text-xl font-bold border-b border-white/5 pb-4 uppercase tracking-tighter">Company Architecture</h3>
              <DetailSection icon={Building2} label="Company Name" value={profile.companyName} field="companyName" />
              <DetailSection icon={Globe} label="Website" value={profile.companyWebsite} field="companyWebsite" />
              <DetailSection icon={MapPin} label="Location" value={profile.companyLocation} field="companyLocation" />
            </div>
            
            <div className="glass-card p-10 space-y-8">
              <h3 className="text-xl font-bold border-b border-white/5 pb-4 uppercase tracking-tighter">Intel & Scale</h3>
              <DetailSection icon={Layers} label="Industry" value={profile.industry} field="industry" />
              <DetailSection icon={UsersIcon} label="Company Size" value={profile.companySize} field="companySize" />
            </div>

            <div className="glass-card p-10 space-y-8 lg:col-span-2">
              <h3 className="text-xl font-bold border-b border-white/5 pb-4 uppercase tracking-tighter">Vision & Description</h3>
              <DetailSection icon={FileText} label="Description" value={profile.companyDescription} field="companyDescription" />
            </div>
          </>
        ) : (
          <>
            <div className="glass-card p-10 space-y-8">
              <h3 className="text-xl font-bold border-b border-white/5 pb-4">Academic Profile</h3>
              <DetailSection icon={GraduationCap} label="Level" value={profile.level} field="level" />
              <DetailSection icon={BookOpen} label="Branch" value={profile.branch} field="branch" />
              <DetailSection icon={TrendingUp} label="CGPA" value={profile.cgpa} field="cgpa" />
            </div>

            <div className="glass-card p-10 space-y-8">
              <h3 className="text-xl font-bold border-b border-white/5 pb-4">Technical Profile</h3>
              <DetailSection icon={Sparkles} label="Skills" isList={true} field="skills" />
              <DetailSection icon={Heart} label="Interests" isList={true} field="interests" />
            </div>

        <div className="glass-card p-10 space-y-8 lg:col-span-2">
              <h3 className="text-xl font-bold border-b border-white/5 pb-4">Resume</h3>
              {profile.resumeUrl ? (
                <a 
                  href={`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '')}${profile.resumeUrl}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 bg-primary/10 p-4 rounded-xl"
                >
                  <FileText className="w-6 h-6 text-primary" />
                  <div className="flex-1 font-bold text-sm">View Resume</div>
                  <Download className="w-5 h-5 text-primary" />
                </a>
              ) : <p className="text-secondary text-sm text-center py-4 border border-dashed border-white/5 rounded-xl">No resume uploaded</p>}
            </div>

            {/* Applied Roles Section */}
            <div className="glass-card p-10 space-y-8 lg:col-span-2 bg-gradient-to-br from-card to-primary/5">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-primary" />
                  Applied Roles Registry
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                  {applications.length} Records
                </span>
              </div>

              {loadingApps ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-xs text-secondary font-bold uppercase tracking-widest">Accessing Career Vault...</p>
                </div>
              ) : applications.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {applications.map((app) => (
                    <div key={app._id} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Target className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black uppercase tracking-tighter group-hover:text-primary transition-colors">{app.jobId?.title || 'Unknown Role'}</h4>
                          <p className="text-xs text-secondary font-bold flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5" /> {app.jobId?.companyName || 'Unknown Company'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right hidden md:block">
                          <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">Match Score</p>
                          <p className="text-lg font-black text-primary">{app.matchScore}%</p>
                        </div>
                        
                        <div className="text-right hidden md:block">
                          <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">Applied On</p>
                          <p className="text-xs font-bold text-white/80">{new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>

                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${
                          app.status === 'Shortlisted' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                          app.status === 'Rejected' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
                          'bg-white/5 text-secondary border-white/5'
                        }`}>
                          {app.status === 'Shortlisted' && <Zap className="w-3 h-3 animate-pulse" />}
                          {app.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
                  <p className="text-secondary font-bold text-sm">No active applications in the registry. Your career trajectory is wide open.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
