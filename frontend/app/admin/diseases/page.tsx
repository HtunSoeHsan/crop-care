"use client";
import React, { useEffect, useState } from "react";

interface Disease {
  _id: string;
  name: {
    en: string;
    my: string;
  };
  description: {
    en: string;
    my: string;
  };
  symptoms: {
    en: string;
    my: string;
  };
  causes: {
    en: string;
    my: string;
  };
  treatment: {
    en: string;
    my: string;
  };
  prevention: {
    en: string;
    my: string;
  };
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  affectedCrops: {
    en: string;
    my: string;
  };
  imageUrl?: string;
}

export default function AdminDiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [filteredDiseases, setFilteredDiseases] = useState<Disease[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameMy, setNameMy] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionMy, setDescriptionMy] = useState("");
  const [symptomsEn, setSymptomsEn] = useState("");
  const [symptomsMy, setSymptomsMy] = useState("");
  const [causesEn, setCausesEn] = useState("");
  const [causesMy, setCausesMy] = useState("");
  const [treatmentEn, setTreatmentEn] = useState("");
  const [treatmentMy, setTreatmentMy] = useState("");
  const [preventionEn, setPreventionEn] = useState("");
  const [preventionMy, setPreventionMy] = useState("");
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');
  const [affectedCropsEn, setAffectedCropsEn] = useState("");
  const [affectedCropsMy, setAffectedCropsMy] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; disease: Disease | null }>({ open: false, disease: null });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [filterCrops, setFilterCrops] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    fetchDiseases();
  }, []);

  useEffect(() => {
    filterAndPaginateDiseases();
  }, [diseases, searchTerm, filterSeverity, filterCrops, currentPage]);

  const filterAndPaginateDiseases = () => {
    let filtered = diseases.filter(disease => {
      const matchesSearch = disease.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           disease.name.my.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           disease.description.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           disease.symptoms.en.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = !filterSeverity || disease.severity === filterSeverity;
      const matchesCrops = !filterCrops || disease.affectedCrops.en.toLowerCase().includes(filterCrops.toLowerCase());
      return matchesSearch && matchesSeverity && matchesCrops;
    });
    
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredDiseases(filtered.slice(startIndex, endIndex));
  };



  async function fetchDiseases() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/diseases", {
        credentials: 'include'
      });
      if (res.ok) {
        setDiseases(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch diseases:', error);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    
    const diseaseData = {
      name: { en: nameEn, my: nameMy },
      description: { en: descriptionEn, my: descriptionMy },
      symptoms: { en: symptomsEn, my: symptomsMy },
      causes: { en: causesEn, my: causesMy },
      treatment: { en: treatmentEn, my: treatmentMy },
      prevention: { en: preventionEn, my: preventionMy },
      severity,
      affectedCrops: { en: affectedCropsEn, my: affectedCropsMy },
      imageUrl: imageUrl || undefined
    };
    
    const url = editingDisease 
      ? `http://localhost:5000/api/admin/diseases/${editingDisease._id}` 
      : "http://localhost:5000/api/admin/diseases";
    const method = editingDisease ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(diseaseData)
      });
      
      if (res.ok) {
        resetForm();
        setDrawerOpen(false);
        fetchDiseases();
      }
    } catch (error) {
      console.error('Failed to save disease:', error);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setNameEn("");
    setNameMy("");
    setDescriptionEn("");
    setDescriptionMy("");
    setSymptomsEn("");
    setSymptomsMy("");
    setCausesEn("");
    setCausesMy("");
    setTreatmentEn("");
    setTreatmentMy("");
    setPreventionEn("");
    setPreventionMy("");
    setSeverity('Low');
    setAffectedCropsEn("");
    setAffectedCropsMy("");
    setImageUrl("");
    setEditingDisease(null);
  }

  function handleEdit(disease: Disease) {
    setNameEn(disease.name.en);
    setNameMy(disease.name.my);
    setDescriptionEn(disease.description.en);
    setDescriptionMy(disease.description.my);
    setSymptomsEn(disease.symptoms.en);
    setSymptomsMy(disease.symptoms.my);
    setCausesEn(disease.causes.en);
    setCausesMy(disease.causes.my);
    setTreatmentEn(disease.treatment.en);
    setTreatmentMy(disease.treatment.my);
    setPreventionEn(disease.prevention.en);
    setPreventionMy(disease.prevention.my);
    setSeverity(disease.severity);
    setAffectedCropsEn(disease.affectedCrops.en);
    setAffectedCropsMy(disease.affectedCrops.my);
    setImageUrl(disease.imageUrl || "");
    setEditingDisease(disease);
    setDrawerOpen(true);
  }

  async function confirmDelete() {
    if (!deleteModal.disease) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/diseases/${deleteModal.disease._id}`, { 
        method: "DELETE",
        credentials: 'include'
      });
      if (res.ok) {
        fetchDiseases();
        setDeleteModal({ open: false, disease: null });
      }
    } catch (error) {
      console.error('Failed to delete disease:', error);
    } finally {
      setDeleting(false);
    }
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

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search diseases..."
              className="w-full border rounded px-3 py-2"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div>
            <select
              className="w-full border rounded px-3 py-2"
              value={filterSeverity}
              onChange={e => { setFilterSeverity(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Filter by crops..."
              className="w-full border rounded px-3 py-2"
              value={filterCrops}
              onChange={e => { setFilterCrops(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredDiseases.length} of {diseases.length} diseases
          </div>
        </div>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Disease Name (English)</label>
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Disease Name in English"
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Disease Name (Myanmar)</label>
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="ရောဂါအမည်"
                value={nameMy}
                onChange={e => setNameMy(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Description (English)</label>
              <textarea
                className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
                placeholder="Disease description..."
                value={descriptionEn}
                onChange={e => setDescriptionEn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description (Myanmar)</label>
              <textarea
                className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
                placeholder="ရောဂါ ဖော်ပြချက်..."
                value={descriptionMy}
                onChange={e => setDescriptionMy(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Symptoms (English)</label>
              <textarea
                className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
                placeholder="List the symptoms..."
                value={symptomsEn}
                onChange={e => setSymptomsEn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Symptoms (Myanmar)</label>
              <textarea
                className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
                placeholder="လက္ခဏာများ..."
                value={symptomsMy}
                onChange={e => setSymptomsMy(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Causes (English)</label>
              <textarea
                className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
                placeholder="What causes this disease..."
                value={causesEn}
                onChange={e => setCausesEn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Causes (Myanmar)</label>
              <textarea
                className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
                placeholder="ရောဂါ အကြောင်းများ..."
                value={causesMy}
                onChange={e => setCausesMy(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Treatment (English)</label>
              <textarea
                className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
                placeholder="Treatment methods..."
                value={treatmentEn}
                onChange={e => setTreatmentEn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Treatment (Myanmar)</label>
              <textarea
                className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
                placeholder="ကုသမှု နည်းများ..."
                value={treatmentMy}
                onChange={e => setTreatmentMy(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Prevention (English)</label>
              <textarea
                className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
                placeholder="Prevention methods..."
                value={preventionEn}
                onChange={e => setPreventionEn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Prevention (Myanmar)</label>
              <textarea
                className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
                placeholder="ကာကွယ်ရေး နည်းများ..."
                value={preventionMy}
                onChange={e => setPreventionMy(e.target.value)}
                required
              />
            </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Affected Crops (English)</label>
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Tomato, Potato, Corn..."
                value={affectedCropsEn}
                onChange={e => setAffectedCropsEn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Affected Crops (Myanmar)</label>
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="ခရမ်းချဉ်သီး, အာလူး..."
                value={affectedCropsMy}
                onChange={e => setAffectedCropsMy(e.target.value)}
                required
              />
            </div>
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





          <button 
            type="submit" 
            disabled={submitting}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold px-6 py-2 rounded shadow mt-2 flex items-center gap-2"
          >
            {submitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {submitting ? 'Saving...' : editingDisease ? 'Update Disease' : 'Add Disease'}
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
              {filteredDiseases.map((disease) => (
                <tr key={disease._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {disease.imageUrl ? (
                        <img src={disease.imageUrl} alt={disease.name} className="w-10 h-10 rounded object-cover mr-3" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{disease.name.en}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{disease.description.en}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      disease.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      disease.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                      disease.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {disease.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{disease.affectedCrops.en}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">{disease.symptoms.en}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(disease)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button onClick={() => setDeleteModal({ open: true, disease })} className="text-red-600 hover:text-red-900">Delete</button>
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
                        currentPage === page ? 'bg-red-500 text-white' : 'hover:bg-gray-50'
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
            <h3 className="text-lg font-semibold mb-4">Delete Disease</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteModal.disease?.name.en}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteModal({ open: false, disease: null })}
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