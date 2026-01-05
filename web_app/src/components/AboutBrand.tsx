import './AboutBrand.css';

const AboutBrand = () => {
    return (
        <section className="about-section">
            <div className="container about-container">
                <div className="about-content">
                    <h2 className="about-title">More Than Just Shades.</h2>
                    <p className="about-text">
                        Born from a passion for style and a vision for quality, Shade_zw started as a simple conversation.
                        We believe that sunglasses are not just an accessory, but a statement of confidence.
                    </p>
                    <p className="about-text">
                        Based in Zimbabwe, we curate the finest eyewear for those who aren't afraid to stand out.
                        From the bustling streets of Harare to the serene horizons of the Zambezi, our shades are designed to accompany you on every journey.
                    </p>
                    <div className="about-stats">
                        <div className="stat-item">
                            <span className="stat-number">100%</span>
                            <span className="stat-label">Authentic Style</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">ZW</span>
                            <span className="stat-label">Locally Rooted</span>
                        </div>
                    </div>
                </div>
                <div className="about-visual">
                    <div className="visual-box box-1"></div>
                    <div className="visual-box box-2"></div>
                </div>
            </div>
        </section>
    );
};

export default AboutBrand;
