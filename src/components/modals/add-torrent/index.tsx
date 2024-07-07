import { FC, useState, useEffect } from "react";
import { usePalette } from "../../../utils/themes/usePalette";
import './styles.css';

interface FileNode {
    name: string;
    children?: FileNode[];
    checked?: boolean;
    indeterminate?: boolean;
}

interface AddTorrentModalProps {
    onClose: () => void;
    onAdd: (torrentName: string, selectedFiles: string[]) => void;
}

const AddTorrentModal: FC<AddTorrentModalProps> = ({ onClose, onAdd }) => {
    const palette = usePalette();
    const [torrentName, setTorrentName] = useState("");
    const [files, setFiles] = useState<FileNode[]>([
        { name: "File1.mp4" },
        { name: "File2.mp4" },
        { name: "Folder1", children: [{ name: "File3.mp4" }, { name: "File4.mp4" }] },
    ]);
    const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
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

        setFiles(prevFiles => updateIndeterminateState(prevFiles));
    }, [files]);

    const toggleCheckbox = (path: string[]) => {
        const toggle = (nodes: FileNode[], path: string[]): FileNode[] => {
            if (path.length === 0) return nodes;
            return nodes.map(node => {
                if (node.name === path[0]) {
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
        setFiles(prevFiles => toggle(prevFiles, path));
    };

    const handleAdd = () => {
        const getSelectedFiles = (nodes: FileNode[], parentPath: string = ''): string[] => {
            let selectedFiles: string[] = [];
            nodes.forEach(node => {
                const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
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
                    const currentPath = [...path, node.name];
                    const checkboxId = `checkbox-${currentPath.join('-')}`;
                    const isCollapsed = collapsed[currentPath.join('-')] || false;
                    return (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
                            {node.children && (
                                <span
                                    className={`toggle-arrow ${isCollapsed ? 'collapsed' : ''}`}
                                    onClick={() => handleToggleCollapse(currentPath)}
                                >
                                    &#9662;
                                </span>
                            )}
                            <div className="checkbox-wrapper-30">
                                <span className="checkbox">
                                    <input
                                        type="checkbox"
                                        id={checkboxId}
                                        className={`${node.indeterminate ? 'indeterminate' : ''}`}
                                        checked={!!node.checked}
                                        onChange={() => toggleCheckbox(currentPath)}
                                        ref={el => {
                                            if (el) el.indeterminate = !!node.indeterminate;
                                        }}
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
                            <span style={{ marginLeft: '8px' }}>{node.name}</span>
                            {node.children && !isCollapsed && renderTree(node.children, currentPath)}
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
        }}>
            <h2>Add Torrent</h2>
            <div style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    value={torrentName}
                    onChange={(e) => setTorrentName(e.target.value)}
                    placeholder="Torrent Name"
                    style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
                />
            </div>
            <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: 20 }}>
                {renderTree(files)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                <button onClick={onClose} style={{ padding: '10px 20px' }}>Close</button>
                <button onClick={handleAdd} style={{ padding: '10px 20px' }}>Add</button>
            </div>
        </div>
    );
};

export default AddTorrentModal;
