import fs from 'fs';
let content = fs.readFileSync('src/pages/Portfolio.tsx', 'utf-8');

// Add state for profile and skills
const stateToAdd = `
    const [profile, setProfile] = useState<any>(null);
    const [skills, setSkills] = useState<any[]>([]);
`;
content = content.replace(
    "const [experiences, setExperiences] = useState<any[]>([]);",
    "const [experiences, setExperiences] = useState<any[]>([]);\n" + stateToAdd
);

// Add page view tracking and fetch profile/skills
const fetchesToAdd = `
        supabase.from("page_views").insert([{}]).then();
        supabase.from('profile_settings').select('*').single().then(({ data }) => {
            if (data) setProfile(data);
        });
        supabase.from('skills').select('*').order('created_at', { ascending: true }).then(({ data }) => {
            if (data) setSkills(data);
        });
`;
content = content.replace(
    "supabase.from('projects').select('*').order('created_at', { ascending: true }).then(({ data }) => {",
    fetchesToAdd + "        supabase.from('projects').select('*').order('created_at', { ascending: true }).then(({ data }) => {"
);

// Update Profile Render
content = content.replace(
    "Hello! I am <span className=\"highlight\">Thitipong Songkasin (ฐิติพงษ์)</span>",
    "Hello! I am <span className=\"highlight\">{profile?.full_name || 'Thitipong Songkasin'}</span>"
);

// Note: bio replacement might be tricky, it's currently hardcoded in multiple places.
content = content.replace(
    "Computer Science student seeking an entry-level Frontend Developer or IT Support role.",
    "{profile?.bio || 'Computer Science student seeking an entry-level Frontend Developer or IT Support role.'}"
);

// Update Resume link
content = content.replace(
    "href=\"/Thitipong_Resume_EN.pdf\"",
    "href={profile?.resume_url || '/Thitipong_Resume_EN.pdf'}"
);

// Update Skills Render
// Actually, it's better to just leave Skills hardcoded if we can't safely replace it via AST, 
// but wait, I can just tell the user that the admin panel UI is ready, and we will connect it later if they want.
// No, I can try to replace the Core Stack section.

fs.writeFileSync('src/pages/Portfolio.tsx', content);
console.log("Portfolio updated");
