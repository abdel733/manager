import { FormEvent, useState } from 'react';
import { CheckCircle2, MessageSquare, X } from 'lucide-react';
import type { ApiUser } from '@/lib/api';
import type { Task } from './task-types';

const statusStyles: Record<Task['status'], string> = { 'En attente': 'status-waiting', 'En cours': 'status-active', Terminé: 'status-done', 'En retard': 'status-late' };

type TaskDetailPanelProps = {
  task: Task;
  currentUser: ApiUser | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (task: Task) => void;
  onAddComment: (task: Task, content: string) => Promise<void>;
};

function StatusBadge({ status }: { status: Task['status'] }) {
  return <span className={`status-badge ${statusStyles[status]}`}><span className="status-dot" />{status}</span>;
}

function initials(user: Pick<ApiUser, 'firstName' | 'lastName'>) {
  return `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`;
}

export function TaskDetailPanel({ task, currentUser, onClose, onEdit, onDelete, onComplete, onAddComment }: TaskDetailPanelProps) {
  const [comment, setComment] = useState('');
  const [isSending, setIsSending] = useState(false);

  async function submitComment(event?: FormEvent) {
    event?.preventDefault();
    if (!comment.trim() || isSending) return;
    setIsSending(true);
    try {
      await onAddComment(task, comment.trim());
      setComment('');
    } finally {
      setIsSending(false);
    }
  }

  return <aside className="detail-panel">
    <div className="detail-top"><span className="eyebrow">Détail de la tâche</span><button className="close-button" onClick={onClose} aria-label="Fermer"><X size={18} /></button></div>
    <div className="detail-title"><span className="task-color" style={{ backgroundColor: task.color }} /><h2>{task.title}</h2></div>
    <StatusBadge status={task.status} />
    <div className="detail-block"><span className="detail-label">Description</span><p>{task.description || 'Aucune description pour cette tâche.'}</p></div>
    <div className="detail-meta">
      <div><span className="detail-label">Personnes associées</span><div className="detail-assignees">{task.assignees.length ? task.assignees.map((user) => <span className="detail-person" key={user.id}><span className="assignee-avatar" style={{ backgroundColor: task.color }}>{initials(user)}</span>{user.firstName} {user.lastName}</span>) : <span className="detail-empty">Aucune personne associée</span>}</div></div>
      <div><span className="detail-label">Échéance</span><strong>{task.dueLabel}</strong></div>
      <div><span className="detail-label">Projet</span><strong>{task.project}</strong></div>
    </div>
    <div className="detail-comments">
      <div className="detail-comments-heading"><span className="detail-label">Commentaires</span><span>{task.comments.length}</span></div>
      <div className="comments-list">{task.comments.length ? task.comments.map((item) => <div className="comment" key={item.id}><span className="assignee-avatar" style={{ backgroundColor: task.color }}>{initials(item.user)}</span><div><strong>{item.user.firstName} {item.user.lastName}</strong><p>{item.content}</p><small>{new Date(item.createdAt).toLocaleDateString('fr-FR')}</small></div></div>) : <p className="detail-empty">Aucun commentaire pour le moment.</p>}</div>
      <form className="comment-input" onSubmit={submitComment}><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Ajouter un commentaire..." disabled={isSending} /><button type="submit" aria-label="Envoyer" disabled={isSending}><MessageSquare size={16} /></button></form>
    </div>
    {currentUser?.role === 'ADMIN' && <div className="detail-actions"><button className="secondary-button" onClick={() => onEdit(task)}>Modifier</button><button className="danger-button" onClick={() => onDelete(task)}>Supprimer</button></div>}
    {task.status !== 'Terminé' && <button className="complete-button" onClick={() => onComplete(task)}><CheckCircle2 size={17} />Marquer comme terminée</button>}
  </aside>;
}
