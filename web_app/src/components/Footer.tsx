import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <h3>SHADE_ZW</h3>
                    <p>Elevating vision, one pair at a time.</p>
                </div>
                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Shop</h4>
                        <a href="#">Men</a>
                        <a href="#">Women</a>
                        <a href="#">New Arrivals</a>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <a href="#">Contact</a>
                        <a href="#">Shipping</a>
                        <a href="#">Returns</a>
                    </div>
                    <div className="footer-col">
                        <h4>Social</h4>
                        <a href="https://instagram.com/shade_zw_" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Shade_zw. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
