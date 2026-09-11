import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf-8');

const handlersToAdd = `
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
`;

content = content.replace(
  "  // --- Experiences Logic ---",
  handlersToAdd + "\n  // --- Experiences Logic ---"
);

fs.writeFileSync('src/pages/admin/Dashboard.tsx', content);
console.log("Dashboard updated part 2");
