import { useEffect, useState } from 'react';
import API from "../../../helpers/api";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Row({ level, onEdit, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: level.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}
            className="d-flex justify-content-between align-items-center bg-white border rounded p-3 mb-2">
            <div className="d-flex align-items-center" {...listeners} style={{ cursor: 'grab', flex: 1 }}>
                <i className="fas fa-grip-vertical text-muted me-3"></i>
                <div>
                    <div className="fw-bold">{level.name}</div>
                    {level.code && <small className="text-muted">Code: {level.code}</small>}
                </div>
            </div>
            <div className="d-flex align-items-center" style={{ cursor: 'default' }}>
                <span className="badge bg-primary me-2">Level #{level.level_number}</span>
                <button
                    className="btn btn-outline-primary btn-xs me-1"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Edit button clicked for level:', level.name);
                        onEdit(level);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Edit level"
                    type="button"
                >
                    <i className="fas fa-edit"></i>
                </button>
                <button
                    className="btn btn-outline-danger btn-xs me-2"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Delete button clicked for level:', level.name);
                        onDelete(level);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Delete level"
                    type="button"
                >
                    <i className="fas fa-trash"></i>
                </button>
                <i className="fas fa-arrows-alt text-muted" style={{ cursor: 'grab' }}></i>
            </div>
        </div>
    );
}

const AdminLevels = () => {

    const [levels, setLevels] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingLevel, setEditingLevel] = useState(null);
    const [editName, setEditName] = useState('');

    async function load() {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            const response = await API.get('/levels');
            setLevels(response.data);
        } catch (err) {
            setError('Failed to load levels');
            console.error('Error loading levels:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function add() {
        if (!name.trim()) return;
        try {
            setLoading(true);
            setError(null);
            await API.post('/levels', { name });
            setName('');
            await load();
        } catch (err) {
            let errorMessage = 'Failed to add level';

            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            console.error('Error adding level:', err);
            console.error('Error response:', err.response?.data);
        } finally {
            setLoading(false);
        }
    }

    async function reorder(newOrder) {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            const ids = newOrder.map((l) => l.id);
            console.log('Reordering levels with IDs:', ids);
            const response = await API.post('/levels/reorder', { ids });
            console.log('Reorder response:', response.data);
            setSuccess('Levels reordered successfully!');
            await load();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            let errorMessage = 'Failed to reorder levels';

            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            if (errorMessage.includes('unique') || errorMessage.includes('constraint')) {
                errorMessage = 'Validation error: Level numbers must be unique. Please try again.';
            }

            setError(errorMessage);
            console.error('Error reordering levels:', err);
            console.error('Error response:', err.response?.data);
        } finally {
            setLoading(false);
        }
    }

    async function editLevel(level) {
        console.log('editLevel called with:', level);
        setEditingLevel(level);
        setEditName(level.name);
    }

    async function saveEdit() {
        if (!editName.trim() || !editingLevel) return;

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            await API.put(`/levels/${editingLevel.id}`, { name: editName });
            setSuccess('Level updated successfully!');
            setEditingLevel(null);
            setEditName('');
            await load();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            let errorMessage = 'Failed to update level';

            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            console.error('Error updating level:', err);
            console.error('Error response:', err.response?.data);
        } finally {
            setLoading(false);
        }
    }

    function cancelEdit() {
        setEditingLevel(null);
        setEditName('');
    }

    async function deleteLevel(level) {
        console.log('deleteLevel called with:', level);
        if (!window.confirm(`Are you sure you want to delete "${level.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            await API.delete(`/levels/${level.id}`);
            setSuccess('Level deleted successfully!');
            await load();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            let errorMessage = 'Failed to delete level';

            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            console.error('Error deleting level:', err);
            console.error('Error response:', err.response?.data);
        } finally {
            setLoading(false);
        }
    }

    return (
    <div className="container mt-5 pt-5">
            <div id="levels-section" className="content-section" style={{ marginTop: '2rem' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Facility Levels Management</h2>
                        <p className="text-muted mb-0">Manage facility classification levels</p>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h5 className="card-title">
                            <i className="fas fa-layer-group"></i>
                            Facility Levels List
                        </h5>
                    </div>
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success" role="alert">
                                <i className="fas fa-check-circle me-2"></i>
                                {success}
                            </div>
                        )}

                        {editingLevel && (
                            <div className="row justify-content-center mb-4">
                                <div className="col-lg-10 col-xl-8">
                                    <div className="card border-warning">
                                        <div className="card-header bg-warning text-dark">
                                            <h6 className="mb-0">
                                                <i className="fas fa-edit me-2"></i>
                                                Edit Level: {editingLevel.name}
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <label className="form-label">Level Name</label>
                                                    <input
                                                        className="form-control"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <div className="col-md-4 d-flex align-items-end gap-2">
                                                    <button
                                                        onClick={saveEdit}
                                                        className="btn btn-success"
                                                        disabled={loading || !editName.trim()}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-save me-2"></i>
                                                                Save
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="btn btn-secondary"
                                                        disabled={loading}
                                                    >
                                                        <i className="fas fa-times me-2"></i>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="row justify-content-center mb-4">
                            <div className="col-lg-10 col-xl-8">
                                <div className="row">
                                    <div className="col-md-8">
                                        <label className="form-label">Add New Level</label>
                                        <input
                                            className="form-control"
                                            placeholder="e.g., Health Center V"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="col-md-4 d-flex align-items-end">
                                        <button
                                            onClick={add}
                                            className="btn btn-primary"
                                            disabled={loading || !name.trim()}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-plus me-2"></i>
                                                    Add Level
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {loading && levels.length === 0 ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2 text-muted">Loading levels...</p>
                            </div>
                        ) : (
                            <div className="row justify-content-center">
                                <div className="col-lg-10 col-xl-8">
                                    <div className="bg-light p-3 rounded">
                                        <h6 className="mb-3">
                                            <i className="fas fa-sort me-2"></i>
                                            Drag to reorder levels
                                        </h6>
                                        <DndContext collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
                                            if (!over || active.id === over.id) return;

                                            const oldIndex = levels.findIndex((l) => l.id === active.id);
                                            const newIndex = levels.findIndex((l) => l.id === over.id);

                                            if (oldIndex === -1 || newIndex === -1) {
                                                console.error('Invalid drag operation: oldIndex or newIndex not found');
                                                return;
                                            }

                                            const arr = arrayMove(levels, oldIndex, newIndex);
                                            setLevels(arr);
                                            reorder(arr);
                                        }}>
                                            <SortableContext items={levels.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                                                {levels.map((l) => (<Row key={l.id} level={l} onEdit={editLevel} onDelete={deleteLevel} />))}
                                            </SortableContext>
                                        </DndContext>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLevels