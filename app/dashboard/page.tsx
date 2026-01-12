"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Package, Users, ShoppingCart, Trash2, Edit, Plus, X, Image as ImageIcon } from "lucide-react";

// --- 1. Import Your Interfaces ---
// (In a real file, import these from your files. I will define them here for the component to work)
import { IProduct } from "@/app/interfaces/product.interface"; 

// --- 2. Helper: Convert String <-> Strapi Blocks ---
// Strapi Blocks expects a specific JSON structure, not a plain string.
const textToBlocks = (text: string) => [
  {
    type: "paragraph",
    children: [{ type: "text", text: text }],
  },
];

const blocksToText = (blocks: any) => {
  // Try to grab text from the first paragraph
  try {
    return blocks[0]?.children[0]?.text || "";
  } catch {
    return "";
  }
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "users">("products");

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10">Dej Admin</h1>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab("products")} className={`flex items-center gap-3 p-3 rounded-lg ${activeTab === "products" ? "bg-blue-600" : "hover:bg-slate-800"}`}>
            <Package size={20} /> <span>Products</span>
          </button>
          <button onClick={() => setActiveTab("orders")} className={`flex items-center gap-3 p-3 rounded-lg ${activeTab === "orders" ? "bg-blue-600" : "hover:bg-slate-800"}`}>
            <ShoppingCart size={20} /> <span>Orders</span>
          </button>
          <button onClick={() => setActiveTab("users")} className={`flex items-center gap-3 p-3 rounded-lg ${activeTab === "users" ? "bg-blue-600" : "hover:bg-slate-800"}`}>
            <Users size={20} /> <span>Users</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "products" && <ProductManager />}
        {activeTab === "orders" && <div className="p-10 text-center text-gray-500">Orders Module Coming Soon</div>}
        {activeTab === "users" && <div className="p-10 text-center text-gray-500">Users Module Coming Soon</div>}
      </main>
    </div>
  );
}

// --- Product Manager Component ---
function ProductManager() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "", description: "" });
  const [file, setFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?populate=*`);
      setProducts(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert("Error deleting product");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageId = null;

      // 1. Upload Image (if selected)
      if (file) {
        const uploadData = new FormData();
        uploadData.append("files", file);
        const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/upload`, uploadData);
        uploadedImageId = uploadRes.data[0].id;
      }

      // 2. Prepare Payload
      const payload: any = {
        data: {
          name: formData.name, // Updated to 'name'
          price: Number(formData.price),
          // Convert simple text string -> Strapi Block JSON
          description: textToBlocks(formData.description), 
        }
      };

      // If uploading a new image, REPLAce the images array with this new one
      // (For a simple dashboard, we usually just replace. Handling multi-image append is complex)
      if (uploadedImageId) {
        payload.data.images = [uploadedImageId]; 
      }

      if (editingId) {
        await axios.put(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products/${editingId}`, payload);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products`, payload);
      }

      await fetchProducts();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (product: IProduct) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: String(product.price),
      // Extract plain text from the blocks structure to show in the textarea
      description: blocksToText(product.description),
    });
    setFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", price: "", description: "" });
    setFile(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              // Safe access to first image url
              const imgUrl = p.images?.[0]?.url 
                ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${p.images[0].url}` 
                : null;

              return (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {imgUrl ? (
                      <img src={imgUrl} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 text-green-600 font-bold">{p.price.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded mr-2"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">{editingId ? "Edit Product" : "New Product"}</h3>
              <button onClick={closeModal}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                className="border p-2 rounded" 
                placeholder="Product Name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <input 
                className="border p-2 rounded" 
                type="number" 
                placeholder="Price" 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                required 
              />
              <textarea 
                className="border p-2 rounded" 
                placeholder="Description" 
                rows={4} 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files ? e.target.files[0] : null)} 
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}