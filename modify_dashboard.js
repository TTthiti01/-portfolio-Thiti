import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf-8');

// 1. Add Icons
content = content.replace(
  "import { LogOut, LayoutDashboard, Briefcase, Mail, GraduationCap } from 'lucide-react';",
  "import { LogOut, LayoutDashboard, Briefcase, Mail, GraduationCap, BarChart3, User, Award, Upload } from 'lucide-react';"
);

// 2. Add State
const stateToAdd = `
  const [pageViews, setPageViews] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', icon_name: '', category: 'frontend' });
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
`;
content = content.replace(
  "const [newExperience, setNewExperience] = useState({ role: '', company: '', duration: '', description: '' });",
  "const [newExperience, setNewExperience] = useState({ role: '', company: '', duration: '', description: '' });\n" + stateToAdd
);

// 3. Add Fetchers
const fetchersToAdd = `
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
`;
content = content.replace(
  "async function fetchExperiences() {",
  fetchersToAdd + "\n  async function fetchExperiences() {"
);

// 4. Add to useEffect
content = content.replace(
  "fetchExperiences();",
  "fetchExperiences();\n      fetchAnalytics();\n      fetchProfile();\n      fetchSkills();"
);

// 5. Update activeTab initial state to 'overview'
content = content.replace("useState('messages')", "useState('overview')");

// 6. Update tabTitles
content = content.replace(
  "experience: 'ประสบการณ์ (Experiences)'",
  "experience: 'ประสบการณ์ (Experiences)',\n    overview: 'ภาพรวม & สถิติ',\n    profile: 'จัดการโปรไฟล์',\n    skills: 'จัดการทักษะ'"
);

fs.writeFileSync('src/pages/admin/Dashboard.tsx', content);
console.log("Dashboard updated part 1");
