import React from 'react';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';
import './Spinner.style.css';

const Spinner = () => {
  return (
    <div className="loading-overlay">
      <BootstrapSpinner animation="border" variant="danger" className="center-spinner" />
    </div>
  );
};

export default Spinner;
