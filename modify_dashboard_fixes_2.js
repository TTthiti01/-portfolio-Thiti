import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf-8');
content = content.replace(", Upload", "");
fs.writeFileSync('src/pages/admin/Dashboard.tsx', content);

let portContent = fs.readFileSync('src/pages/Portfolio.tsx', 'utf-8');
portContent = portContent.replace(
  "supabase.from('skills').select('*').order('created_at', { ascending: true }).then(({ data }) => {\n            \n        });",
  ""
);
fs.writeFileSync('src/pages/Portfolio.tsx', portContent);

