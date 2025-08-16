const withNextIntl = require('next-intl/plugin')();

const config = withNextIntl({
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
});

console.log('Next.js Config:', JSON.stringify(config, null, 2));

module.exports = config;