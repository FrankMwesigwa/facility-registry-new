import { useEffect, useMemo, useState, Fragment } from 'react';
import { toast } from 'react-toastify';
import API from "../../../helpers/api";
import './styles.css'

const AdminUnits = () => {
    const [levels, setLevels] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [editingUnit, setEditingUnit] = useState(null);
    const [form, setForm] = useState({ name: '', code: '', levelId: '' });
    const [loading, setLoading] = useState(false);

    // Load levels and tree data
    async function loadLevels() {
        const response = await API.get('/levels');
        setLevels(response.data);
    }

    async function loadTreeData() {
        const response = await API.get('/units/tree');
        setTreeData(response.data.tree);
    }

    useEffect(() => { 
        loadLevels(); 
        loadTreeData();
    }, []);

    // Get available levels for the selected parent
    const availableLevels = useMemo(() => {
        if (!selectedUnit) {
            // If no parent selected, show all levels
            return levels.sort((a, b) => a.level_number - b.level_number);
        }
        
        // Find the selected unit's level
        const selectedLevel = levels.find(l => l.id === selectedUnit.levelId);
        if (!selectedLevel) return [];
        
        // Find the next level (child level)
        const nextLevel = levels.find(l => l.level_number === selectedLevel.level_number + 1);
        return nextLevel ? [nextLevel] : [];
    }, [selectedUnit, levels]);

    // Handle unit selection from tree
    const handleUnitSelect = (unit) => {
        setSelectedUnit(unit);
        setEditingUnit(null);
        setForm({ name: '', code: '', levelId: '' });
    }

    // Handle edit unit
    const handleEditUnit = (unit, event) => {
        event.stopPropagation();
        setEditingUnit(unit);
        setSelectedUnit(null);
        setForm({ 
            name: unit.name, 
            code: unit.code || '', 
            levelId: unit.levelId 
        });
    }

    // Handle adding/editing unit
    async function submit(e) {
        e.preventDefault();
        if (!form.name.trim()) return;
        
        setLoading(true);
        try {
            if (editingUnit) {
                // Update existing unit
                await API.put(`/units/${editingUnit.id}`, {
                    name: form.name,
                    code: form.code || undefined,
                });
                
                toast.success('Admin unit updated successfully!');
            } else {
                // Add new unit
                const parentId = selectedUnit ? selectedUnit.id : null;
                const levelId = form.levelId || (availableLevels.length === 1 ? availableLevels[0].id : null);
                
                await API.post('/units', {
                    name: form.name,
                    code: form.code || undefined,
                    levelId: Number(levelId),
                    parentId: parentId ? Number(parentId) : null,
                });
                
                toast.success('Admin unit added successfully!');
            }
            
            // Reset form and reload data
            setForm({ name: '', code: '', levelId: '' });
            setEditingUnit(null);
            setSelectedUnit(null);
            await loadTreeData();
            
        } catch (error) {
            console.error('Error saving unit:', error);
            const action = editingUnit ? 'updating' : 'adding';
            toast.error(`Error ${action} admin unit: ` + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    }

    // Handle deleting unit
    async function remove(id, event) {
        event.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this unit? This action cannot be undone.')) return;
        
        try {
            await API.delete(`/units/${id}`);
            await loadTreeData();
            
            // Clear selections if deleted unit was selected
            if (selectedUnit && selectedUnit.id === id) {
                setSelectedUnit(null);
            }
            if (editingUnit && editingUnit.id === id) {
                setEditingUnit(null);
                setForm({ name: '', code: '', levelId: '' });
            }
            
            toast.success('Admin unit deleted successfully!');
        } catch (error) {
            console.error('Error deleting unit:', error);
            toast.error('Error deleting admin unit: ' + (error.response?.data?.error || error.message));
        }
    }

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditingUnit(null);
        setSelectedUnit(null);
        setForm({ name: '', code: '', levelId: '' });
    }

    // Tree component
    const TreeNode = ({ unit, level = 0 }) => {
        // MOH unit (id: 1) should be open by default, others closed
        const [isExpanded, setIsExpanded] = useState(unit.id === 1);
        const hasChildren = unit.children && unit.children.length > 0;
        
        return (
            <div className="tree-node">
                <div 
                    className={`tree-item ${selectedUnit?.id === unit.id ? 'selected' : ''}`}
                    style={{ paddingLeft: `${level * 20 + 10}px` }}
                    onClick={() => {
                        handleUnitSelect(unit);
                        // Expand the node when selected
                        if (hasChildren) {
                            setIsExpanded(true);
                        }
                    }}
                >
                    {hasChildren && (
                        <span 
                            className="tree-toggle"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                        >
                            {isExpanded ? '▼' : '▶'}
                        </span>
                    )}
                    <span className="tree-icon">
                        {hasChildren ? '📁' : '📄'}
                    </span>
                    <span className="tree-label">{unit.name}</span>
                    <span className="tree-code">{unit.code && `(${unit.code})`}</span>
                    <div className="tree-actions">
                        <button 
                            className="tree-edit"
                            onClick={(e) => handleEditUnit(unit, e)}
                            title="Edit unit"
                        >
                            ✏️
                        </button>
                        <button 
                            className="tree-delete"
                            onClick={(e) => remove(unit.id, e)}
                            title="Delete unit"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
                {hasChildren && isExpanded && (
                    <div className="tree-children">
                        {unit.children.map(child => (
                            <TreeNode key={child.id} unit={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Fragment>
            <div className="container admin-units-container">
                <div className="admin-units-card">
                    <div className="admin-layout">
                        {/* Left Sidebar - Tree Structure */}
                        <div className="tree-sidebar">
                            <div className="tree-header">
                                <h3>Admin Units</h3>
                                <button 
                                    className="add-root-btn"
                                    onClick={() => setSelectedUnit(null)}
                                >
                                    + Add Root Unit
                                </button>
                            </div>
                            <div className="tree-container">
                                {treeData.length === 0 ? (
                                    <div className="tree-empty">
                                        <p>No admin units found</p>
                                        <p>Click "Add Root Unit" to get started</p>
                                    </div>
                                ) : (
                                    treeData.map(unit => (
                                        <TreeNode key={unit.id} unit={unit} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Content - Form */}
                        <div className="form-content">
                            <div className="form-header">
                                <h3>
                                    {editingUnit 
                                        ? `Edit Unit: "${editingUnit.name}"`
                                        : selectedUnit 
                                            ? `Add Child Unit to "${selectedUnit.name}"` 
                                            : 'Add Root Unit'
                                    }
                                </h3>
                                {editingUnit ? (
                                    <div className="editing-unit">
                                        <strong>Editing:</strong> {editingUnit.name}
                                        {editingUnit.code && ` (${editingUnit.code})`}
                                    </div>
                                ) : selectedUnit && (
                                    <div className="selected-parent">
                                        <strong>Parent:</strong> {selectedUnit.name}
                                        {selectedUnit.code && ` (${selectedUnit.code})`}
                                    </div>
                                )}
                            </div>

                            <form onSubmit={submit} className="unit-form">
                                <div className="form-group">
                                    <label htmlFor="name">Unit Name *</label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="form-input"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Enter unit name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="code">Code (Optional)</label>
                                    <input
                                        id="code"
                                        type="text"
                                        className="form-input"
                                        value={form.code}
                                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                                        placeholder="Enter unit code"
                                    />
                                </div>

                                {!editingUnit && availableLevels.length > 1 && (
                                    <div className="form-group">
                                        <label htmlFor="level">Level *</label>
                                        <select
                                            id="level"
                                            className="form-select"
                                            value={form.levelId}
                                            onChange={(e) => setForm({ ...form, levelId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select level...</option>
                                            {availableLevels.map(level => (
                                                <option key={level.id} value={level.id}>
                                                    {level.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {!editingUnit && availableLevels.length === 0 && selectedUnit && (
                                    <div className="form-info">
                                        <p>⚠️ No child levels available for this parent unit.</p>
                                        <p>You may need to create additional levels first.</p>
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button 
                                        type="submit" 
                                        className="submit-btn"
                                        disabled={loading || (!editingUnit && availableLevels.length === 0)}
                                    >
                                        {loading 
                                            ? (editingUnit ? 'Updating...' : 'Adding...') 
                                            : (editingUnit ? 'Update Unit' : 'Add Unit')
                                        }
                                    </button>
                                    {(selectedUnit || editingUnit) && (
                                        <button 
                                            type="button" 
                                            className="cancel-btn"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AdminUnits