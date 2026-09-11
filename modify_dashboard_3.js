import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf-8');

const navItemsToAdd = `
          <button 
            className={\`admin-nav-item \${activeTab === 'overview' ? 'active' : ''}\`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={18} /> ภาพรวม & สถิติ
          </button>
          <button 
            className={\`admin-nav-item \${activeTab === 'profile' ? 'active' : ''}\`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> จัดการโปรไฟล์
          </button>
          <button 
            className={\`admin-nav-item \${activeTab === 'skills' ? 'active' : ''}\`}
            onClick={() => setActiveTab('skills')}
          >
            <Award size={18} /> จัดการทักษะ
          </button>
`;

content = content.replace(
  "          <button \n            className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}",
  navItemsToAdd + "          <button \n            className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}"
);

fs.writeFileSync('src/pages/admin/Dashboard.tsx', content);
console.log("Dashboard updated part 3");
