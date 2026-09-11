import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import './Admin.css';

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้องครับ');
      setLoading(false);
    } else {
      // Success, onAuthStateChange in Dashboard will catch it
      onLogin();
    }
  };

  return (
    <div className="admin-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="admin-message-card" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            background: 'rgba(184, 93, 56, 0.15)', color: '#b85d38',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ margin: 0, color: '#fff' }}>เข้าสู่ระบบหลังบ้าน</h2>
          <p style={{ color: '#a1a1aa', marginTop: '8px', fontSize: '14px' }}>
            เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: '#71717a' }} />
            <input 
              type="email" 
              placeholder="อีเมล (Email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 12px 12px 42px', borderRadius: '8px',
                background: '#111', border: '1px solid #27272a', color: '#fff',
                fontSize: '15px', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '14px', left: '14px', color: '#71717a' }} />
            <input 
              type="password" 
              placeholder="รหัสผ่าน (Password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 12px 12px 42px', borderRadius: '8px',
                background: '#111', border: '1px solid #27272a', color: '#fff',
                fontSize: '15px', boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: '#b85d38', color: '#fff', border: 'none',
              padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'} <ArrowRight size={18} />
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ color: '#71717a', fontSize: '14px', textDecoration: 'none' }}>
            กลับหน้าเว็บหลัก
          </a>
        </div>
      </div>
    </div>
  );
}
