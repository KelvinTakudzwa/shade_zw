import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Admin.css';

const Admin = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [tag, setTag] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [importData, setImportData] = useState('');
    const [importing, setImporting] = useState(false);
    const [importMessage, setImportMessage] = useState('');
    const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
    const [bulkUploading, setBulkUploading] = useState(false);
    const [bulkMessage, setBulkMessage] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data, error } = await supabase.from('shade_products').select('*').order('created_at', { ascending: false });
        if (data) setProducts(data);
        if (error) console.error(error);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select an image');
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            // 1. Upload Image
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            // 3. Insert into Database
            const { error: dbError } = await supabase.from('shade_products').insert([
                {
                    name,
                    price,
                    tag,
                    image_url: publicUrl,
                },
            ]);

            if (dbError) throw dbError;

            setMessage('Product added successfully!');
            setName('');
            setPrice('');
            setTag('');
            setFile(null);
            fetchProducts(); // Refresh list
        } catch (error: any) {
            setMessage('Error uploading: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const { error } = await supabase.from('shade_products').delete().eq('id', id);
        if (error) {
            alert('Error deleting');
        } else {
            fetchProducts();
        }
    };

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        setImporting(true);
        setImportMessage('');

        try {
            const data = JSON.parse(importData);
            if (!Array.isArray(data)) throw new Error('Input must be a JSON array');

            const { error } = await supabase.from('shade_products').insert(data);
            if (error) throw error;

            setImportMessage(`Successfully imported ${data.length} products!`);
            setImportData('');
            fetchProducts();
        } catch (error: any) {
            setImportMessage('Import failed: ' + error.message);
        } finally {
            setImporting(false);
        }
    };

    const handleBulkUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bulkFiles || bulkFiles.length === 0) {
            setBulkMessage('Please select files');
            return;
        }

        setBulkUploading(true);
        setBulkMessage(`Uploading ${bulkFiles.length} images...`);

        let successCount = 0;
        let failCount = 0;

        try {
            for (let i = 0; i < bulkFiles.length; i++) {
                const file = bulkFiles[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                // Upload
                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error('Upload error for', file.name, uploadError);
                    failCount++;
                    continue;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                // Insert
                const { error: dbError } = await supabase.from('shade_products').insert([{
                    name: file.name.split('.')[0], // Use filename as name
                    price: '$0.00',
                    tag: 'New Arrival',
                    image_url: publicUrl
                }]);

                if (dbError) {
                    console.error('DB error for', file.name, dbError);
                    failCount++;
                } else {
                    successCount++;
                }
            }

            setBulkMessage(`Complete! ${successCount} added, ${failCount} failed.`);
            setBulkFiles(null);
            // Reset file input manually if needed using a ref, but simple state clear is ok for now logic-wise
            fetchProducts();
        } catch (error: any) {
            setBulkMessage('Bulk upload failed: ' + error.message);
        } finally {
            setBulkUploading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="container">
                <h1>Admin Dashboard</h1>

                <div className="admin-grid">
                    {/* Upload Form */}
                    <div className="admin-card">
                        <h2>Add New Product</h2>
                        <form onSubmit={handleUpload}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    placeholder="e.g. The Gold Standard"
                                />
                            </div>

                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="text"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    required
                                    placeholder="e.g. $120.00"
                                />
                            </div>

                            <div className="form-group">
                                <label>Tag (Optional)</label>
                                <input
                                    type="text"
                                    value={tag}
                                    onChange={e => setTag(e.target.value)}
                                    placeholder="e.g. Best Seller"
                                />
                            </div>

                            <div className="form-group">
                                <label>Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary" disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Add Product'}
                            </button>

                            {message && <p className="message">{message}</p>}
                        </form>
                    </div>

                    {/* Product List */}
                    <div className="admin-card">
                        <h2>Current Inventory</h2>
                        <div className="inventory-list">
                            {products.length === 0 ? (
                                <p>No products yet.</p>
                            ) : (
                                products.map(p => (
                                    <div key={p.id} className="inventory-item">
                                        <img src={p.image_url} alt={p.name} />
                                        <div className="inventory-info">
                                            <h4>{p.name}</h4>
                                            <p>{p.price}</p>
                                        </div>
                                        <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Bulk Import */}
                    <div className="admin-card">
                        <h2>Bulk Import (JSON)</h2>
                        <form onSubmit={handleImport}>
                            <div className="form-group">
                                <label>JSON Data</label>
                                <textarea
                                    className="import-textarea"
                                    value={importData}
                                    onChange={e => setImportData(e.target.value)}
                                    placeholder='[{"name": "Product 1", "price": "100", "image_url": "..."}]'
                                    rows={10}
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={importing}>
                                {importing ? 'Importing...' : 'Import Products'}
                            </button>
                            {importMessage && <p className="message">{importMessage}</p>}
                        </form>
                    </div>

                    {/* Bulk Image Upload */}
                    <div className="admin-card">
                        <h2>Bulk Image Upload</h2>
                        <form onSubmit={handleBulkUpload}>
                            <div className="form-group">
                                <label>Select Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => setBulkFiles(e.target.files)}
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={bulkUploading}>
                                {bulkUploading ? 'Processing...' : 'Upload Images'}
                            </button>
                            {bulkMessage && <p className="message">{bulkMessage}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
