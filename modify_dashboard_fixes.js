import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf-8');

content = content.replace(
  "import { Mail, Briefcase, GraduationCap, LogOut, LayoutDashboard } from 'lucide-react';",
  "import { Mail, Briefcase, GraduationCap, LogOut, LayoutDashboard, BarChart3, User, Award, Upload } from 'lucide-react';"
);

content = content.replace(
  "const [editingSkillId, setEditingSkillId] = useState<string | null>(null);",
  "const [editingSkillId, setEditingSkillId] = useState<string | null>(null);\n  const [isEditingProfile, setIsEditingProfile] = useState(false);"
);

fs.writeFileSync('src/pages/admin/Dashboard.tsx', content);

// Also remove 'skills' variable from Portfolio to fix TS error
let portContent = fs.readFileSync('src/pages/Portfolio.tsx', 'utf-8');
portContent = portContent.replace(
  "const [skills, setSkills] = useState<any[]>([]);",
  ""
);
portContent = portContent.replace(
  "if (data) setSkills(data);",
  ""
);
fs.writeFileSync('src/pages/Portfolio.tsx', portContent);

