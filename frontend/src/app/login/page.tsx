'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@acme.test');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api.login(email, password);
      window.localStorage.setItem('manager-token', result.accessToken);
      window.localStorage.setItem('manager-user', JSON.stringify(result.user));
      router.push('/');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Connexion impossible');
    } finally {
      setLoading(false);
    }
  }

  return <main className="login-shell"><div className="login-art"><div className="brand login-brand"><div className="brand-mark">M</div><span>mosaïque</span></div><div className="login-art-copy"><p className="eyebrow">Gestion du travail d&apos;équipe</p><h1>Tout le travail important, au même endroit.</h1><p>Coordonnez vos équipes, suivez les délais et transformez les priorités en résultats.</p></div><div className="login-art-footer"><span><ShieldCheck size={15} /> Espace sécurisé</span><span>Acme Corporation</span></div></div><section className="login-card"><div className="login-card-heading"><p className="eyebrow">Bienvenue</p><h2>Connexion à votre espace</h2><p>Utilisez vos identifiants professionnels pour continuer.</p></div><form onSubmit={login} className="login-form"><label>Email professionnel<div className="input-with-icon"><Mail size={17} /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div></label><label>Mot de passe<div className="input-with-icon"><LockKeyhole size={17} /><input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></div></label>{error && <p className="login-error">{error}</p>}<button className="primary-button login-button" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}<ArrowRight size={17} /></button></form><p className="login-help">Compte administrateur de démonstration: admin@acme.test / Admin123!</p></section></main>;
}
