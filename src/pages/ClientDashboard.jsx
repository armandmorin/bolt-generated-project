import React from 'react';

    const ClientDashboard = () => {
      return (
        <div className="client-dashboard">
          <h1>Client Dashboard</h1>
          <div className="script-instructions">
            <h2>Installation Instructions</h2>
            <p>Add this script to your website:</p>
            <code>
              {`<script src="https://yourdomain.com/api/client/script"></script>`}
            </code>
          </div>
        </div>
      );
    };

    export default ClientDashboard;
