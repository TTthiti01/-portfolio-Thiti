import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf-8');

const overviewContent = `
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
`;

const profileContent = `
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
`;

const skillsContent = `
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
`;

content = content.replace(
  "        <div className=\"admin-content\">\n          {activeTab === 'messages' && (",
  "        <div className=\"admin-content\">\n" + overviewContent + profileContent + skillsContent + "          {activeTab === 'messages' && ("
);

fs.writeFileSync('src/pages/admin/Dashboard.tsx', content);
console.log("Dashboard updated part 4");
