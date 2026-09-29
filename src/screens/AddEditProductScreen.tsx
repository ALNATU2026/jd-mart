import React, { useState } from 'react';
import { ArrowLeft, Save, Sparkles, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddEditProductScreen: React.FC<{ productId?: string }> = ({ productId }) => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    uploadFile,
    generateAIDescription,
    analyzeImageWithAI,
    navigate,
    showToast,
    currentUser,
  } = useApp();

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

  const [uploading, setUploading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const sampleImages = [
    { label: 'Smartwatch', url: '/assets/images/smartwatch.jpg' },
    { label: 'Leather Handbag', url: '/assets/images/handbag.jpg' },
    { label: 'ANC Headphones', url: '/assets/images/headphone.jpg' },
    { label: 'Running Sneaker', url: '/assets/images/sneaker.jpg' },
    { label: 'Home Appliances', url: '/assets/images/homeheader1.png' },
    { label: 'Modern Living', url: '/assets/images/homeheader2.png' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(10);
      const metadata = await uploadFile(file, 'product-image', existingProduct?.id || 'new_prod', (p) => {
        setUploadProgress(p);
      });
      setImage(metadata.downloadURL);
      showToast('Image uploaded to Firebase Cloud Storage!');

      // Prompt to analyze with Gemini
      if (!title) {
        showToast('Analyzing uploaded image with Gemini AI...');
        setAiGenerating(true);
        const aiAnalysis = await analyzeImageWithAI(metadata.downloadURL);
        if (aiAnalysis) {
          if (aiAnalysis.title) setTitle(aiAnalysis.title);
          if (aiAnalysis.category) setCategory(aiAnalysis.category);
          if (aiAnalysis.description) setDescription(aiAnalysis.description);
          showToast('Gemini suggested title and description based on your image!');
        }
        setAiGenerating(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      showToast(msg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleGenerateAIDescription = async () => {
    if (!title.trim()) {
      showToast('Please enter a product title first so Gemini can generate a description');
      return;
    }
    setAiGenerating(true);
    const desc = await generateAIDescription(title, category);
    setDescription(desc);
    setAiGenerating(false);
    showToast('Gemini generated product description!');
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!title || !price) {
      showToast('Please provide product title and price');
      return;
    }

    const numericPrice = parseFloat(price) || 100;
    const numericStock = parseInt(stock, 10) || 10;
    const numericOldPrice = oldPrice ? parseFloat(oldPrice) : undefined;

    const sellerId = currentUser?.id || 'seller-partner';
    const sellerName = currentUser?.name || 'JD Verified Store';
    const sellerLocation = currentUser?.city || 'Freetown, Sierra Leone';

    if (existingProduct) {
      await updateProduct(existingProduct.id, {
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
    } else {
      await addProduct({
        title,
        category,
        description,
        price: numericPrice,
        oldPrice: numericOldPrice,
        discount: discount || undefined,
        stock: numericStock,
        sellerId,
        sellerName,
        sellerLocation,
        sellerRating: 4.9,
        condition,
        rating: 5.0,
        reviewsCount: 1,
        featured: false,
        status: isDraft ? 'inactive' : 'active',
        deliveryAvailable,
        image,
      });
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
            Connected to Cloud Firestore & Firebase Storage with Gemini AI description assistant
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Product Title</label>
                <button
                  type="button"
                  onClick={handleGenerateAIDescription}
                  disabled={aiGenerating}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiGenerating ? 'Generating with Gemini...' : 'Generate Description with AI'}</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sony ANC Wireless Headphones"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF] focus:bg-white"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF] focus:bg-white"
              />
            </div>

            {/* Cloud Storage Image Upload */}
            <div className="sm:col-span-2 space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">Product Photo (Firebase Cloud Storage)</label>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="px-4 py-2 bg-[#1E40AF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs">
                      <UploadCloud className="w-4 h-4" />
                      <span>{uploading ? `Uploading (${uploadProgress}%)...` : 'Upload from Device'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Supports JPG, PNG, WEBP up to 8MB. Automatically stored in Firebase Storage and analyzed by Gemini.
                  </p>
                </div>
              </div>

              {/* Sample Quick Asset Pickers */}
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Or select a standard catalog image</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {sampleImages.map((img) => (
                    <div
                      key={img.url}
                      onClick={() => setImage(img.url)}
                      className={`cursor-pointer rounded-xl p-1 border-2 overflow-hidden bg-white transition-all ${
                        image === img.url ? 'border-[#1E40AF] ring-2 ring-blue-200' : 'border-slate-200'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-14 object-cover rounded-lg" />
                      <p className="text-[10px] text-center font-bold text-slate-600 truncate mt-1">
                        {img.label}
                      </p>
                    </div>
                  ))}
                </div>
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
              <span>{existingProduct ? 'Update in Firestore' : 'Publish to Marketplace'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
