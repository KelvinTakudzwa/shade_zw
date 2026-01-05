import { useState, useEffect } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import type { Product } from '../context/CartContext';
import './ProductGrid.css';

const ProductGrid = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [addedIds, setAddedIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('shade_products')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setProducts(data);
            if (error) console.error('Error fetching products:', error);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        setAddedIds(prev => [...prev, product.id]);
        setTimeout(() => {
            setAddedIds(prev => prev.filter(id => id !== product.id));
        }, 2000);
    };

    return (
        <section id="shop" className="products-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Curated Collection</h2>
                    <p className="section-subtitle">Discover our most coveted pieces.</p>
                </div>

                {loading ? (
                    <div className="product-grid">
                        <p style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-secondary)' }}>Loading collection...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="product-grid">
                        <p style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-secondary)' }}>
                            No products found. Run the setup SQL or visit <a href="/admin" style={{ color: 'var(--accent-gold)' }}>/admin</a> to add some.
                        </p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image-wrapper">
                                    {product.tag && <span className="product-tag">{product.tag}</span>}
                                    <img src={product.image_url} alt={product.name} className="product-image" />
                                    <button
                                        className={`add-to-cart-btn ${addedIds.includes(product.id) ? 'added' : ''}`}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        {addedIds.includes(product.id) ? <Check size={18} /> : <ShoppingBag size={18} />}
                                        {addedIds.includes(product.id) ? 'Added' : 'Add to Cart'}
                                    </button>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductGrid;
