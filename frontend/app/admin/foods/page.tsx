"use client";
import React, { useEffect, useState, useRef } from "react";
import 'quill/dist/quill.snow.css';

interface Food {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  keyBenefits: string[];
  keyNutrients: string[];
  season: string;
  category: string;
}

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [keyBenefits, setKeyBenefits] = useState("");
  const [keyNutrients, setKeyNutrients] = useState("");
  const [season, setSeason] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);

  useEffect(() => {
    fetchFoods();
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

  async function fetchFoods() {
    setLoading(true);
    const res = await fetch("/api/admin/foods");
    if (res.ok) {
      setFoods(await res.json());
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("imageUrl", imageUrl);
    formData.append("keyBenefits", keyBenefits);
    formData.append("keyNutrients", keyNutrients);
    formData.append("season", season);
    formData.append("category", category);
    
    const url = editingFood ? `/api/admin/foods/${editingFood._id}` : "/api/admin/foods";
    const method = editingFood ? "PUT" : "POST";
    
    const res = await fetch(url, { method, body: formData });
    
    if (res.ok) {
      resetForm();
      setDrawerOpen(false);
      fetchFoods();
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setKeyBenefits("");
    setKeyNutrients("");
    setSeason("");
    setCategory("");
    setEditingFood(null);
    if (quillInstance.current) {
      quillInstance.current.setContents([]);
    }
  }

  function handleEdit(food: Food) {
    setTitle(food.title);
    setDescription(food.description);
    setImageUrl(food.imageUrl || "");
    setKeyBenefits(Array.isArray(food.keyBenefits) ? food.keyBenefits.join(", ") : food.keyBenefits);
    setKeyNutrients(Array.isArray(food.keyNutrients) ? food.keyNutrients.join(", ") : food.keyNutrients);
    setSeason(food.season);
    setCategory(food.category);
    setEditingFood(food);
    setDrawerOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this food?")) return;
    const res = await fetch(`/api/admin/foods/${id}`, { method: "DELETE" });
    if (res.ok) fetchFoods();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Manage Foods</h1>
        <button
          onClick={() => { resetForm(); setDrawerOpen(true); }}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded shadow transition-all duration-200"
        >
          + Add Food
        </button>
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
          <input
            className="border rounded px-3 py-2"
            placeholder="Food Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <div className="border rounded bg-white">
              <div ref={quillRef} style={{ minHeight: '120px' }} />
            </div>
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
            <label className="block mb-1 font-medium">Key Benefits</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
              placeholder="Benefit 1, Benefit 2, Benefit 3..."
              value={keyBenefits}
              onChange={e => setKeyBenefits(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Key Nutrients</label>
            <textarea
              className="border rounded px-3 py-2 w-full min-h-[80px] resize-y"
              placeholder="Vitamin C, Iron, Fiber..."
              value={keyNutrients}
              onChange={e => setKeyNutrients(e.target.value)}
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

          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded shadow mt-2">
            {editingFood ? 'Update Food' : 'Add Food'}
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
              {foods.map((food) => (
                <tr key={food._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {food.imageUrl ? (
                        <img src={food.imageUrl} alt={food.title} className="w-10 h-10 rounded object-cover mr-3" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{food.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate" dangerouslySetInnerHTML={{ __html: food.description }} />
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
                      {(Array.isArray(food.keyBenefits) ? food.keyBenefits : (food.keyBenefits as string || '').split(', ')).slice(0, 2).map((benefit, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">{benefit}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(Array.isArray(food.keyNutrients) ? food.keyNutrients : (food.keyNutrients as string || '').split(', ')).slice(0, 2).map((nutrient, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">{nutrient}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleEdit(food)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button onClick={() => handleDelete(food._id)} className="text-red-600 hover:text-red-900">Delete</button>
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