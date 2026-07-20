import { motion } from 'motion/react'
import { useState } from 'react'
import { ConnectionCard } from '../ConnectionCard'

interface FsFile {
  name: string
  inode: number
  deleted: boolean
  blocksOnDisk: boolean
}

interface FsDir {
  name: string
  files: FsFile[]
}

const INITIAL_TREE: FsDir[] = [
  {
    name: 'Documents',
    files: [
      { name: 'notes.txt', inode: 42, deleted: false, blocksOnDisk: true },
    ],
  },
  {
    name: 'Downloads',
    files: [
      { name: 'archive.zip', inode: 57, deleted: false, blocksOnDisk: true },
    ],
  },
  {
    name: 'Desktop',
    files: [],
  },
]

let nextInode = 100

export function OSFilesystem({ onComplete }: { onComplete: () => void }) {
  const [tree, setTree] = useState<FsDir[]>(INITIAL_TREE)
  const [newFileName, setNewFileName] = useState('')
  const [targetDir, setTargetDir] = useState('Documents')
  const [freeBlocks, setFreeBlocks] = useState(1024)
  const [didCreate, setDidCreate] = useState(false)
  const [didDelete, setDidDelete] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const createFile = () => {
    const trimmed = newFileName.trim()
    if (!trimmed) return
    const inode = nextInode++
    setTree((prev) =>
      prev.map((d) =>
        d.name === targetDir
          ? { ...d, files: [...d.files, { name: trimmed, inode, deleted: false, blocksOnDisk: true }] }
          : d,
      ),
    )
    setFreeBlocks((b) => b - 4)
    setNewFileName('')
    setDidCreate(true)
    setFeedback(`Created "${trimmed}" with inode ${inode}`)
  }

  const deleteFile = (dirName: string, inode: number, fileName: string) => {
    setTree((prev) =>
      prev.map((d) =>
        d.name === dirName
          ? {
              ...d,
              files: d.files.map((f) =>
                f.inode === inode ? { ...f, deleted: true, blocksOnDisk: true } : f,
              ),
            }
          : d,
      ),
    )
    // Free space only updates when blocks overwritten — not on deletion
    setFeedback(
      `"${fileName}" (inode ${inode}) deleted — directory entry removed. Blocks still on disk.`,
    )
    setDidDelete(true)
    setShowCard(true)
  }

  const done = didCreate && didDelete

  return (
    <div className="lesson-panel">
      <p className="lede">
        Files are not stored by name — they are stored by <strong>inode number</strong>. A directory is just a
        table mapping names to inodes. When you delete a file, the directory entry is removed but the inode and
        disk blocks stay until something overwrites them.
      </p>

      <div className="os-fs-board">
        <div className="os-fs-tree">
          <span className="os-fs-tree-root">/ → home → user</span>
          {tree.map((dir) => (
            <div key={dir.name} className="os-fs-dir">
              <span className="os-fs-dir-name">📁 {dir.name}/</span>
              <div className="os-fs-files">
                {dir.files.length === 0 && <span className="micro">empty</span>}
                {dir.files.map((file) => (
                  <motion.div
                    key={file.inode}
                    className={`os-fs-file ${file.deleted ? 'os-fs-file--deleted' : ''}`}
                    animate={{ opacity: file.deleted ? 0.5 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="os-fs-file-icon">📄</span>
                    <span className="os-fs-file-name">{file.name}</span>
                    <span className="os-fs-inode">inode {file.inode}</span>
                    {file.deleted && (
                      <span className="os-fs-deleted-note">blocks still on disk</span>
                    )}
                    {!file.deleted && (
                      <button
                        type="button"
                        className="btn os-fs-delete-btn"
                        onClick={() => deleteFile(dir.name, file.inode, file.name)}
                      >
                        Delete
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="os-fs-controls">
          <div className="os-fs-create">
            <span className="os-fs-ctrl-label">New file in:</span>
            <select
              value={targetDir}
              onChange={(e) => setTargetDir(e.target.value)}
              className="os-fs-select"
            >
              {tree.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="filename.txt"
              className="os-fs-input"
              onKeyDown={(e) => e.key === 'Enter' && createFile()}
            />
            <button type="button" className="btn primary" onClick={createFile} disabled={!newFileName.trim()}>
              Create
            </button>
          </div>
          <div className="os-fs-space">
            <span className="micro">Free blocks: {freeBlocks}</span>
          </div>
        </div>
      </div>

      {feedback && (
        <motion.div
          className="os-fs-feedback"
          key={feedback}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          {feedback}
        </motion.div>
      )}

      {showCard && (
        <ConnectionCard
          title="This is why file recovery software works"
          body={
            <>
              When you delete a file, the OS only removes its directory entry. The inode and disk blocks remain
              until something new is written on top of them. Recovery software scans for orphaned inodes with
              intact blocks — and finds your "deleted" file. This is also why you should overwrite sensitive files
              before selling a drive.
            </>
          }
          appearsIn={['system calls (next step)', 'OS filesystem internals', 'data forensics tools']}
          hook="You managed files at the inode level. Next: how programs talk to the filesystem — crossing the kernel boundary."
        />
      )}

      <div className="lesson-actions">
        <button type="button" className="btn primary" onClick={onComplete} disabled={!done}>
          Continue to system calls
        </button>
        {!done && (
          <span className="hint">
            {!didCreate ? 'Create a file first. ' : ''}
            {!didDelete ? 'Then delete one.' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
