"use client";
import React, { useEffect, useState } from "react";

interface Food {
  _id: string;
  title: {
    en: string;
    my: string;
  };
  description: {
    en: string;
    my: string;
  };
  imageUrl?: string;
  keyBenefits: {
    en: string[];
    my: string[];
  };
  keyNutrients: {
    en: string[];
    my: string[];
  };
  season: string;
  category: string;
}

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [titleEn, setTitleEn] = useState("");
  const [titleMy, setTitleMy] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionMy, setDescriptionMy] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [keyBenefitsEn, setKeyBenefitsEn] = useState("");
  const [keyBenefitsMy, setKeyBenefitsMy] = useState("");
  const [keyNutrientsEn, setKeyNutrientsEn] = useState("");
  const [keyNutrientsMy, setKeyNutrientsMy] = useState("");
  const [season, setSeason] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSeason, setFilterSeason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const itemsPerPage = 10;
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; food: Food | null }>({ open: false, food: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    filterAndPaginateFoods();
  }, [foods, searchTerm, filterCategory, filterSeason, currentPage]);



  const filterAndPaginateFoods = () => {
    let filtered = foods.filter(food => {
      const matchesSearch = !searchTerm || 
        food.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.title.my.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.en.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filterCategory || food.category === filterCategory;
      const matchesSeason = !filterSeason || food.season === filterSeason;
      
      return matchesSearch && matchesCategory && matchesSeason;
    });
    
    setFilteredFoods(filtered);
  };

  async function fetchFoods() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/healthy-foods", {
        credentials: 'include'
      });
      if (res.ok) {
        setFoods(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch foods:', error);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    if (!titleEn || !titleMy || !descriptionEn || !descriptionMy || !season || !category) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    const foodData = {
      title: { en: titleEn, my: titleMy },
      description: { en: descriptionEn, my: descriptionMy },
      imageUrl: imageUrl || undefined,
      keyBenefits: {
        en: keyBenefitsEn.split(',').map(b => b.trim()).filter(b => b),
        my: keyBenefitsMy.split(',').map(b => b.trim()).filter(b => b)
      },
      keyNutrients: {
        en: keyNutrientsEn.split(',').map(n => n.trim()).filter(n => n),
        my: keyNutrientsMy.split(',').map(n => n.trim()).filter(n => n)
      },
      season,
      category
    };
    
    const url = editingFood 
      ? `http://localhost:5000/api/admin/healthy-foods/${editingFood._id}` 
      : "http://localhost:5000/api/admin/healthy-foods";
    const method = editingFood ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(foodData)
      });
      
      if (res.ok) {
        resetForm();
        setDrawerOpen(false);
        fetchFoods();
      } else {
        const errorData = await res.json();
        alert('Error: ' + (errorData.error || 'Failed to save food'));
      }
    } catch (error) {
      console.error('Failed to save food:', error);
      alert('Network error: Please check if the backend server is running');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitleEn("");
    setTitleMy("");
    setDescriptionEn("");
    setDescriptionMy("");
    setImageUrl("");
    setKeyBenefitsEn("");
    setKeyBenefitsMy("");
    setKeyNutrientsEn("");
    setKeyNutrientsMy("");
    setSeason("");
    setCategory("");
    setEditingFood(null);
  }

  function handleEdit(food: Food) {
    setTitleEn(food.title.en);
    setTitleMy(food.title.my);
    setDescriptionEn(food.description.en);
    setDescriptionMy(food.description.my);
    setImageUrl(food.imageUrl || "");
    setKeyBenefitsEn(food.keyBenefits.en.join(", "));
    setKeyBenefitsMy(food.keyBenefits.my.join(", "));
    setKeyNutrientsEn(food.keyNutrients.en.join(", "));
    setKeyNutrientsMy(food.keyNutrients.my.join(", "));
    setSeason(food.season);
    setCategory(food.category);
    setEditingFood(food);
    setDrawerOpen(true);
  }

  async function confirmDelete() {
    if (!deleteModal.food) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/healthy-foods/${deleteModal.food._id}`, { 
        method: "DELETE",
        credentials: 'include'
      });
      if (res.ok) {
        fetchFoods();
        setDeleteModal({ open: false, food: null });
      }
    } catch (error) {
      console.error('Failed to delete food:', error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Manage Foods ({filteredFoods.length})</h1>
        <button
          onClick={() => { resetForm(); setDrawerOpen(true); }}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded shadow transition-all duration-200"
        >
          + Add Food
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search foods..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Grains">Grains</option>
              <option value="Proteins">Proteins</option>
              <option value="Dairy">Dairy</option>
              <option value="Nuts & Seeds">Nuts & Seeds</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filterSeason}
              onChange={(e) => setFilterSeason(e.target.value)}
            >
              <option value="">All Seasons</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="Year-round">Year-round</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("");
                setFilterSeason("");
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
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
          <h2 className="text-xl font-bold">{editingFood ? 'Edit Food' : 'Add Food'}</h2>
          <button onClick={() => { resetForm(); setDrawerOpen(false); }} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 flex-1 overflow-y-auto">
          <div>
            <label className="block mb-1 font-medium">Title (English)</label>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Food Title in English"
              value={titleEn}
              onChange={e => setTitleEn(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Title (Myanmar)</label>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Food Title in Myanmar"
              value={titleMy}
              onChange={e => setTitleMy(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Description (English)</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[100px] resize-y"
              placeholder="Description in English"
              value={descriptionEn}
              onChange={e => setDescriptionEn(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Description (Myanmar)</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[100px] resize-y"
              placeholder="Description in Myanmar"
              value={descriptionMy}
              onChange={e => setDescriptionMy(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Image URL</label>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="https://example.com/food-image.jpg"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded" onError={e => e.currentTarget.style.display = 'none'} />
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Key Benefits (English)</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
              placeholder="Benefit 1, Benefit 2, Benefit 3..."
              value={keyBenefitsEn}
              onChange={e => setKeyBenefitsEn(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Key Benefits (Myanmar)</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
              placeholder="Benefits in Myanmar..."
              value={keyBenefitsMy}
              onChange={e => setKeyBenefitsMy(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Key Nutrients (English)</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
              placeholder="Vitamin C, Iron, Fiber..."
              value={keyNutrientsEn}
              onChange={e => setKeyNutrientsEn(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Key Nutrients (Myanmar)</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
              placeholder="Nutrients in Myanmar..."
              value={keyNutrientsMy}
              onChange={e => setKeyNutrientsMy(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Grains">Grains</option>
              <option value="Proteins">Proteins</option>
              <option value="Dairy">Dairy</option>
              <option value="Nuts & Seeds">Nuts & Seeds</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Season</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={season}
              onChange={e => setSeason(e.target.value)}
              required
            >
              <option value="">Select Season</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="Year-round">Year-round</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold px-6 py-2 rounded shadow mt-2 flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {loading ? 'Saving...' : (editingFood ? 'Update Food' : 'Add Food')}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Season</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nutrients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFoods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((food) => (
                <tr key={food._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {food.imageUrl ? (
                        <img src={food.imageUrl} alt={food.title.en} className="w-10 h-10 rounded object-cover mr-3" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{food.title.en}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{food.description.en}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">{food.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">{food.season}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {food.keyBenefits.en.slice(0, 2).map((benefit, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">{benefit}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {food.keyNutrients.en.slice(0, 2).map((nutrient, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">{nutrient}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(food)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button onClick={() => setDeleteModal({ open: true, food })} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredFoods.length > itemsPerPage && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(Math.ceil(filteredFoods.length / itemsPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(filteredFoods.length / itemsPerPage)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredFoods.length)}
                </span>{' '}
                of <span className="font-medium">{filteredFoods.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.ceil(filteredFoods.length / itemsPerPage) }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === Math.ceil(filteredFoods.length / itemsPerPage) || Math.abs(page - currentPage) <= 1)
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-green-50 border-green-500 text-green-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  onClick={() => setCurrentPage(Math.min(Math.ceil(filteredFoods.length / itemsPerPage), currentPage + 1))}
                  disabled={currentPage === Math.ceil(filteredFoods.length / itemsPerPage)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Delete Food</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteModal.food?.title.en}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteModal({ open: false, food: null })}
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