import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import type { ApiUser } from '@/lib/api';
import type { TaskForm } from './task-types';

type TaskFormDialogProps = {
  isOpen: boolean;
  editing: boolean;
  form: TaskForm;
  users: ApiUser[];
  onChange: (form: TaskForm) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export function TaskFormDialog({ isOpen, editing, form, users, onChange, onSubmit, onClose }: TaskFormDialogProps) {
  if (!isOpen) return null;

  return <div className="modal-backdrop" onClick={onClose}><form className="modal" onSubmit={onSubmit} onClick={(event) => event.stopPropagation()}>
    <div className="modal-heading"><div><p className="eyebrow">{editing ? 'Mise à jour' : 'Nouvelle activité'}</p><h2>{editing ? 'Modifier la tâche' : 'Créer une tâche'}</h2></div><button type="button" className="close-button" onClick={onClose} aria-label="Fermer"><X size={18} /></button></div>
    <label>Titre de la tâche<input autoFocus required value={form.title} onChange={(event) => onChange({ ...form, title: event.target.value })} placeholder="Ex. Préparer le compte rendu" /></label>
    <label>Description<textarea value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} placeholder="Ajoutez quelques détails" rows={4} /></label>
    <div className="form-grid"><label>Date de début<input required type="date" value={form.startDate} onChange={(event) => onChange({ ...form, startDate: event.target.value })} /></label><label>Date de fin<input required type="date" value={form.endDate} onChange={(event) => onChange({ ...form, endDate: event.target.value })} /></label></div>
    <label>Assigner à<select value={form.assigneeIds[0] ?? ''} onChange={(event) => onChange({ ...form, assigneeIds: event.target.value ? [event.target.value] : [] })}><option value="">Moi-même</option>{users.map((user) => <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>)}</select></label>
    <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Annuler</button><button type="submit" className="primary-button">{editing ? 'Enregistrer' : 'Créer la tâche'}</button></div>
  </form></div>;
}
