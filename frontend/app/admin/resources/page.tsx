"use client";
import React, { useEffect, useState, useRef } from "react";
import 'quill/dist/quill.snow.css';




interface Resource {
  _id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'community';
  category: string;
  image: string;
  content?: string;
  videoUrl?: string;
  pdfUrl?: string;
  readTime?: string;
  duration?: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  linkUrl?: string;
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<'article' | 'video' | 'guide' | 'community'>('article');
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [readTime, setReadTime] = useState("");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; resource: Resource | null }>({ open: false, resource: null });
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && drawerOpen && quillRef.current && type === 'article' && !quillInstance.current) {
      import('quill').then((Quill) => {
        quillInstance.current = new Quill.default(quillRef.current!, {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'header': [2, 3, false] }],
              ['link'],
              ['clean']
            ]
          }
        });
        
        quillInstance.current.on('text-change', () => {
          setContent(quillInstance.current.root.innerHTML);
        });
      });
    }
    
    // Set content when editing
    if (quillInstance.current && editingResource && editingResource.content) {
      quillInstance.current.root.innerHTML = editingResource.content;
    }
  }, [drawerOpen, type]);
  
  useEffect(() => {
    if (quillInstance.current && editingResource && editingResource.content) {
      quillInstance.current.root.innerHTML = editingResource.content;
    }
  }, [editingResource]);

  useEffect(() => {
    filterAndPaginateResources();
  }, [resources, searchTerm, filterType, filterCategory, currentPage]);

  const filterAndPaginateResources = () => {
    let filtered = resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = !filterType || resource.type === filterType;
      const matchesCategory = !filterCategory || resource.category.toLowerCase().includes(filterCategory.toLowerCase());
      return matchesSearch && matchesType && matchesCategory;
    });
    
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredResources(filtered.slice(startIndex, endIndex));
  };

  async function fetchResources() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/resources", {
        credentials: 'include'
      });
      if (res.ok) {
        setResources(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    
    let finalPdfUrl = pdfUrl;
    
    // Upload PDF if file is selected
    if (pdfFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      
      try {
        const uploadRes = await fetch('http://localhost:5000/api/upload/pdf', {
          method: 'POST',
          body: formData
        });
        
        if (uploadRes.ok) {
          const { pdfUrl: uploadedUrl } = await uploadRes.json();
          finalPdfUrl = uploadedUrl;
        }
      } catch (error) {
        console.error('Failed to upload PDF:', error);
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    
    const resourceData = {
      title,
      description,
      type,
      category,
      image,
      content,
      videoUrl: videoUrl || undefined,
      pdfUrl: finalPdfUrl || undefined,
      readTime: readTime || undefined,
      duration: duration || undefined,
      linkUrl: linkUrl || undefined,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    const url = editingResource 
      ? `http://localhost:5000/api/admin/resources/${editingResource._id}` 
      : "http://localhost:5000/api/admin/resources";
    const method = editingResource ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(resourceData)
      });
      
      if (res.ok) {
        resetForm();
        setDrawerOpen(false);
        fetchResources();
      }
    } catch (error) {
      console.error('Failed to save resource:', error);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setType('article');
    setCategory("");
    setImage("");
    setContent("");
    setVideoUrl("");
    setPdfUrl("");
    setReadTime("");
    setDuration("");
    setTags("");
    setLinkUrl("");
    setPdfFile(null);
    setEditingResource(null);
    if (quillInstance.current) {
      quillInstance.current.setText('');
    }
  }

  function handleEdit(resource: Resource) {
    setTitle(resource.title);
    setDescription(resource.description);
    setType(resource.type);
    setCategory(resource.category);
    setImage(resource.image);
    setContent(resource.content || "");
    setVideoUrl(resource.videoUrl || "");
    setPdfUrl(resource.pdfUrl || "");
    setReadTime(resource.readTime || "");
    setDuration(resource.duration || "");
    setTags(resource.tags.join(', '));
    setLinkUrl(resource.linkUrl || "");
    setEditingResource(resource);
    setDrawerOpen(true);
  }

  async function confirmDelete() {
    if (!deleteModal.resource) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/resources/${deleteModal.resource._id}`, { 
        method: "DELETE",
        credentials: 'include'
      });
      if (res.ok) {
        fetchResources();
        setDeleteModal({ open: false, resource: null });
      }
    } catch (error) {
      console.error('Failed to delete resource:', error);
    } finally {
      setDeleting(false);
    }
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

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full border rounded px-3 py-2"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div>
            <select
              className="w-full border rounded px-3 py-2"
              value={filterType}
              onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Types</option>
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="guide">Guide</option>
              <option value="community">Community</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Filter by category..."
              className="w-full border rounded px-3 py-2"
              value={filterCategory}
              onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        </div>
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out
        ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col`}
        style={{ boxShadow: drawerOpen ? 'rgba(0,0,0,0.2) 0 0 0 9999px' : undefined }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{editingResource ? 'Edit Resource' : 'Add Resource'}</h2>
          <button onClick={() => { resetForm(); setDrawerOpen(false); }} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block mb-1 font-medium">Category</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="e.g., Education, Treatment"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                className="border rounded px-3 py-2 w-full h-24 resize-none"
                placeholder="Brief description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Media</h3>
            <div>
              <label className="block mb-1 font-medium">Image URL</label>
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={e => setImage(e.target.value)}
                required
              />
              {image && (
                <div className="mt-2">
                  <img src={image} alt="Preview" className="w-full h-32 object-cover rounded" onError={e => e.currentTarget.style.display = 'none'} />
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          {type === 'article' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Article Content</h3>
              <div>
                <label className="block mb-1 font-medium">Read Time</label>
                <input
                  className="border rounded px-3 py-2 w-full max-w-xs"
                  placeholder="5 min read"
                  value={readTime}
                  onChange={e => setReadTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Content</label>
                <div className="border rounded bg-white">
                  <div ref={quillRef} style={{ minHeight: '300px' }} />
                </div>
              </div>
            </div>
          )}
          {type === 'video' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Video Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Duration</label>
                  <input
                    className="border rounded px-3 py-2 w-full"
                    placeholder="5:24"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Video URL</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                />
                {videoUrl && (
                  <div className="mt-2">
                    <iframe
                      src={videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-48 rounded"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {type === 'guide' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Guide Details</h3>
              <div>
                <label className="block mb-1 font-medium">PDF URL</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="https://example.com/guide.pdf"
                  value={pdfUrl}
                  onChange={e => setPdfUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Or Upload PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="border rounded px-3 py-2 w-full"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('pdf', file);
                      try {
                        const res = await fetch('http://localhost:5000/api/upload/pdf', {
                          method: 'POST',
                          body: formData
                        });
                        if (res.ok) {
                          const { pdfUrl: uploadedUrl } = await res.json();
                          setPdfUrl(uploadedUrl);
                        }
                      } catch (error) {
                        console.error('Upload failed:', error);
                      }
                    }
                  }}
                />
                {pdfUrl && pdfUrl.includes('/pdfs/') && (
                  <p className="text-sm text-green-600 mt-1">PDF uploaded successfully</p>
                )}
              </div>
            </div>
          )}
          
          {type === 'community' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Community Details</h3>
              <div>
                <label className="block mb-1 font-medium">Link URL</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  placeholder="https://forum.example.com"
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {/* Tags Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Tags</h3>
            <div>
              <label className="block mb-1 font-medium">Tags (comma separated)</label>
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="tag1, tag2, tag3"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={submitting || uploading}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-semibold px-6 py-2 rounded shadow mt-2 flex items-center gap-2"
          >
            {(submitting || uploading) && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {uploading ? 'Uploading...' : submitting ? 'Saving...' : editingResource ? 'Update Resource' : 'Add Resource'}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResources.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {r.image ? (
                        <img src={r.image} alt={r.title} className="w-10 h-10 rounded object-cover mr-3" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{r.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{r.description}</div>
                        <div className="text-xs text-gray-400">{r.tags.slice(0, 3).join(', ')}</div>
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
                    <span className="text-sm text-gray-900">{r.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      r.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {r.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(r)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button onClick={() => setDeleteModal({ open: true, resource: r })} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  if (page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === page ? 'bg-yellow-500 text-white' : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Delete Resource</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteModal.resource?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteModal({ open: false, resource: null })}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded flex items-center gap-2"
              >
                {deleting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
