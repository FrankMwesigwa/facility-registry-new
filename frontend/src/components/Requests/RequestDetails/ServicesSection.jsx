import React from 'react';

const ServicesSection = ({ services }) => {
    if (!services || !Array.isArray(services) || services.length === 0) return null;
    return (
        <div className="container">
            <div className="content-section">
                <div className="section-header">
                    <h5 className="section-title">
                        <i className="fas fa-heartbeat"></i>
                        Services Offered
                    </h5>
                </div>
                <div className="section-body">
                    <div className="row">
                        <div className="col-12">
                            <div className="services-container">
                                {services.map((service, index) => (
                                    <span key={index} className="service-tag">
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesSection;


