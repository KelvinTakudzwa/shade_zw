import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Admin.css'; // Reusing or creating new CSS

// Define Product type locally or import if shared
interface Product {
    id: number;
    name: string;
    price: string;
    tag?: string;
    image_url: string;
}

const AdminDashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching products:', error);
        if (data) setProducts(data);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting product');
            console.error(error);
        } else {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div className="admin-dashboard container">
            <h1>Product Management</h1>

            <section className="admin-section">
                <h2>Product List</h2>
                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Tag</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center' }}>No products found.</td>
                                </tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product.id}>
                                        <td>
                                            <img src={product.image_url} alt={product.name} className="admin-product-thumb" />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.tag || '-'}</td>
                                        <td>
                                            <button onClick={() => handleDelete(product.id)} className="delete-btn">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

export default AdminDashboard;
