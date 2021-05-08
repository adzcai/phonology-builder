module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(csv|tsv)$/i,
      loader: 'csv-loader',
      options: {
        dynamicTyping: true,
        header: true,
      },
    });

    return config;
  },
};
