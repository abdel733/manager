'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, ChevronDown, CircleDashed, Clock3, LayoutDashboard, ListTodo, MessageSquare, MoreHorizontal, Plus, Search, Settings, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useRouter } from 'next/navigation';
import { api, ApiTask, ApiUser } from '@/lib/api';
import { TaskDetailPanel } from './components/TaskDetailPanel';
import { TaskFormDialog } from './components/TaskFormDialog';
import type { Status, Task, TaskForm } from './components/task-types';

const initialTasks: Task[] = [
  { id: 1, title: 'Préparer le rapport trimestriel', description: '', project: 'Finance', assignee: 'Sophie Martin', assignees: [], initials: 'SM', status: 'En cours', due: '2026-09-26', dueLabel: 'Demain', priority: 'Haute', color: '#ef8b61', comments: [] },
  { id: 2, title: 'Mettre à jour la page tarifs', description: '', project: 'Marketing', assignee: 'Thomas Bernard', assignees: [], initials: 'TB', status: 'En attente', due: '2026-09-29', dueLabel: '29 sept.', priority: 'Moyenne', color: '#6c7ee8', comments: [] },
  { id: 3, title: 'Corriger le parcours de paiement', description: '', project: 'Produit', assignee: 'Nina Moreau', assignees: [], initials: 'NM', status: 'En retard', due: '2026-09-22', dueLabel: '22 sept.', priority: 'Haute', color: '#4cae8d', comments: [] },
  { id: 4, title: 'Valider les contrats fournisseurs', description: '', project: 'Opérations', assignee: 'Lucas Petit', assignees: [], initials: 'LP', status: 'Terminé', due: '2026-09-21', dueLabel: '21 sept.', priority: 'Basse', color: '#e3ae55', comments: [] },
  { id: 5, title: 'Planifier la revue produit', description: '', project: 'Produit', assignee: 'Sophie Martin', assignees: [], initials: 'SM', status: 'En cours', due: '2026-09-30', dueLabel: '30 sept.', priority: 'Moyenne', color: '#ef8b61', comments: [] },
];

const teamData = [{ name: 'Sophie', done: 14, active: 5 }, { name: 'Thomas', done: 11, active: 7 }, { name: 'Nina', done: 9, active: 6 }, { name: 'Lucas', done: 8, active: 4 }, { name: 'Emma', done: 6, active: 3 }];

const statusStyles: Record<Status, string> = { 'En attente': 'status-waiting', 'En cours': 'status-active', Terminé: 'status-done', 'En retard': 'status-late' };

const statusMap = { PENDING: 'En attente', IN_PROGRESS: 'En cours', COMPLETED: 'Terminé', OVERDUE: 'En retard' } as const;

function mapTask(task: ApiTask): Task {
  const assignees = (task.assignments ?? []).flatMap((assignment) => assignment.user ? [assignment.user] : []);
  const assignee = assignees[0];
  const endDate = new Date(task.endDate);
  return { id: task.id, title: task.title, description: task.description ?? '', project: 'Espace de travail', assignee: assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Non assignée', assignees, initials: assignee ? `${assignee.firstName[0]}${assignee.lastName[0]}` : '--', status: statusMap[task.status], due: task.endDate, dueLabel: endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), priority: 'Standard', color: '#6272d9', comments: task.comments ?? [] };
}

function StatusBadge({ status }: { status: Status }) {
  return <span className={`status-badge ${statusStyles[status]}`}><span className="status-dot" />{status}</span>;
}

function WorkspaceSection({ view, tasks, users, onSelectTask, onCreateTask }: { view: string; tasks: Task[]; users: ApiUser[]; onSelectTask: (task: Task) => void; onCreateTask: () => void }) {
  const comments = tasks.filter((task) => task.comments.length > 0);

  if (view === 'Équipe') {
    return <div className="page-content"><div className="page-heading"><div><p className="eyebrow">Organisation</p><h1>Votre équipe</h1><p className="heading-copy">Retrouvez les membres de votre espace de travail.</p></div></div><section className="panel"><div className="panel-heading"><div><h2>Membres de l’équipe</h2><p>{users.length} membre{users.length > 1 ? 's' : ''} actif{users.length > 1 ? 's' : ''}</p></div></div><div className="task-table">{users.map((user) => <div className="task-row" key={user.id}><span className="task-name"><span className="assignee-avatar" style={{ backgroundColor: '#6272d9' }}>{user.firstName[0]}{user.lastName[0]}</span><span><strong>{user.firstName} {user.lastName}</strong><small>{user.email}</small></span></span><span>{user.role === 'ADMIN' ? 'Administrateur' : 'Membre'}</span><span /></div>)}</div></section></div>;
  }

  if (view === 'Commentaires') {
    return <div className="page-content"><div className="page-heading"><div><p className="eyebrow">Collaboration</p><h1>Commentaires</h1><p className="heading-copy">Les tâches qui contiennent des échanges avec votre équipe.</p></div></div><section className="panel"><div className="panel-heading"><div><h2>Activité récente</h2><p>{comments.length} tâche{comments.length > 1 ? 's' : ''} avec des commentaires</p></div></div><div className="task-table">{comments.length ? comments.map((task) => <button className="task-row" key={task.id} onClick={() => onSelectTask(task)}><span className="task-name"><span className="task-color" style={{ backgroundColor: task.color }} /><span><strong>{task.title}</strong><small>{task.project}</small></span></span><span className="assignee"><MessageSquare size={16} />{task.comments.length} commentaire{task.comments.length > 1 ? 's' : ''}</span><MoreHorizontal size={18} /></button>) : <p className="heading-copy">Aucun commentaire pour le moment.</p>}</div></section></div>;
  }

  const isMine = view === 'Mes tâches';
  const displayedTasks = isMine ? tasks.filter((task) => task.assignee.includes('Julie')) : tasks;
  return <div className="page-content"><div className="page-heading"><div><p className="eyebrow">Espace de travail</p><h1>{isMine ? 'Mes tâches' : 'Paramètres'}</h1><p className="heading-copy">{isMine ? 'Les tâches qui vous sont assignées.' : 'Configurez votre espace de travail.'}</p></div>{isMine && <button className="primary-button" onClick={onCreateTask}><Plus size={18} />Nouvelle tâche</button>}</div>{isMine ? <section className="tasks-section"><div className="section-heading"><div><h2>Toutes mes tâches</h2><p>{displayedTasks.length} tâche{displayedTasks.length > 1 ? 's' : ''}</p></div></div><div className="task-table">{displayedTasks.map((task) => <button className="task-row" key={task.id} onClick={() => onSelectTask(task)}><span className="task-name"><span className="task-color" style={{ backgroundColor: task.color }} /><span><strong>{task.title}</strong><small>{task.project} · {task.priority}</small></span></span><StatusBadge status={task.status} /><span className="due">{task.dueLabel}</span><MoreHorizontal size={18} /></button>)}</div></section> : <section className="panel"><div className="panel-heading"><div><h2>Préférences de l’espace</h2><p>Les paramètres seront bientôt disponibles.</p></div></div></section>}</div>;
}

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [activeNav, setActiveNav] = useState('Vue d’ensemble');
  const [navigationReady, setNavigationReady] = useState(false);
  const [filter, setFilter] = useState<Status | 'Toutes'>('Toutes');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [form, setForm] = useState<TaskForm>({ title: '', description: '', startDate: '2026-09-25', endDate: '2026-09-30', assigneeIds: [] });
  const visibleTasks = useMemo(() => filter === 'Toutes' ? tasks : tasks.filter((task) => task.status === filter), [filter, tasks]);
  const taskCounts = useMemo(() => tasks.reduce<Record<Status, number>>((counts, task) => { counts[task.status] += 1; return counts; }, { 'En attente': 0, 'En cours': 0, Terminé: 0, 'En retard': 0 }), [tasks]);
  const chartData = [{ name: 'En attente', value: taskCounts['En attente'], color: '#e7e9ee' }, { name: 'En cours', value: taskCounts['En cours'], color: '#6272d9' }, { name: 'Terminé', value: taskCounts.Terminé, color: '#4cae8d' }, { name: 'En retard', value: taskCounts['En retard'], color: '#e77b68' }];

  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get('view');
    if (view) setActiveNav(view);
    setNavigationReady(true);
  }, []);

  useEffect(() => {
    if (!navigationReady) return;
    const url = new URL(window.location.href);
    if (activeNav === 'Vue d’ensemble') url.searchParams.delete('view');
    else url.searchParams.set('view', activeNav);
    window.history.replaceState({}, '', url);
  }, [activeNav, navigationReady]);

  useEffect(() => {
    const storedUser = window.localStorage.getItem('manager-user');
    const user = storedUser ? JSON.parse(storedUser) as ApiUser : null;
    if (!user) {
      router.replace('/login');
      return;
    }
    Promise.all([api.tasks(user?.role === 'ADMIN' ? undefined : user?.id), api.users()]).then(([remoteTasks, remoteUsers]) => {
      setCurrentUser(user);
      const mappedTasks = remoteTasks.map(mapTask);
      setTasks(mappedTasks);
      setUsers(remoteUsers);
      setApiReady(true);
    }).catch(() => setApiReady(false));
  }, [router]);

  function markComplete(task: Task) {
    if (apiReady && currentUser) api.updateStatus(String(task.id), 'COMPLETED', currentUser.id).then(() => setApiReady(true)).catch(() => undefined);
    const completed = { ...task, status: 'Terminé' as const };
    setTasks((current) => current.map((item) => item.id === task.id ? completed : item));
    setSelectedTask(completed);
  }

  async function createTask(event: FormEvent) {
    event.preventDefault();
    if (!currentUser || !form.title.trim()) return;
    if (editingTaskId) {
      const task = await api.updateTask(editingTaskId, form);
      const mapped = mapTask(task);
      setTasks((current) => current.map((item) => item.id === editingTaskId ? mapped : item));
      setSelectedTask(mapped);
      setIsCreateOpen(false);
      setEditingTaskId(null);
      return;
    }
    const task = await api.createTask({ ...form, creatorId: currentUser.id, assigneeIds: form.assigneeIds.length ? form.assigneeIds : [currentUser.id] });
    const mapped = mapTask(task);
    setTasks((current) => [mapped, ...current]);
    setSelectedTask(mapped);
    setIsCreateOpen(false);
    setForm({ title: '', description: '', startDate: '2026-09-25', endDate: '2026-09-30', assigneeIds: [] });
  }

  function openCreate() {
    setEditingTaskId(null);
    setForm({ title: '', description: '', startDate: '2026-09-25', endDate: '2026-09-30', assigneeIds: [] });
    setIsCreateOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTaskId(String(task.id));
    setForm({ title: task.title, description: task.description, startDate: '2026-09-25', endDate: task.due, assigneeIds: task.assignees.map((user) => user.id) });
    setIsCreateOpen(true);
  }

  async function deleteTask(task: Task) {
    if (!window.confirm('Supprimer cette tâche ?')) return;
    await api.deleteTask(String(task.id));
    setTasks((current) => current.filter((item) => item.id !== task.id));
    setSelectedTask(null);
  }

  async function addComment(task: Task, content: string) {
    if (!currentUser) return;
    await api.addComment(String(task.id), currentUser.id, content);
    const refreshed = mapTask(await api.task(String(task.id)));
    setTasks((current) => current.map((item) => item.id === task.id ? refreshed : item));
    setSelectedTask(refreshed);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">M</div><span>mosaïque</span></div>
        <div className="workspace-switcher"><div className="workspace-avatar">AC</div><div><strong>Acme Corp.</strong><small>Mon espace de travail</small></div><ChevronDown size={15} /></div>
        <nav className="main-nav">
          <p className="nav-label">Espace de travail</p>
          {[['Vue d’ensemble', LayoutDashboard], ['Mes tâches', ListTodo], ['Équipe', Users]].map(([label, Icon]) => <button key={label as string} className={activeNav === label ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(label as string)}><Icon size={18} />{label as string}</button>)}
          <p className="nav-label nav-label-spaced">Gestion</p>
          <button className="nav-item" onClick={() => setActiveNav('Commentaires')}><MessageSquare size={18} />Commentaires<span className="nav-count">8</span></button>
          <button className="nav-item" onClick={() => setActiveNav('Paramètres')}><Settings size={18} />Paramètres</button>
        </nav>
        <div className="sidebar-bottom"><div className="support-card"><span>Besoin d’aide ?</span><small>Consultez notre centre de ressources</small><button>Ouvrir le centre</button></div><div className="profile"><div className="profile-avatar">JD</div><div><strong>Julie Dupont</strong><small>Administratrice</small></div><MoreHorizontal size={18} /></div></div>
      </aside>

      <section className="content-area">
        <header className="topbar"><div className="breadcrumb"><span>Acme Corp.</span><span>/</span><strong>{activeNav}</strong></div><div className="top-actions"><div className="search-box"><Search size={17} /><input aria-label="Rechercher" placeholder="Rechercher" /></div><button className="icon-button" aria-label="Notifications"><Bell size={19} /><span className="notification-dot" /></button><button className="avatar-small">JD</button></div></header>
        <div className="page-content">
          {activeNav === 'Vue d’ensemble' ? <>
          <div className="page-heading"><div><p className="eyebrow">Lundi 25 septembre 2026</p><h1>Bonjour {currentUser?.firstName ?? 'Julie'}, <span>voici votre espace.</span></h1><p className="heading-copy">Suivez l’activité de votre équipe et gardez vos priorités sous contrôle.</p></div><button className="primary-button" onClick={openCreate}><Plus size={18} />Nouvelle tâche</button></div>
          <section className="metric-grid"><div className="metric-card"><div className="metric-icon orange"><ListTodo size={19} /></div><div><span>Tâches totales</span><strong>{tasks.length}</strong><small className="trend positive">Données en direct</small></div></div><div className="metric-card"><div className="metric-icon blue"><Clock3 size={19} /></div><div><span>En cours</span><strong>{taskCounts['En cours']}</strong><small className="trend positive">Données en direct</small></div></div><div className="metric-card"><div className="metric-icon green"><CheckCircle2 size={19} /></div><div><span>Terminées</span><strong>{taskCounts.Terminé}</strong><small className="trend positive">Données en direct</small></div></div><div className="metric-card"><div className="metric-icon red"><CircleDashed size={19} /></div><div><span>En retard</span><strong>{taskCounts['En retard']}</strong><small className="trend negative">Données en direct</small></div></div></section>

          <section className="charts-grid"><div className="panel status-panel"><div className="panel-heading"><div><h2>Répartition des tâches</h2><p>Vue globale de l’avancement</p></div><button className="select-button">Cette semaine <ChevronDown size={15} /></button></div><div className="donut-layout"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="value" innerRadius={62} outerRadius={86} paddingAngle={3} stroke="none">{chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="donut-total"><strong>71</strong><span>Tâches</span></div></div><div className="legend-list">{chartData.map((item) => <div className="legend-item" key={item.name}><span className="legend-color" style={{ backgroundColor: item.color }} /><span>{item.name}</span><strong>{item.value}</strong></div>)}</div></div></div><div className="panel team-panel"><div className="panel-heading"><div><h2>Performance de l’équipe</h2><p>Tâches terminées et en cours</p></div><button className="icon-button subtle" aria-label="Plus d’options"><MoreHorizontal size={19} /></button></div><ResponsiveContainer width="100%" height={190}><BarChart data={teamData} barGap={5} margin={{ top: 12, right: 5, left: -25, bottom: 0 }}><CartesianGrid vertical={false} stroke="#edf0f3" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#87909d', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#87909d', fontSize: 11 }} /><Tooltip cursor={{ fill: '#f5f6f8' }} /><Bar dataKey="done" name="Terminées" fill="#4cae8d" radius={[4, 4, 0, 0]} barSize={10} /><Bar dataKey="active" name="En cours" fill="#6272d9" radius={[4, 4, 0, 0]} barSize={10} /></BarChart></ResponsiveContainer><div className="chart-footnote"><span><i className="legend-color green-bg" />Terminées</span><span><i className="legend-color blue-bg" />En cours</span></div></div></section>

          <section className="tasks-section"><div className="section-heading"><div><h2>Tâches récentes</h2><p>Les dernières activités de votre espace</p></div><button className="text-button">Voir toutes les tâches <span>→</span></button></div><div className="task-toolbar"><div className="filter-tabs">{(['Toutes', 'En attente', 'En cours', 'Terminé', 'En retard'] as const).map((tab) => <button key={tab} className={filter === tab ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter(tab)}>{tab}{tab === 'Toutes' && <span>71</span>}</button>)}</div><button className="filter-button"><span>Filtrer</span><ChevronDown size={15} /></button></div><div className="task-table"><div className="task-table-head"><span>Tâche</span><span>Assignée à</span><span>Statut</span><span>Échéance</span><span /></div>{visibleTasks.map((task) => <button className="task-row" key={task.id} onClick={() => setSelectedTask(task)}><span className="task-name"><span className="task-color" style={{ backgroundColor: task.color }} /><span><strong>{task.title}</strong><small>{task.project} <span>·</span> {task.priority}</small></span></span><span className="assignee"><span className="assignee-avatar" style={{ backgroundColor: task.color }}>{task.initials}</span>{task.assignee}</span><StatusBadge status={task.status} /><span className={task.status === 'En retard' ? 'due late' : 'due'}>{task.dueLabel}</span><MoreHorizontal size={18} className="row-more" /></button>)}</div></section>
          </> : <WorkspaceSection view={activeNav} tasks={tasks} users={users} onSelectTask={setSelectedTask} onCreateTask={openCreate} />}
        </div>
      </section>

      {selectedTask && <TaskDetailPanel task={selectedTask} currentUser={currentUser} onClose={() => setSelectedTask(null)} onEdit={openEdit} onDelete={deleteTask} onComplete={markComplete} onAddComment={addComment} />}
      <TaskFormDialog isOpen={isCreateOpen} editing={Boolean(editingTaskId)} form={form} users={users} onChange={setForm} onSubmit={createTask} onClose={() => setIsCreateOpen(false)} />
    </main>
  );
}
