module.exports = {
  async redirects() {
    return [
      {
        source: '/select-sounds',
        destination: '/',
        permanent: true,
      },
    ];
  },
};
