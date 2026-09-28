import React, { useState } from 'react';
import { ArrowLeft, Save, Sparkles, UploadCloud } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddEditProductScreen: React.FC<{ productId?: string }> = ({ productId }) => {
  const { products, categories, addProduct, updateProduct, navigate, showToast } = useApp();

  const existingProduct = productId ? products.find((p) => p.id === productId) : null;

  const [title, setTitle] = useState(existingProduct?.title || '');
  const [category, setCategory] = useState(existingProduct?.category || categories[0]?.name || 'Electronics');
  const [description, setDescription] = useState(existingProduct?.description || '');
  const [price, setPrice] = useState(existingProduct?.price ? String(existingProduct.price) : '');
  const [oldPrice, setOldPrice] = useState(existingProduct?.oldPrice ? String(existingProduct.oldPrice) : '');
  const [discount, setDiscount] = useState(existingProduct?.discount || '');
  const [stock, setStock] = useState(existingProduct?.stock ? String(existingProduct.stock) : '15');
  const [condition, setCondition] = useState<'Brand New' | 'Refurbished' | 'Fair'>(
    existingProduct?.condition || 'Brand New'
  );
  const [image, setImage] = useState(existingProduct?.image || '/assets/images/smartwatch.jpg');
  const [deliveryAvailable, setDeliveryAvailable] = useState(existingProduct?.deliveryAvailable ?? true);

  const sampleImages = [
    { label: 'Smartwatch', url: '/assets/images/smartwatch.jpg' },
    { label: 'Leather Handbag', url: '/assets/images/handbag.jpg' },
    { label: 'ANC Headphones', url: '/assets/images/headphone.jpg' },
    { label: 'Running Sneaker', url: '/assets/images/sneaker.jpg' },
    { label: 'Home Appliances', url: '/assets/images/homeheader1.png' },
    { label: 'Modern Living', url: '/assets/images/homeheader2.png' },
  ];

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!title || !price) {
      showToast('Please provide product title and price');
      return;
    }

    const numericPrice = parseFloat(price) || 100;
    const numericStock = parseInt(stock, 10) || 10;
    const numericOldPrice = oldPrice ? parseFloat(oldPrice) : undefined;

    if (existingProduct) {
      updateProduct(existingProduct.id, {
        title,
        category,
        description,
        price: numericPrice,
        oldPrice: numericOldPrice,
        discount: discount || undefined,
        stock: numericStock,
        condition,
        image,
        deliveryAvailable,
        status: isDraft ? 'inactive' : 'active',
      });
      showToast('Product updated successfully!');
    } else {
      addProduct({
        title,
        category,
        description,
        price: numericPrice,
        oldPrice: numericOldPrice,
        discount: discount || undefined,
        stock: numericStock,
        sellerId: 'user-seller-1',
        sellerName: 'JD Tech Store',
        sellerLocation: 'Central Freetown, Sierra Leone',
        sellerRating: 4.8,
        condition,
        rating: 5.0,
        reviewsCount: 1,
        featured: false,
        status: isDraft ? 'inactive' : 'active',
        deliveryAvailable,
        image,
      });
      showToast('New product added to marketplace!');
    }

    navigate('/seller/products');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate('/seller/products')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {existingProduct ? 'Edit Product Listing' : 'Add New Product Listing'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provide high quality details to attract buyers and dispatch riders
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Product Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sony ANC Wireless Headphones"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
              >
                <option value="Brand New">Brand New</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Fair">Fair / Pre-owned</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Selling Price (Le)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 240"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Original Price (Le) (Optional)</label>
              <input
                type="number"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="e.g. 300"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Discount Tag (e.g. -20%)</label>
              <input
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="e.g. -20%"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Available Stock Units</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Product Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide detailed specs, packaging contents, warranty and sizing..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
              />
            </div>

            {/* Image Selector */}
            <div className="sm:col-span-2 space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">Select Catalog Image Asset</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {sampleImages.map((img) => (
                  <div
                    key={img.url}
                    onClick={() => setImage(img.url)}
                    className={`cursor-pointer rounded-2xl p-1 border-2 overflow-hidden bg-slate-50 transition-all ${
                      image === img.url ? 'border-[#1E40AF] ring-2 ring-blue-200' : 'border-slate-200'
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-16 object-cover rounded-xl" />
                    <p className="text-[10px] text-center font-bold text-slate-600 truncate mt-1">
                      {img.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
              <input
                type="checkbox"
                id="deliveryAvail"
                checked={deliveryAvailable}
                onChange={(e) => setDeliveryAvailable(e.target.checked)}
                className="w-4 h-4 accent-[#1E40AF]"
              />
              <label htmlFor="deliveryAvail" className="text-xs font-semibold text-slate-800">
                Enable Motorcycle Dispatch Delivery for this item across Freetown
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{existingProduct ? 'Update Product' : 'Submit for Approval'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
