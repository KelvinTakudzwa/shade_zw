import { MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ContactFloat.css';

const ContactFloat = () => {
    const { items, totalItems } = useCart();
    const phoneNumber = '263719228900'; // Assuming Zimbabwe code + number provided in prompt

    const handleCheckout = () => {
        if (items.length === 0) return;

        let message = "Hi! I'm interested in buying:\n\n";
        items.forEach(item => {
            message += `- ${item.name} (${item.price})\n`;
        });
        message += "\nAvailable?";

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <>
            {items.length > 0 ? (
                <button className="contact-float checkout-mode" onClick={handleCheckout}>
                    <div className="badge">{totalItems}</div>
                    <ShoppingBag size={24} />
                    <span className="contact-text">Checkout via WhatsApp</span>
                </button>
            ) : (
                <div className="contact-group">
                    <a href="https://instagram.com/shade_zw_" className="contact-float ig-float" aria-label="Follow us on Instagram" target="_blank">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href={`https://wa.me/${phoneNumber}`} className="contact-float" aria-label="Chat with us" target="_blank">
                        <MessageCircle size={24} />
                        <span className="contact-text">Chat with us</span>
                    </a>
                </div>
            )}
        </>
    );
};

export default ContactFloat;
