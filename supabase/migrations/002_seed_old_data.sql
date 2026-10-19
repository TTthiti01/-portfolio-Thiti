-- Seed data recovered from the pre-Supabase version of the site (git history,
-- commit 360c296) and the current Core Stack icons. Run AFTER 001_init.sql.
-- Each block only inserts when its table is empty, so it is safe to re-run.
-- messages and page_views are visitor-generated and cannot be recovered from git.

-- Profile (replaces the placeholder row created by 001_init.sql)
update public.profile_settings
set full_name = 'Thitipong Songkasin',
    bio = 'Computer Science student at RMUTSB focused on full-stack development and responsive UIs, seeking an entry-level opportunity as a Full-Stack Developer or IT Support. Eager to apply React, TypeScript, and technical troubleshooting skills in real-world projects.',
    profile_image_url = 'assets/avatar.jpg',
    resume_url = 'assets/Thitipong_Songkasin_Resume_TH_With_Photo.pdf'
where full_name = 'Your Name' and bio = 'Your bio';

-- Projects (image_url is relative to /public)
insert into public.projects (title, description, image_url, tech_stack, demo_url, github_url, is_hidden, created_at)
select * from (values
  ('Nyeta - Visual Assistance Platform',
   'Collaborated on a platform for blind and visually impaired users combining AI visual assistance, object detection, document/currency recognition, and live volunteer video calls. Contributed to eyes-free UX patterns using spoken feedback, TTS, haptics, and screen-reader-friendly interactions.',
   'assets/nyeta-preview.png',
   array['Next.js','React','TypeScript','Tailwind CSS','WebRTC','Gemini API','TensorFlow.js','Pusher'],
   'https://nyeta.vercel.app/', 'https://github.com/7sadakonr/Nyeta', false, now() - interval '4 minutes'),
  ('Thiti Carwash',
   'A car wash booking website built with HTML and CSS. It features service presentations and a booking system interface for customers.',
   'assets/thiticarwash.png',
   array['HTML5','CSS3'],
   'https://thiticarwash.vercel.app/', 'https://github.com/TTthiti01/thiticarwash', false, now() - interval '3 minutes'),
  ('TripShare - Expense Calculator',
   'Built a web app to manage trip members, record expenses, calculate fuel cost, and settle balances between participants. Added expense visualization and automatic settlement logic for an intuitive user experience.',
   'assets/trip.png',
   array['React','TypeScript','Vite'],
   'https://trip-share-phi.vercel.app/', 'https://github.com/TTthiti01/trip-share', false, now() - interval '2 minutes'),
  ('Portfolio Website',
   'A modern, interactive portfolio website showcasing my skills, projects, and experiences. Built with a focus on responsive design, smooth animations, and clean user interface.',
   'assets/portfolio-screenshot.png',
   array['React','TypeScript','Vite','CSS'],
   '/', 'https://github.com/TTthiti01/-portfolio-Thiti', false, now() - interval '1 minute')
) as v(title, description, image_url, tech_stack, demo_url, github_url, is_hidden, created_at)
where not exists (select 1 from public.projects);

-- Education & Core Skills cards (role / company / duration)
insert into public.experiences (role, company, duration, description, created_at)
select * from (values
  ('Bachelor of Computer Science', 'RMUTSB', 'GPA: 3.20 • 2022 - Present',
   'Rajamangala University of Technology Suvarnabhumi (Huntra Campus). Faculty of Science and Technology, majoring in Computer Science.', now() - interval '4 minutes'),
  ('Front-end Development', 'React • TypeScript • JavaScript', '',
   'Frontend foundation in React, TypeScript, JavaScript, HTML, and CSS. Able to build responsive interfaces for different screen sizes with a focus on clear usability.', now() - interval '3 minutes'),
  ('Hardware & IT Support', 'PC Assembly & Troubleshooting', '',
   'Knowledge of PC assembly, hardware specification analysis, and technical troubleshooting. Hands-on use of Git, Postman, and VS Code for development and testing.', now() - interval '2 minutes'),
  ('Collaboration & UX', 'Problem Solving & Teamwork', '',
   'Collaborative project experience with Git/GitHub, including accessibility-aware UI, screen-reader support, and voice-based interactions.', now() - interval '1 minute')
) as v(role, company, duration, description, created_at)
where not exists (select 1 from public.experiences);

-- Core Stack (Font Awesome class names, matching the admin skill form)
insert into public.skills (name, icon_name, category, created_at)
select * from (values
  ('HTML5',        'fa-brands fa-html5',    'frontend', now() - interval '11 minutes'),
  ('CSS3',         'fa-brands fa-css3-alt', 'frontend', now() - interval '10 minutes'),
  ('JavaScript',   'fa-brands fa-js',       'frontend', now() - interval '9 minutes'),
  ('TypeScript',   'fa-solid fa-code',      'frontend', now() - interval '8 minutes'),
  ('React',        'fa-brands fa-react',    'frontend', now() - interval '7 minutes'),
  ('Next.js',      'fa-solid fa-cube',      'frontend', now() - interval '6 minutes'),
  ('Tailwind CSS', 'fa-solid fa-wind',      'frontend', now() - interval '5 minutes'),
  ('Vite',         'fa-solid fa-bolt',      'tools',    now() - interval '1 minute'),
  ('Node.js',      'fa-brands fa-node-js',  'backend',  now() - interval '4 minutes'),
  ('TensorFlow AI','fa-solid fa-brain',     'backend',  now() - interval '3 minutes'),
  ('Redis',        'fa-solid fa-database',  'backend',  now() - interval '2 minutes'),
  ('Git',          'fa-brands fa-git-alt',  'tools',    now() - interval '1 minute'),
  ('GitHub',       'fa-brands fa-github',   'tools',    now())
) as v(name, icon_name, category, created_at)
where not exists (select 1 from public.skills);
