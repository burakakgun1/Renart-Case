const fs = require('fs');
const path = require('path');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Serve built client locally in production mode
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(clientBuildPath, 'index.html'))) {
  const express = require('express');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/products`);
});
