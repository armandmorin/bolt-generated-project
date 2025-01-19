// Add this route before app.listen()
    app.get('/api/client/script/:key', async (req, res) => {
      try {
        const { key } = req.params;
        const script = `
          (function() {
            const scriptKey = '${key}';
            const scriptUrl = '${process.env.BASE_URL}/api/client/script';
            
            // Create container
            const container = document.createElement('div');
            container.id = 'accessibility-container';
            document.body.appendChild(container);

            // Load styles
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = '${process.env.BASE_URL}/accessibility.css';
            document.head.appendChild(style);

            // Load React components
            const scriptTag = document.createElement('script');
            scriptTag.src = '${process.env.BASE_URL}/accessibility.js';
            scriptTag.defer = true;
            document.head.appendChild(scriptTag);
          })();
        `;
        res.type('application/javascript').send(script);
      } catch (error) {
        res.status(500).send('Error generating script');
      }
    });
