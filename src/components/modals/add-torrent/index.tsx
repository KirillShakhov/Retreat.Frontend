import { FC, useState, useEffect } from "react";
import { usePalette } from "../../../utils/themes/usePalette";
import './styles.css';

export interface FileNode {
    id: string;
    name: string;
    children?: FileNode[];
    checked?: boolean;
    indeterminate?: boolean;
}

interface AddTorrentModalProps {
    name: string;
    files: FileNode[];
    onClose: () => void;
    onAdd: (torrentName: string, selectedFiles: string[]) => void;
}

const AddTorrentModal: FC<AddTorrentModalProps> = ({ name, files: inFiles, onClose, onAdd }) => {
    const palette = usePalette();
    const [torrentName, setTorrentName] = useState(name);
    const [files, setFiles] = useState<FileNode[]>(inFiles);
    const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});

    const updateIndeterminateState = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
            if (node.children) {
                const updatedChildren = updateIndeterminateState(node.children);
                const allChecked = updatedChildren.every(child => child.checked);
                const someChecked = updatedChildren.some(child => child.checked || child.indeterminate);
                node.checked = allChecked;
                node.indeterminate = !allChecked && someChecked;
                node.children = updatedChildren;
            }
            return node;
        });
    };

    useEffect(() => {
        setFiles(prevFiles => updateIndeterminateState(prevFiles));
    }, []);

    const toggleCheckbox = (path: string[]) => {
        const toggle = (nodes: FileNode[], path: string[]): FileNode[] => {
            if (path.length === 0) return nodes;
            return nodes.map(node => {
                if (node.id === path[0]) {
                    if (path.length === 1) {
                        const checked = !node.checked;
                        return {
                            ...node,
                            checked,
                            indeterminate: false,
                            children: node.children ? node.children.map(child => ({ ...child, checked })) : node.children
                        };
                    }
                    return { ...node, children: toggle(node.children || [], path.slice(1)) };
                }
                return node;
            });
        };
        setFiles(prevFiles => {
            const updatedFiles = toggle(prevFiles, path);
            return updateIndeterminateState(updatedFiles);
        });
    };

    const handleAdd = () => {
        const getSelectedFiles = (nodes: FileNode[], parentPath: string = ''): string[] => {
            let selectedFiles: string[] = [];
            nodes.forEach(node => {
                const currentPath = parentPath ? `${parentPath}/${node.id}` : node.id;
                if (node.checked) {
                    selectedFiles.push(currentPath);
                }
                if (node.children) {
                    selectedFiles = selectedFiles.concat(getSelectedFiles(node.children, currentPath));
                }
            });
            return selectedFiles;
        };

        const selectedFiles = getSelectedFiles(files);
        onAdd(torrentName, selectedFiles);
    };

    const handleToggleCollapse = (path: string[]) => {
        const currentPath = path.join('-');
        setCollapsed(prevState => ({
            ...prevState,
            [currentPath]: !prevState[currentPath]
        }));
    };

    const renderTree = (nodes: FileNode[], path: string[] = []): React.ReactNode => {
        return (
            <ul style={{ listStyleType: 'none', paddingLeft: path.length ? '1em' : 0 }}>
                {nodes.map((node, index) => {
                    const currentPath = [...path, node.id];
                    const checkboxId = `checkbox-${currentPath.join('-')}`;
                    const isCollapsed = collapsed[currentPath.join('-')] || false;

                    return (
                        <li key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {node.children && (
                                    <span
                                        className={`toggle-arrow ${isCollapsed ? 'collapsed' : ''}`}
                                        onClick={() => handleToggleCollapse(currentPath)}
                                    >
                                        &#9662;
                                    </span>
                                )}
                                <div className="checkbox-wrapper-30" style={{ marginLeft: node.children ? '0' : '24px' }}>
                                    <span className="checkbox">
                                        <input
                                            type="checkbox"
                                            id={checkboxId}
                                            className={`${node.indeterminate ? 'indeterminate' : ''}`}
                                            checked={!!node.checked}
                                            onChange={() => toggleCheckbox(currentPath)}
                                        />
                                        <svg>
                                            <use xlinkHref="#checkbox-30" className="checkbox"></use>
                                        </svg>
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
                                        <symbol id="checkbox-30" viewBox="0 0 22 22">
                                            <path fill="none" stroke="currentColor" d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2" />
                                        </symbol>
                                    </svg>
                                </div>
                                <span
                                    style={{ marginLeft: '8px', verticalAlign: 'middle' }}
                                    onClick={() => handleToggleCollapse(currentPath)}
                                >
                                    {node.name}
                                </span>
                            </div>
                            {node.children && (
                                <div
                                    className={`collapsible ${isCollapsed ? '' : 'expanded'}`}
                                >
                                    {renderTree(node.children, currentPath)}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div style={{
            position: 'absolute',
            background: palette.backgroundColor,
            width: '80%',
            height: '80%',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: 'auto',
            padding: 20,
            borderRadius: 8,
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
        }}>
            <h2>Add Torrent</h2>
            <input
                type="text"
                value={torrentName}
                onChange={(e) => setTorrentName(e.target.value)}
                placeholder="Torrent Name"
                style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
            />
            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                {renderTree(files)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                <button onClick={onClose} style={{ padding: '10px 20px' }}>Close</button>
                <button onClick={handleAdd} style={{ padding: '10px 20px' }} className="burning-button">Add</button>
            </div>
        </div>
    );
};

export default AddTorrentModal;
