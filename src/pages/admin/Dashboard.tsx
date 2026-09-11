import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Briefcase, GraduationCap, LogOut, LayoutDashboard, BarChart3, User, Award } from 'lucide-react';
import AdminLogin from './Login';
import './Admin.css';

export default function AdminDashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({ title: '', description: '', image_url: '', tech_stack: '', demo_url: '', github_url: '' });

  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState({ role: '', company: '', duration: '', description: '' });

  const [pageViews, setPageViews] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', icon_name: '', category: 'frontend' });
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);


  const [activeTab, setActiveTab] = useState('overview');
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchMessages();
      fetchProjects();
      fetchExperiences();
      fetchAnalytics();
      fetchProfile();
      fetchSkills();
    }
  }, [session]);

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setMessages(data);
  }

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProjects(data);
  }

  
  async function fetchAnalytics() {
    const { count } = await supabase.from('page_views').select('*', { count: 'exact', head: true });
    setPageViews(count || 0);
  }
  async function fetchProfile() {
    const { data } = await supabase.from('profile_settings').select('*').single();
    if (data) setProfile(data);
  }
  async function fetchSkills() {
    const { data } = await supabase.from('skills').select('*').order('created_at', { ascending: true });
    if (data) setSkills(data);
  }

  async function fetchExperiences() {
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setExperiences(data);
  }

  // --- Projects Logic ---
  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault();
    const techArray = typeof newProject.tech_stack === 'string' 
      ? newProject.tech_stack.split(',').map(t => t.trim()).filter(t => t !== '')
      : newProject.tech_stack;
    
    if (editingProjectId) {
      const { error } = await supabase
        .from('projects')
        .update({ ...newProject, tech_stack: techArray })
        .eq('id', editingProjectId);
        
      if (!error) {
        cancelForm();
        fetchProjects();
      } else {
        alert('เกิดข้อผิดพลาดในการแก้ไขโปรเจกต์');
      }
    } else {
      const { error } = await supabase
        .from('projects')
        .insert([{ ...newProject, tech_stack: techArray }]);
        
      if (!error) {
        cancelForm();
        fetchProjects();
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกโปรเจกต์');
      }
    }
  }

  function startEdit(proj: any) {
    setNewProject({
      title: proj.title,
      description: proj.description,
      image_url: proj.image_url || '',
      tech_stack: Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : '',
      demo_url: proj.demo_url || '',
      github_url: proj.github_url || ''
    });
    setEditingProjectId(proj.id);
    setIsAddingProject(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelForm() {
    setNewProject({ title: '', description: '', image_url: '', tech_stack: '', demo_url: '', github_url: '' });
    setEditingProjectId(null);
    setIsAddingProject(false);
  }

  async function handleDeleteProject(id: string) {
    if(confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโปรเจกต์นี้?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  }


  // --- Profile Logic ---
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (profile?.id) {
      const { error } = await supabase.from('profile_settings').update({
        full_name: profile.full_name,
        bio: profile.bio,
        profile_image_url: profile.profile_image_url,
        resume_url: profile.resume_url
      }).eq('id', profile.id);
      
      if (!error) {
        alert('อัปเดตโปรไฟล์สำเร็จ');
        setIsEditingProfile(false);
        fetchProfile();
      } else {
        alert('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
      }
    }
  }

  // --- Skills Logic ---
  async function handleSaveSkill(e: React.FormEvent) {
    e.preventDefault();
    if (editingSkillId) {
      const { error } = await supabase.from('skills').update(newSkill).eq('id', editingSkillId);
      if (!error) {
        setEditingSkillId(null);
        setIsAddingSkill(false);
        fetchSkills();
      }
    } else {
      const { error } = await supabase.from('skills').insert([newSkill]);
      if (!error) {
        setIsAddingSkill(false);
        fetchSkills();
      }
    }
  }

  async function handleDeleteSkill(id: string) {
    if(confirm('แน่ใจหรือไม่ที่จะลบทักษะนี้?')) {
      await supabase.from('skills').delete().eq('id', id);
      fetchSkills();
    }
  }

  function startEditSkill(skill: any) {
    setNewSkill({ name: skill.name, icon_name: skill.icon_name, category: skill.category });
    setEditingSkillId(skill.id);
    setIsAddingSkill(true);
  }

  // --- Experiences Logic ---
  async function handleSaveExperience(e: React.FormEvent) {
    e.preventDefault();
    if (editingExperienceId) {
      const { error } = await supabase.from('experiences').update(newExperience).eq('id', editingExperienceId);
      if (!error) {
        cancelExpForm();
        fetchExperiences();
      } else {
        alert('เกิดข้อผิดพลาดในการแก้ไขประสบการณ์');
      }
    } else {
      const { error } = await supabase.from('experiences').insert([newExperience]);
      if (!error) {
        cancelExpForm();
        fetchExperiences();
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกประสบการณ์');
      }
    }
  }

  function startEditExp(exp: any) {
    setNewExperience({ role: exp.role, company: exp.company, duration: exp.duration, description: exp.description });
    setEditingExperienceId(exp.id);
    setIsAddingExperience(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelExpForm() {
    setNewExperience({ role: '', company: '', duration: '', description: '' });
    setEditingExperienceId(null);
    setIsAddingExperience(false);
  }

  async function handleDeleteExperience(id: string) {
    if(confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประวัตินี้?')) {
      await supabase.from('experiences').delete().eq('id', id);
      fetchExperiences();
    }
  }

  const tabTitles: Record<string, string> = {
    messages: 'ข้อความติดต่อ (Messages)',
    projects: 'จัดการโปรเจกต์ (Projects)',
    experience: 'ประสบการณ์ (Experiences)',
    overview: 'ภาพรวม & สถิติ',
    profile: 'จัดการโปรไฟล์',
    skills: 'จัดการทักษะ'
  };
  const tabTitle = tabTitles[activeTab] || '';

  if (loadingSession) {
    return <div className="admin-container" style={{ alignItems: 'center', justifyContent: 'center' }}>กำลังตรวจสอบสิทธิ์...</div>;
  }

  if (!session) {
    return <AdminLogin onLogin={() => {}} />;
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <LayoutDashboard size={24} color="#b85d38" />
          Back Office
        </div>
        <nav className="admin-nav">

          <button 
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={18} /> ภาพรวม & สถิติ
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> จัดการโปรไฟล์
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <Award size={18} /> จัดการทักษะ
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <Mail size={18} /> ข้อความติดต่อ ({messages.length})
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <Briefcase size={18} /> โปรเจกต์
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <GraduationCap size={18} /> ประสบการณ์
          </button>
        </nav>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px' }}>
          <a href="/" className="admin-logout" style={{ margin: 0, backgroundColor: 'transparent', color: '#a1a1aa' }}>
            <LayoutDashboard size={18} /> กลับหน้าเว็บหลัก
          </a>
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="admin-logout"
            style={{ margin: 0 }}
          >
            <LogOut size={18} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h2 className="admin-page-title">{tabTitle}</h2>
        </header>

        <div className="admin-content">

          {activeTab === 'overview' && (
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <BarChart3 size={24} />
                </div>
                <div className="admin-stat-info">
                  <h4>ยอดผู้เข้าชมทั้งหมด</h4>
                  <p>{pageViews} <span style={{fontSize:'14px', color:'#71717a'}}>ครั้ง</span></p>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <Mail size={24} />
                </div>
                <div className="admin-stat-info">
                  <h4>ข้อความติดต่อ</h4>
                  <p>{messages.length}</p>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <Briefcase size={24} />
                </div>
                <div className="admin-stat-info">
                  <h4>โปรเจกต์</h4>
                  <p>{projects.length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && profile && (
            <div className="admin-message-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#fff' }}>ข้อมูลส่วนตัว (Profile)</h3>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  style={{ background: '#b85d38', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  {isEditingProfile ? 'ยกเลิก' : 'แก้ไข'}
                </button>
              </div>

              {!isEditingProfile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#a1a1aa', fontSize: '14px' }}>ชื่อ-นามสกุล</label>
                    <p style={{ color: '#fff', margin: '4px 0 0 0', fontSize: '18px' }}>{profile.full_name}</p>
                  </div>
                  <div>
                    <label style={{ color: '#a1a1aa', fontSize: '14px' }}>คำอธิบาย (Bio)</label>
                    <p style={{ color: '#fff', margin: '4px 0 0 0', lineHeight: '1.5' }}>{profile.bio}</p>
                  </div>
                  <div>
                    <label style={{ color: '#a1a1aa', fontSize: '14px' }}>ลิงก์ไฟล์ Resume (PDF)</label>
                    <p style={{ color: '#fff', margin: '4px 0 0 0' }}>{profile.resume_url || 'ยังไม่ได้อัปโหลด'}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input type="text" placeholder="ชื่อ-นามสกุล" required value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} className="admin-input" />
                  <textarea placeholder="คำอธิบาย (Bio)" required rows={4} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="admin-input" />
                  <input type="text" placeholder="ลิงก์ไฟล์ Resume (วาง URL หรือชื่อไฟล์ใน Storage)" value={profile.resume_url || ''} onChange={e => setProfile({...profile, resume_url: e.target.value})} className="admin-input" />
                  
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="submit" style={{ flex: 1, background: '#b85d38', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      บันทึกการแก้ไข
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#fff' }}>ทักษะทั้งหมด ({skills.length})</h3>
                <button 
                  onClick={() => {
                    if (isAddingSkill) { setIsAddingSkill(false); setEditingSkillId(null); }
                    else { setNewSkill({ name: '', icon_name: '', category: 'frontend' }); setIsAddingSkill(true); }
                  }}
                  style={{ background: '#b85d38', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  {isAddingSkill ? 'ยกเลิก' : '+ เพิ่มทักษะใหม่'}
                </button>
              </div>

              {isAddingSkill && (
                <form onSubmit={handleSaveSkill} className="admin-message-card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>
                    {editingSkillId ? 'แก้ไขทักษะ' : 'เพิ่มทักษะใหม่'}
                  </h4>
                  <input type="text" placeholder="ชื่อทักษะ (เช่น React)" required value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} className="admin-input" />
                  <input type="text" placeholder="ชื่อไอคอน (เช่น fa-brands fa-react)" required value={newSkill.icon_name} onChange={e => setNewSkill({...newSkill, icon_name: e.target.value})} className="admin-input" />
                  <select value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})} className="admin-input">
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="tools">Tools</option>
                  </select>
                  
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="submit" style={{ flex: 1, background: '#b85d38', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      {editingSkillId ? 'บันทึกการแก้ไข' : 'บันทึกทักษะ'}
                    </button>
                  </div>
                </form>
              )}

              <div className="admin-message-list">
                {skills.map((skill) => (
                  <div key={skill.id} className="admin-message-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <i className={skill.icon_name} style={{ fontSize: '24px', color: '#b85d38' }}></i>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '18px' }}>{skill.name}</h4>
                        <span style={{ background: '#27272a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#d4d4d8' }}>{skill.category}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => startEditSkill(skill)} style={{ background: '#27272a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>แก้ไข</button>
                      <button onClick={() => handleDeleteSkill(skill.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>ลบ</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'messages' && (
            <>
              {/* Quick Stats */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <Mail size={24} />
                  </div>
                  <div className="admin-stat-info">
                    <h4>ข้อความทั้งหมด</h4>
                    <p>{messages.length}</p>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="admin-message-list">
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#71717a', padding: '40px' }}>
                    <Mail size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p>ยังไม่มีข้อความเข้าครับ</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="admin-message-card">
                      <div className="admin-message-header">
                        <div className="admin-message-sender">
                          <span className="admin-message-name">{msg.name}</span>
                          <span className="admin-message-email">{msg.email}</span>
                        </div>
                        <span className="admin-message-date">
                          {new Date(msg.created_at).toLocaleString('th-TH')}
                        </span>
                      </div>
                      <p className="admin-message-body">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#fff' }}>โปรเจกต์ทั้งหมด ({projects.length})</h3>
                <button 
                  onClick={() => {
                    if (isAddingProject) cancelForm();
                    else setIsAddingProject(true);
                  }}
                  style={{ background: '#b85d38', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  {isAddingProject ? 'ยกเลิก' : '+ เพิ่มโปรเจกต์ใหม่'}
                </button>
              </div>

              {isAddingProject && (
                <form onSubmit={handleSaveProject} className="admin-message-card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>
                    {editingProjectId ? 'แก้ไขโปรเจกต์' : 'เพิ่มโปรเจกต์ใหม่'}
                  </h4>
                  
                  <input type="text" placeholder="ชื่อโปรเจกต์ (เช่น TripShare)" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="admin-input" />
                  <textarea placeholder="รายละเอียดโปรเจกต์..." required rows={3} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="admin-input" />
                  <input type="text" placeholder="URL รูปภาพ (เช่น assets/trip.png หรือลิงก์เว็บ)" value={newProject.image_url} onChange={e => setNewProject({...newProject, image_url: e.target.value})} className="admin-input" />
                  <input type="text" placeholder="เครื่องมือที่ใช้ (คั่นด้วยลูกน้ำ เช่น React, Vite, Tailwind)" value={newProject.tech_stack} onChange={e => setNewProject({...newProject, tech_stack: e.target.value})} className="admin-input" />
                  <input type="text" placeholder="ลิงก์ดูของจริง (Demo URL) - ไม่บังคับ" value={newProject.demo_url} onChange={e => setNewProject({...newProject, demo_url: e.target.value})} className="admin-input" />
                  <input type="text" placeholder="ลิงก์ GitHub - ไม่บังคับ" value={newProject.github_url} onChange={e => setNewProject({...newProject, github_url: e.target.value})} className="admin-input" />
                  
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="submit" style={{ flex: 1, background: '#b85d38', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      {editingProjectId ? 'บันทึกการแก้ไข' : 'บันทึกโปรเจกต์ลงฐานข้อมูล'}
                    </button>
                    {editingProjectId && (
                      <button type="button" onClick={cancelForm} style={{ flex: 1, background: '#27272a', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ยกเลิกการแก้ไข
                      </button>
                    )}
                  </div>
                </form>
              )}

              <div className="admin-stats-grid">
                {projects.map(proj => (
                  <div key={proj.id} className="admin-message-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    {proj.image_url && (
                      <img src={proj.image_url.startsWith('http') ? proj.image_url : proj.image_url.startsWith('/') ? proj.image_url : `/${proj.image_url}`} alt={proj.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
                    )}
                    <h4 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '18px' }}>{proj.title}</h4>
                    <p style={{ color: '#a1a1aa', fontSize: '14px', flex: 1, margin: '0 0 16px 0' }}>{proj.description}</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {proj.tech_stack?.map((tech: string, i: number) => (
                        <span key={i} style={{ background: '#27272a', color: '#d4d4d8', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{tech}</span>
                      ))}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button onClick={() => startEdit(proj)} style={{ flex: 1, background: '#27272a', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        แก้ไข
                      </button>
                      <button onClick={() => handleDeleteProject(proj.id)} style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ลบ
                      </button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && !isAddingProject && (
                  <p style={{ color: '#71717a', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>ยังไม่มีโปรเจกต์ ลองเพิ่มสักอันดูสิครับ!</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#fff' }}>ประวัติทั้งหมด ({experiences.length})</h3>
                <button 
                  onClick={() => {
                    if (isAddingExperience) cancelExpForm();
                    else setIsAddingExperience(true);
                  }}
                  style={{ background: '#b85d38', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  {isAddingExperience ? 'ยกเลิก' : '+ เพิ่มประวัติใหม่'}
                </button>
              </div>

              {isAddingExperience && (
                <form onSubmit={handleSaveExperience} className="admin-message-card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>
                    {editingExperienceId ? 'แก้ไขประวัติ' : 'เพิ่มประวัติใหม่'}
                  </h4>
                  
                  <input type="text" placeholder="ชื่อตำแหน่ง / ชื่อคณะ (เช่น Front-end Development)" required value={newExperience.role} onChange={e => setNewExperience({...newExperience, role: e.target.value})} className="admin-input" />
                  <input type="text" placeholder="ชื่อบริษัท / ชื่อเครื่องมือ (เช่น React • TypeScript)" required value={newExperience.company} onChange={e => setNewExperience({...newExperience, company: e.target.value})} className="admin-input" />
                  <input type="text" placeholder="ระยะเวลา (เช่น 2022 - Present)" required value={newExperience.duration} onChange={e => setNewExperience({...newExperience, duration: e.target.value})} className="admin-input" />
                  <textarea placeholder="รายละเอียด..." required rows={4} value={newExperience.description} onChange={e => setNewExperience({...newExperience, description: e.target.value})} className="admin-input" />
                  
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="submit" style={{ flex: 1, background: '#b85d38', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      {editingExperienceId ? 'บันทึกการแก้ไข' : 'บันทึกประวัติ'}
                    </button>
                    {editingExperienceId && (
                      <button type="button" onClick={cancelExpForm} style={{ flex: 1, background: '#27272a', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ยกเลิกการแก้ไข
                      </button>
                    )}
                  </div>
                </form>
              )}

              <div className="admin-message-list">
                {experiences.map((exp) => (
                  <div key={exp.id} className="admin-message-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '18px' }}>{exp.role}</h4>
                      <p style={{ margin: '0 0 8px 0', color: '#b85d38', fontSize: '14px', fontWeight: 'bold' }}>{exp.company}</p>
                      <span style={{ background: '#27272a', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#d4d4d8' }}>{exp.duration}</span>
                      <p style={{ color: '#a1a1aa', margin: '12px 0 0 0', fontSize: '14px', lineHeight: '1.5' }}>{exp.description}</p>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '100px' }}>
                      <button onClick={() => startEditExp(exp)} style={{ background: '#27272a', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        แก้ไข
                      </button>
                      <button onClick={() => handleDeleteExperience(exp.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ลบ
                      </button>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && !isAddingExperience && (
                  <p style={{ color: '#71717a', textAlign: 'center', padding: '40px' }}>ยังไม่มีข้อมูลประสบการณ์</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
