"use client";
import React, { useEffect, useState, useRef } from "react";
import 'quill/dist/quill.snow.css';

interface Disease {
  _id: string;
  name: string;
  description: string;
  symptoms: string;
  causes: string;
  treatment: string;
  prevention: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  affectedCrops: string;
  imageUrl?: string;
}

export default function AdminDiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [causes, setCauses] = useState("");
  const [treatment, setTreatment] = useState("");
  const [prevention, setPrevention] = useState("");
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');
  const [affectedCrops, setAffectedCrops] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);

  useEffect(() => {
    fetchDiseases();
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

  async function fetchDiseases() {
    setLoading(true);
    const res = await fetch("/api/admin/diseases");
    if (res.ok) {
      setDiseases(await res.json());
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("symptoms", symptoms);
    formData.append("causes", causes);
    formData.append("treatment", treatment);
    formData.append("prevention", prevention);
    formData.append("severity", severity);
    formData.append("affectedCrops", affectedCrops);
    if (imageUrl) formData.append("imageUrl", imageUrl);
    
    const url = editingDisease ? `/api/admin/diseases/${editingDisease._id}` : "/api/admin/diseases";
    const method = editingDisease ? "PUT" : "POST";
    
    const res = await fetch(url, { method, body: formData });
    
    if (res.ok) {
      resetForm();
      setDrawerOpen(false);
      fetchDiseases();
    }
  }

  function resetForm() {
    setName("");
    setDescription("");
    setSymptoms("");
    setCauses("");
    setTreatment("");
    setPrevention("");
    setSeverity('Low');
    setAffectedCrops("");
    setImageUrl("");
    setEditingDisease(null);
    if (quillInstance.current) {
      quillInstance.current.setContents([]);
    }
  }

  function handleEdit(disease: Disease) {
    setName(disease.name);
    setDescription(disease.description);
    setSymptoms(disease.symptoms);
    setCauses(disease.causes);
    setTreatment(disease.treatment);
    setPrevention(disease.prevention);
    setSeverity(disease.severity);
    setAffectedCrops(disease.affectedCrops);
    setImageUrl(disease.imageUrl || "");
    setEditingDisease(disease);
    setDrawerOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this disease?")) return;
    const res = await fetch(`/api/admin/diseases/${id}`, { method: "DELETE" });
    if (res.ok) fetchDiseases();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Manage Diseases</h1>
        <button
          onClick={() => { resetForm(); setDrawerOpen(true); }}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded shadow transition-all duration-200"
        >
          + Add Disease
        </button>
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out
        ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{editingDisease ? 'Edit Disease' : 'Add Disease'}</h2>
          <button onClick={() => { resetForm(); setDrawerOpen(false); }} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 flex-1 overflow-y-auto">
          <input
            className="border rounded px-3 py-2"
            placeholder="Disease Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <div className="border rounded bg-white">
              <div ref={quillRef} style={{ minHeight: '120px' }} />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Symptoms</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
              placeholder="List the symptoms..."
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Causes</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
              placeholder="What causes this disease..."
              value={causes}
              onChange={e => setCauses(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Treatment</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
              placeholder="Treatment methods..."
              value={treatment}
              onChange={e => setTreatment(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Prevention</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
              placeholder="Prevention methods..."
              value={prevention}
              onChange={e => setPrevention(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Severity</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={severity}
              onChange={e => setSeverity(e.target.value as any)}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Affected Crops</label>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Tomato, Potato, Corn..."
              value={affectedCrops}
              onChange={e => setAffectedCrops(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Image URL</label>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="https://example.com/disease-image.jpg"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded" onError={e => e.currentTarget.style.display = 'none'} />
              </div>
            )}
          </div>

          <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded shadow mt-2">
            {editingDisease ? 'Update Disease' : 'Add Disease'}
          </button>
        </form>
      </div>

      {/* Overlay */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affected Crops</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {diseases.map((disease) => (
                <tr key={disease._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {disease.imageUrl ? (
                        <img src={disease.imageUrl} alt={disease.name} className="w-10 h-10 rounded object-cover mr-3" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{disease.name}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate" dangerouslySetInnerHTML={{ __html: disease.description }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      disease.severity === 'Low' ? 'bg-green-100 text-green-800' :
                      disease.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      disease.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {disease.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{disease.affectedCrops}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">{disease.symptoms}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(disease)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button onClick={() => handleDelete(disease._id)} className="text-red-600 hover:text-red-900">Delete</button>
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