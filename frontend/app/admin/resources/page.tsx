"use client";
import React, { useEffect, useState, useRef } from "react";
import 'quill/dist/quill.snow.css';




interface Resource {
  _id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'community';
  imageUrl?: string;
  videoUrl?: string;
  author?: string;
  tags?: string[];
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<'article' | 'video' | 'guide' | 'community'>('article');
  const [videoUrl, setVideoUrl] = useState("");
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && quillRef.current && !quillInstance.current) {
      import('quill').then((Quill) => {
        quillInstance.current = new Quill.default(quillRef.current!, {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'header': [2, 3, false] }],
              ['clean']
            ]
          }
        });
        
        quillInstance.current.on('text-change', () => {
          setDescription(quillInstance.current.root.innerHTML);
        });
      });
    }
  }, [drawerOpen]);

  async function fetchResources() {
    setLoading(true);
    const res = await fetch("/api/admin/resources");
    if (res.ok) {
      setResources(await res.json());
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    if (videoUrl) formData.append("videoUrl", videoUrl);
    if (imageUrl) formData.append("imageUrl", imageUrl);
    
    const url = editingResource ? `/api/admin/resources/${editingResource._id}` : "/api/admin/resources";
    const method = editingResource ? "PUT" : "POST";
    
    const res = await fetch(url, { method, body: formData });
    
    if (res.ok) {
      resetForm();
      setDrawerOpen(false);
      fetchResources();
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setType('article');
    setVideoUrl("");
    setImageUrl("");
    setEditingResource(null);
    if (quillInstance.current) {
      quillInstance.current.setContents([]);
    }
  }

  function handleEdit(resource: Resource) {
    setTitle(resource.title);
    setDescription(resource.description);
    setType(resource.type);
    setVideoUrl(resource.videoUrl || "");
    setImageUrl(resource.imageUrl || "");
    setEditingResource(resource);
    setDrawerOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this resource?")) return;
    const res = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    if (res.ok) fetchResources();
  }


  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Manage Resources</h1>
        <button
          onClick={() => { resetForm(); setDrawerOpen(true); }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded shadow transition-all duration-200"
        >
          + Add Resource
        </button>
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out
        ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col`}
        style={{ boxShadow: drawerOpen ? 'rgba(0,0,0,0.2) 0 0 0 9999px' : undefined }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{editingResource ? 'Edit Resource' : 'Add Resource'}</h2>
          <button onClick={() => { resetForm(); setDrawerOpen(false); }} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 flex-1 overflow-y-auto">
          <input
            className="border rounded px-3 py-2"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={type}
              onChange={e => setType(e.target.value as any)}
            >
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="guide">Guide</option>
              <option value="community">Community</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <div className="border rounded bg-white">
              <div ref={quillRef} style={{ minHeight: '120px' }} />
            </div>
          </div>
          {type === 'video' && (
            <div>
              <label className="block mb-1 font-medium">Video URL</label>
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">Image URL</label>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded" onError={e => e.currentTarget.style.display = 'none'} />
              </div>
            )}
          </div>
          <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded shadow mt-2">
            {editingResource ? 'Update Resource' : 'Add Resource'}
          </button>
        </form>
      </div>

      {/* Overlay for drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[9998] transition-opacity duration-300"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {r.imageUrl ? (
                        <img src={r.imageUrl} alt={r.title} className="w-10 h-10 rounded object-cover mr-3" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{r.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate" dangerouslySetInnerHTML={{ __html: r.description }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      r.type === 'article' ? 'bg-blue-100 text-blue-800' :
                      r.type === 'video' ? 'bg-red-100 text-red-800' :
                      r.type === 'guide' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {r.videoUrl ? (
                      <a href={r.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        Watch
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(r)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button onClick={() => handleDelete(r._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
