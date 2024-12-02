export default {
    server: {
      proxy: {
        '/parkingrates': {
          target: 'http://localhost:5000', // Replace with your backend URL
          changeOrigin: true,
        },
        '/login': {
          target: 'http://localhost:5000', // Replace with your backend URL
          changeOrigin: true,
        },
      },
    },
  };
  